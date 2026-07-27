from app.ai.state import ComplaintWorkflowState
from app.ai.clients.groq_client import groq_client
from app.ai.prompts.system import SYSTEM_PROMPT
from app.ai.prompts.extraction import EXTRACTION_PROMPT
import logging

logger = logging.getLogger(__name__)

async def field_extraction_node(state: ComplaintWorkflowState) -> dict:
    logger.info("Running Field Extraction Node")
    
    user_prompt = EXTRACTION_PROMPT.format(text=state.cleaned_text)
    
    data, metadata = await groq_client.invoke_json(
        system_prompt=SYSTEM_PROMPT,
        user_prompt=user_prompt,
        temperature=0.1,
        max_tokens=1024
    )
    
    new_metadata = state.metadata.copy()
    new_metadata["field_extraction"] = metadata
    
    if metadata.get("error") or not data:
        errors = state.errors + [f"Extraction Error: {metadata.get('error', 'No data returned')}"]
        return {"extracted_data": None, "metadata": new_metadata, "errors": errors}
        
    # Inject standard metadata for each field
    processed_data = {}
    for key, field_info in data.items():
        if isinstance(field_info, dict):
            processed_data[key] = {
                "value": field_info.get("value"),
                "confidence": field_info.get("confidence", 0),
                "source": "AI",
                "userEdited": False
            }
        else:
            # Fallback if LLM didn't format properly
            processed_data[key] = {
                "value": field_info,
                "confidence": 0,
                "source": "AI",
                "userEdited": False
            }
            
    return {"extracted_data": processed_data, "metadata": new_metadata}
