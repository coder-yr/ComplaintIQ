from app.ai.state import ComplaintWorkflowState
from app.ai.clients.groq_client import groq_client
from app.ai.prompts.system import SYSTEM_PROMPT
from app.ai.prompts.summary import SUMMARY_PROMPT
import logging
import json

logger = logging.getLogger(__name__)

async def complaint_summary_node(state: ComplaintWorkflowState) -> dict:
    logger.info("Running Complaint Summary Node")
    
    data = state.extracted_data or {}
    
    user_prompt = SUMMARY_PROMPT.format(
        extracted_data=json.dumps(data),
        text=state.cleaned_text
    )
    
    summary_text, metadata = await groq_client.invoke_text(
        system_prompt=SYSTEM_PROMPT,
        user_prompt=user_prompt,
        temperature=0.3,
        max_tokens=256
    )
    
    new_metadata = state.metadata.copy()
    new_metadata["summary"] = metadata
    
    summary = summary_text if summary_text and not metadata.get("error") else "Could not generate summary."
    
    return {"summary": summary, "metadata": new_metadata}
