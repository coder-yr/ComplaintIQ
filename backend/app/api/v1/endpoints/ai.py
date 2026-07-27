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

@router.post("/analyze", response_model=StandardResponse[AIResponseData])
async def analyze_complaint(request: AnalyzeRequest):
    logger.info("Received request to analyze complaint.")
    try:
        initial_state = ComplaintWorkflowState(raw_text=request.raw_text)
        
        result = await complaint_pipeline.ainvoke(initial_state.model_dump())
        
        data = AIResponseData(
            extracted_data=result.get("extracted_data"),
            risk_assessment=result.get("risk_assessment"),
            summary=result.get("summary", ""),
            confidence_score=result.get("confidence_score", 0.0),
            missing_fields=result.get("missing_fields", []),
            warnings=result.get("warnings", []),
            errors=result.get("errors", [])
        )
        
        metadata = result.get("metadata", {})
        logger.info(f"AI Pipeline completed. Latency: {metadata.get('latency', 0):.2f}s, Tokens: {metadata.get('total_tokens', 0)}")
        
        return StandardResponse(
            success=True,
            message="Analysis complete",
            data=data
        )
    except Exception as e:
        logger.error(f"Error in AI pipeline: {e}")
        raise HTTPException(status_code=500, detail="An error occurred during AI analysis.")

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
