# AI Evaluation Plan

To ensure the AI system performs at a production-ready level, we will track the following metrics during testing and beta phases.

## Metrics
1. **Extraction Accuracy:** % of fields correctly extracted compared to a human baseline. Target: >90%.
2. **Risk Classification Accuracy:** % of severity/priority scores matching a senior QA's assessment. Target: >85%.
3. **Response Latency:** End-to-end time for the LangGraph workflow. Target: < 5 seconds.
4. **JSON Validity Rate:** % of raw LLM outputs that successfully parse as JSON on the first try. Target: >95%.
5. **Hallucination Rate:** Frequency of the AI inventing data not present in the text. Target: <1%.
6. **Manual Correction Rate:** % of complaints where the user had to edit at least one AI-extracted field before saving. Target: <20%.

## Testing Methodology
- A golden dataset of 50 historical complaints will be used to benchmark the system before deployment.
