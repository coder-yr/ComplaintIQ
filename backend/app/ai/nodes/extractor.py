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
    
    if metadata.get("error"):
        errors = state.errors + [f"Extraction Error: {metadata['error']}"]
        return {"extracted_data": None, "metadata": new_metadata, "errors": errors}
        
    return {"extracted_data": data, "metadata": new_metadata}
