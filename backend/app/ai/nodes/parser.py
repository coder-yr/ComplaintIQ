from app.ai.state import ComplaintWorkflowState
import logging

logger = logging.getLogger(__name__)

async def document_parser_node(state: ComplaintWorkflowState) -> dict:
    logger.info("Running Document Parser")
    # In this phase, we are just accepting raw_text from the API.
    # Later, we can add PDF/File parsing logic here.
    return {"raw_text": state.raw_text}
