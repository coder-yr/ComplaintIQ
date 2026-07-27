from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

class ComplaintWorkflowState(BaseModel):
    raw_document: Any = None
    raw_text: str = ""
    cleaned_text: str = ""
    extracted_data: Optional[Dict[str, Any]] = None
    validation_status: bool = False
    risk_assessment: Optional[Dict[str, Any]] = None
    summary: str = ""
    copilot_context: str = ""
    confidence_score: float = 0.0
    missing_fields: List[str] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)
    errors: List[str] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)
