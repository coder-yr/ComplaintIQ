# ADR 003: Use LangGraph for AI Orchestration

## Status
Accepted

## Context
The AI extraction and risk assessment process involves multiple steps (extraction, validation, risk assessment). Managing this procedurally can lead to brittle code and difficult error recovery.

## Decision
We will use LangGraph to model the AI workflow as a state graph.

## Consequences
- **Positive:** Clearly defined state transitions, built-in support for cycles (retries), and easier debugging of the AI pipeline.
- **Negative:** Adds a dependency and requires understanding of graph-based execution models.
