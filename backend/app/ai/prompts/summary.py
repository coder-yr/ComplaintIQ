SUMMARY_PROMPT = """Generate a concise, 1-paragraph summary of the following customer complaint incident.
Focus on the product, the core issue, and the impact.
Do not include any JSON formatting, just return the text.

Extracted Data:
{extracted_data}

Complaint Text:
{text}
"""
