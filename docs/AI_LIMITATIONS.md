# AI Limitations & Guardrails

## Core Principles
1. **AI Assists, Human Approves:** The AI is a tool to speed up data entry, not replace the Quality Assurance staff. A human must always review and save the final record.
2. **Hallucination Risk:** LLMs can confidently invent information (hallucinate). 
3. **Context Limits:** Large PDFs may exceed the token limit.

## System Guardrails
- **Validation:** Every AI output is schema-validated.
- **Editable Fields:** Every auto-populated field can be manually overridden by the user.
- **Auditability:** The original raw text is saved alongside the AI's extraction to allow future auditing.
- **Confidence:** (Future) Add confidence scores to extracted fields.
