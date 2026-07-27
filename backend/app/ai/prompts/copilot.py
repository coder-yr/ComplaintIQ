COPILOT_CONTEXT_PROMPT = """Assemble a unified context string that will be used to prime the Copilot chat for this complaint.
It should include the summary, key fields, risk assessment, and missing fields.
Do not include any JSON formatting, just return the text block.

Summary:
{summary}

Risk Assessment:
{risk}

Missing Fields:
{missing_fields}

Warnings:
{warnings}
"""
