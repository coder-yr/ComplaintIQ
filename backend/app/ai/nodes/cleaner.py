from app.ai.state import ComplaintWorkflowState
import logging
import re

logger = logging.getLogger(__name__)

async def text_cleaner_node(state: ComplaintWorkflowState) -> dict:
    logger.info("Running Text Cleaner")
    text = state.raw_text
    
    # Strip unnecessary boilerplate, non-ASCII chars if needed, and normalize spaces
    if text:
        text = re.sub(r'\s+', ' ', text).strip()
    
    return {"cleaned_text": text}
