from app.ai.state import ComplaintWorkflowState
from app.ai.prompts.copilot import COPILOT_CONTEXT_PROMPT
import logging
import json

logger = logging.getLogger(__name__)

async def copilot_context_builder_node(state: ComplaintWorkflowState) -> dict:
    logger.info("Running Copilot Context Builder Node")
    
    context_str = COPILOT_CONTEXT_PROMPT.format(
        summary=state.summary,
        risk=json.dumps(state.risk_assessment or {}),
        missing_fields=json.dumps(state.missing_fields),
        warnings=json.dumps(state.warnings)
    )
    
    return {"copilot_context": context_str}
