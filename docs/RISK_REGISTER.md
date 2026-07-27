# Risk Register

| Risk | Impact | Probability | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **Groq API Unavailable** | High | Low | Implement retries and a graceful failure UI that allows manual entry. |
| **Invalid JSON Output** | High | Medium | Use Pydantic validation, low temperature, and LangGraph retry loops. |
| **PDF Unreadable (Scanned)** | Medium | Medium | Display an error and fallback to manual text paste/entry. |
| **Hallucinated Data Fields** | High | Low | Enforce human-in-the-loop (HITL). Users MUST review extracted data before saving. |
| **Prompt Injection** | Medium | Low | Restrict LLM permissions; it only returns JSON and has no execution access. |
| **Rate Limit Exceeded** | Medium | High | Implement exponential backoff in the Groq client. |
