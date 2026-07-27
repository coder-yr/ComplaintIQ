from langgraph.graph import StateGraph, END
from app.ai.state import ComplaintWorkflowState
from app.ai.nodes.parser import document_parser_node
from app.ai.nodes.cleaner import text_cleaner_node
from app.ai.nodes.extractor import field_extraction_node
from app.ai.nodes.validator import schema_validation_node
from app.ai.nodes.risk import risk_assessment_node
from app.ai.nodes.summary import complaint_summary_node
from app.ai.nodes.copilot import copilot_context_builder_node

workflow = StateGraph(ComplaintWorkflowState)

# Add nodes
workflow.add_node("parser", document_parser_node)
workflow.add_node("cleaner", text_cleaner_node)
workflow.add_node("extractor", field_extraction_node)
workflow.add_node("validator", schema_validation_node)
workflow.add_node("risk", risk_assessment_node)
workflow.add_node("summary", complaint_summary_node)
workflow.add_node("copilot", copilot_context_builder_node)

# Set entry point
workflow.set_entry_point("parser")

# Add linear edges
workflow.add_edge("parser", "cleaner")
workflow.add_edge("cleaner", "extractor")
workflow.add_edge("extractor", "validator")
# Per architecture decision, API & JSON decoding retries are handled inside groq_client.
# Validation failures due to missing inputs/rules are NOT retried.
workflow.add_edge("validator", "risk")
workflow.add_edge("risk", "summary")
workflow.add_edge("summary", "copilot")
workflow.add_edge("copilot", END)

# Compile
complaint_pipeline = workflow.compile()
