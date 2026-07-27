RISK_REASONING_PROMPT = """You are tasked with determining the final risk assessment for a pharmaceutical complaint.
You will be provided with the extracted data and any rule-based validation warnings.

Based on the information, provide a brief rationale (1-2 sentences) explaining why this complaint should be classified with its current severity and priority, and if they should be escalated.

Output strictly as a valid JSON object matching this schema:
{{
  "rationale": "string"
}}

Extracted Data:
{extracted_data}

Rule Warnings:
{warnings}
"""
