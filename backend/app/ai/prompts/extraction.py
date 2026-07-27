EXTRACTION_PROMPT = """Extract the following fields from the provided complaint text:
- complaint_source (e.g. Email, Phone, Web, FDA)
- customer_name
- product_name
- product_strength (e.g. 500mg, 10mg/ml)
- batch_number (or lot number)
- manufacturing_date (format YYYY-MM-DD if possible)
- expiry_date (format YYYY-MM-DD if possible)
- quantity_affected (e.g. 5 kg, 2 bottles)
- complaint_type (e.g. Adverse Event, Product Defect, Packaging)
- complaint_date (format YYYY-MM-DD if possible)
- incident_date (format YYYY-MM-DD if possible)
- description (Detailed summary of the complaint)
- severity (suggest initial severity: LOW, MODERATE, HIGH, SEVERE based purely on the text)
- priority (suggest initial priority: LOW, MEDIUM, HIGH, CRITICAL based purely on the text)

If a field is completely missing, return null for its value. Do not invent information.

Output strictly as a valid JSON object matching this schema where each field is an object containing 'value' and 'confidence' (0 to 100):
{{
  "complaint_source": {{"value": "string or null", "confidence": "integer"}},
  "customer_name": {{"value": "string or null", "confidence": "integer"}},
  "product_name": {{"value": "string or null", "confidence": "integer"}},
  "product_strength": {{"value": "string or null", "confidence": "integer"}},
  "batch_number": {{"value": "string or null", "confidence": "integer"}},
  "manufacturing_date": {{"value": "string or null", "confidence": "integer"}},
  "expiry_date": {{"value": "string or null", "confidence": "integer"}},
  "quantity_affected": {{"value": "string or null", "confidence": "integer"}},
  "complaint_type": {{"value": "string or null", "confidence": "integer"}},
  "complaint_date": {{"value": "string or null", "confidence": "integer"}},
  "incident_date": {{"value": "string or null", "confidence": "integer"}},
  "description": {{"value": "string", "confidence": "integer"}},
  "severity": {{"value": "string or null", "confidence": "integer"}},
  "priority": {{"value": "string or null", "confidence": "integer"}}
}}

Complaint Text:
{text}
"""
