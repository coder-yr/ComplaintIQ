from app.ai.state import ComplaintWorkflowState
from app.ai.clients.groq_client import groq_client
from app.ai.prompts.system import SYSTEM_PROMPT
from app.ai.prompts.risk import RISK_REASONING_PROMPT
import logging
import json

logger = logging.getLogger(__name__)

async def risk_assessment_node(state: ComplaintWorkflowState) -> dict:
    logger.info("Running Risk Assessment Node")
    
    data = state.extracted_data or {}
    
    # 1. Rule Validation based on extracted fields
    severity = str(data.get("severity") or "LOW").upper()
    priority = str(data.get("priority") or "LOW").upper()
    
    # Hybrid Rules
    desc = str(data.get("description") or "").lower()
    if "death" in desc or "hospital" in desc or "allergy" in desc:
        severity = "SEVERE"
        priority = "CRITICAL"
        state.warnings.append("System upgraded risk to SEVERE/CRITICAL based on keyword detection.")
        
    # 2. LLM Reasoning
    user_prompt = RISK_REASONING_PROMPT.format(
        extracted_data=json.dumps(data),
        warnings=json.dumps(state.warnings)
    )
    
    risk_data, metadata = await groq_client.invoke_json(
        system_prompt=SYSTEM_PROMPT,
        user_prompt=user_prompt,
        temperature=0.1,
        max_tokens=512
    )
    
    new_metadata = state.metadata.copy()
    new_metadata["risk_assessment"] = metadata
    
    rationale = "No rationale provided."
    if risk_data and not metadata.get("error"):
        rationale = risk_data.get("rationale", rationale)
        
    final_risk = {
        "severity": severity,
        "priority": priority,
        "rationale": rationale
    }
    
    return {"risk_assessment": final_risk, "metadata": new_metadata}
