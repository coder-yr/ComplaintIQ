# ADR 001: Use React and Redux Toolkit for Frontend

## Status
Accepted

## Context
The application requires a highly interactive UI for form filling, reviewing AI-extracted data, and chatting with an AI Copilot. We need a way to manage complex asynchronous state effectively.

## Decision
We will use React as the primary UI library and Redux Toolkit (RTK) for state management.

## Consequences
- **Positive:** Predictable state management, excellent developer tooling, and efficient handling of asynchronous API states via RTK Thunks.
- **Negative:** Slightly higher learning curve and boilerplate compared to simple React Context.
