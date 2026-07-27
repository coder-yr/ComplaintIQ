from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Any, Dict, List, Optional
import logging
from app.ai.workflow import complaint_pipeline
from app.ai.state import ComplaintWorkflowState
from app.schemas.common import StandardResponse

logger = logging.getLogger(__name__)

router = APIRouter()

class AnalyzeRequest(BaseModel):
    raw_text: str

class AIResponseData(BaseModel):
    extracted_data: Optional[Dict[str, Any]]
    risk_assessment: Optional[Dict[str, Any]]
    summary: str
    confidence_score: float
    missing_fields: List[str]
    warnings: List[str]
    errors: List[str]

from fastapi.responses import StreamingResponse
import json

@router.post("/analyze")
async def analyze_complaint(request: AnalyzeRequest):
    logger.info("Received request to analyze complaint via SSE.")
    
    async def event_generator():
        try:
            initial_state = ComplaintWorkflowState(raw_text=request.raw_text)
            
            # 1. Send initial state
            yield f"data: {json.dumps({'status': 'Uploading', 'message': 'Initializing...'})}\n\n"
            
            # The LangGraph stream yields states as each node completes
            # Node order: parser -> cleaner -> extractor -> validator -> risk -> summary -> copilot
            
            node_status_map = {
                "parser": {"status": "Cleaning Text", "message": "Parsing document..."},
                "cleaner": {"status": "Extracting Fields", "message": "Cleaning text..."},
                "extractor": {"status": "Validating", "message": "Extracting structured data..."},
                "validator": {"status": "Assessing Risk", "message": "Validating fields..."},
                "risk": {"status": "Generating Summary", "message": "Assessing risk..."},
                "summary": {"status": "Preparing Copilot", "message": "Generating summary..."},
                "copilot": {"status": "Completed", "message": "Copilot ready."}
            }
            
            final_data = None
            async for output in complaint_pipeline.astream(initial_state.model_dump(), stream_mode="updates"):
                # output is a dict like {"node_name": {...state_updates...}}
                for node_name, state_updates in output.items():
                    if node_name in node_status_map:
                        step_info = node_status_map[node_name]
                        yield f"data: {json.dumps(step_info)}\n\n"
                    
                    if node_name == "copilot":
                        # We reached the end, capture the final state
                        final_data = state_updates
            
            # Send the final payload
            if final_data:
                response_payload = {
                    "status": "Final",
                    "data": {
                        "extracted_data": final_data.get("extracted_data"),
                        "risk_assessment": final_data.get("risk_assessment"),
                        "summary": final_data.get("summary", ""),
                        "confidence_score": final_data.get("confidence_score", 0.0),
                        "missing_fields": final_data.get("missing_fields", []),
                        "warnings": final_data.get("warnings", []),
                        "errors": final_data.get("errors", []),
                        "metadata": final_data.get("metadata", {})
                    }
                }
                yield f"data: {json.dumps(response_payload)}\n\n"
                
        except Exception as e:
            logger.error(f"Error in AI pipeline SSE: {e}")
            yield f"data: {json.dumps({'status': 'Failed', 'message': str(e)})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

class CopilotMessage(BaseModel):
    role: str
    content: str

class CopilotRequest(BaseModel):
    complaint: Dict[str, Any]
    history: List[CopilotMessage]
    message: str

class CopilotResponseData(BaseModel):
    reply: str

@router.post("/copilot", response_model=StandardResponse[CopilotResponseData])
async def ask_copilot(request: CopilotRequest):
    logger.info("Received request for AI Copilot.")
    
    import json
    from app.ai.clients.groq_client import groq_client
    
    system_prompt = f"""You are an AI Quality Assurance Copilot.
You answer ONLY using the supplied complaint context.
If information is unavailable, say "I couldn't find that information in this complaint."
Never invent values.
Keep answers concise.
When appropriate, reference extracted fields.

Complaint Context:
{json.dumps(request.complaint, indent=2)}"""

    history = [{"role": msg.role, "content": msg.content} for msg in request.history]
    
    reply_content, metadata = await groq_client.invoke_chat(
        system_prompt=system_prompt,
        chat_history=history,
        new_message=request.message,
    )
    
    if reply_content is None:
        raise HTTPException(status_code=500, detail="Failed to get response from Copilot API.")
        
    return StandardResponse(
        success=True,
        message="Copilot response generated",
        data=CopilotResponseData(reply=reply_content)
    )
