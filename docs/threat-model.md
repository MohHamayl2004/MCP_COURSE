# Threat Model

## Assets

- `data/expenses.csv` containing expense records.
- MCP server and filesystem access.
- Expense data returned by MCP tools.
- API credentials or tokens if introduced later.

## Trust Boundaries

- Model → MCP tool arguments: inputs such as `month` and `row` are untrusted.
- MCP tools → `src/lib/expenses.ts`: inputs must be validated before reaching the data layer.
- Data layer → `data/expenses.csv`: filesystem access must remain limited to the intended file.

## Top 5 Risks

1. Invalid `month` input in `get_monthly_summary`.
2. Invalid or unsafe `row` input in `delete_expense`.
3. Path traversal if filesystem paths become user-controlled.
4. Excessive records or output from `list_expenses`.
5. Accidental exposure of secrets in source code, logs, or Git.

## Mitigations This Week

- Validate `month` with a strict `YYYY-MM` format.
- Validate `row` as a positive integer and reject invalid/nonexistent rows cleanly.
- Keep the expense CSV path fixed and prevent user-controlled filesystem paths.
- Add output limits or pagination for large expense lists.
- Keep secrets out of source code and Git; use environment variables when needed.

## Out of Scope

- Full production authentication and authorization.
- Database-level security.
- Multi-user concurrency.
- Cloud infrastructure and network isolation.