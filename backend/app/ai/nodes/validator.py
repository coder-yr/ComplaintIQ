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
    
    # Business Rules for missing/unknown fields
    important_fields = [
        "customer_name", "description", "product_name", 
        "batch_number", "manufacturing_date", "expiry_date"
    ]
    
    unknown_keywords = ["unknown", "n/a", "unavailable", "none", "not provided"]
    
    for field in important_fields:
        field_obj = data.get(field)
        val = field_obj.get("value") if isinstance(field_obj, dict) else field_obj
        
        # Check if missing or string value indicates it's unknown
        is_missing = not val
        if isinstance(val, str) and val.lower().strip() in unknown_keywords:
            is_missing = True
            
        if is_missing:
            missing_fields.append(field)
            if field in ["customer_name", "description", "product_name"]:
                warnings.append(f"Mandatory field '{field}' is missing.")
            
    # Date validation
    date_str_obj = data.get("incident_date")
    date_str = date_str_obj.get("value") if isinstance(date_str_obj, dict) else date_str_obj
    if date_str:
        try:
            datetime.datetime.strptime(date_str, "%Y-%m-%d")
        except ValueError:
            warnings.append(f"Incident date '{date_str}' is not in YYYY-MM-DD format.")
            if isinstance(date_str_obj, dict):
                data["incident_date"]["value"] = None
            else:
                data["incident_date"] = None
            
    # Confidence Score calculation
    total_fields = 12
    found_fields = sum(1 for v in data.values() if isinstance(v, dict) and v.get("value") is not None and str(v.get("value")).strip() != "")
    
    # Calculate average confidence of extracted fields
    valid_confidences = [v.get("confidence", 0) for v in data.values() if isinstance(v, dict) and v.get("value") is not None and str(v.get("value")).strip() != ""]
    confidence_score = sum(valid_confidences) / len(valid_confidences) / 100.0 if valid_confidences else 0.0
    
    # Check for empty description
    desc_obj = data.get("description")
    desc_val = desc_obj.get("value") if isinstance(desc_obj, dict) else desc_obj
    if not desc_val:
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
