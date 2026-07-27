# API Specification

## Base URL
`/api/v1`

## Endpoints

### 1. Analyze Complaint
- **Method:** `POST`
- **URL:** `/complaints/analyze`
- **Description:** Triggers the LangGraph AI workflow.

**Request Example:**
```json
{
  "raw_text": "Customer John Doe reported that Aspirin 500mg Batch B12345 from 2023-10-27 had crumbled tablets."
}
```

**Success Response (200 OK):**
```json
{
  "extracted_data": {
    "customer_name": "John Doe",
    "product": "Aspirin 500mg",
    "batch_number": "B12345",
    "incident_date": "2023-10-27",
    "description": "Tablets were crumbled."
  },
  "risk_assessment": {
    "severity": "Low",
    "priority": "Medium",
    "rationale": "Crumbled tablets do not pose an immediate health risk but indicate a quality issue."
  }
}
```

**Failure Response (429 Too Many Requests):**
```json
{
  "detail": "Rate limit exceeded. Please try again in 30 seconds."
}
```

### 2. Save Complaint
- **Method:** `POST`
- **URL:** `/complaints`

**Request Example:**
```json
{
  "customer_name": "John Doe",
  "product_name": "Aspirin 500mg",
  "batch_number": "B12345",
  "incident_date": "2023-10-27",
  "description": "Tablets were crumbled.",
  "severity": "Low",
  "priority": "Medium",
  "ai_rationale": "Crumbled tablets..."
}
```

**Success Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Complaint saved successfully"
}
```
