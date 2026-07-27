# ADR 004: Use PostgreSQL (Neon) for Database

## Status
Accepted

## Context
We need to store highly structured data (complaints) with strict schema validation and potential relational links (products, audit logs). 

## Decision
We will use PostgreSQL hosted on Neon (Serverless Postgres).

## Consequences
- **Positive:** ACID compliance, strong data integrity, and serverless scaling with branchable databases for easy development/testing.
- **Negative:** Requires careful schema migration management (Alembic).
