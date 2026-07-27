EXTRACTION_PROMPT = """Extract the following fields from the provided complaint text:
- customer_name
- product_name
- batch_number
- incident_date (format YYYY-MM-DD if possible)
- description
- severity (suggest initial severity: LOW, MODERATE, HIGH, SEVERE based purely on the text)
- priority (suggest initial priority: LOW, MEDIUM, HIGH, CRITICAL based purely on the text)

If a field is completely missing, return null for that field. Do not invent information.

Output strictly as a valid JSON object matching this schema:
{{
  "customer_name": "string or null",
  "product_name": "string or null",
  "batch_number": "string or null",
  "incident_date": "string or null",
  "description": "string",
  "severity": "string or null",
  "priority": "string or null"
}}

Complaint Text:
{text}
"""
