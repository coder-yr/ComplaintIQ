from app.ai.state import ComplaintWorkflowState
import logging
import datetime

logger = logging.getLogger(__name__)

async def schema_validation_node(state: ComplaintWorkflowState) -> dict:
    logger.info("Running Schema Validation Node")
    
    data = state.extracted_data or {}
    
    missing_fields = []
    warnings = []
    errors = state.errors.copy()
    
    # Business Rules
    mandatory_fields = ["customer_name", "description"]
    for field in mandatory_fields:
        if not data.get(field):
            missing_fields.append(field)
            warnings.append(f"Mandatory field '{field}' is missing.")
            
    # Date validation
    date_str = data.get("incident_date")
    if date_str:
        try:
            datetime.datetime.strptime(date_str, "%Y-%m-%d")
        except ValueError:
            warnings.append(f"Incident date '{date_str}' is not in YYYY-MM-DD format.")
            data["incident_date"] = None
            
    # Confidence Score calculation
    total_fields = 7
    found_fields = sum(1 for v in data.values() if v is not None and str(v).strip() != "")
    confidence_score = round(found_fields / total_fields, 2) if total_fields > 0 else 0.0
    
    # Check for empty description
    if not data.get("description"):
        errors.append("Validation Error: Description cannot be completely empty.")
        return {
            "validation_status": False,
            "confidence_score": 0.0,
            "missing_fields": missing_fields,
            "warnings": warnings,
            "errors": errors
        }
        
    return {
        "extracted_data": data,
        "validation_status": True,
        "confidence_score": confidence_score,
        "missing_fields": missing_fields,
        "warnings": warnings,
        "errors": errors
    }
