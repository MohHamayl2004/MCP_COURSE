# Expense Tracker MCP — Design

## Pitch
Tracking spending by hand is tedious, so people stop doing it and lose sight of where money goes. This is for me (and anyone who wants a quick personal money overview).
a single user who keeps expenses in a simple local file. The MCP exposes tools to add an expense, list expenses, and summarize spending by month and category, so an AI assistant can answer "where did my money go?" straight from my data.

## User & demo story
On Demo Day I tell the assistant "I spent 15 on lunch and 40 on gas today." It calls `add_expense` twice to save both records. Then I ask "how much did I spend this month?" — it calls `get_monthly_summary`, which returns my total plus a per-category breakdown, and the assistant replies "You've spent ₪312 this month: ₪120 food, ₪90 transport, ₪102 other." Finally I ask "show me everything in food" and it calls `list_expenses` filtered to that category and lists the items. All of it runs offline from a local CSV.

## Tool inventory

- `add_expense` (P0) — Save a new expense record. Inputs: date, amount, category, note. Output: `{ id, date, amount, category, note }`.
- `list_expenses` (P0) — List expenses, optionally filtered by month or category. Inputs: month?, category?. Output: `[{ id, date, amount, category, note }]`.
- `get_monthly_summary` (P0) — Total spending + per-category breakdown for a month. Input: month. Output: `{ total, byCategory: { category: amount } }`.
- `delete_expense` (P1) — Remove one expense by id. Input: id. Output: `{ deleted: true, id }`.
- `get_top_expenses` (P1) — The N largest expenses in a period. Inputs: month?, limit. Output: `[{ id, amount, category, note }]`.
- `list_categories` (P1) — All categories seen so far. Inputs: none. Output: `[category]`.

## Out of scope (will NOT build)
- No authentication or multi-user accounts (single local user only).
- No paid APIs or bank/account integrations.
- No mobile or web UI — tools only, driven through an assistant.
- No editing existing expenses (only add and delete).

## Success criteria (provable live)
- [ ] `add_expense` saves a record and it shows up in `list_expenses`.
- [ ] `get_monthly_summary` returns the correct total and category breakdown for fixture data.
- [ ] `list_expenses` filtered by category returns only matching rows.

## Risks
1. **CSV read/write bugs (corrupting or duplicating data).** Mitigation: use a well-tested parser, back the file up before writes during dev, and add a fixture file so demos never depend on live-entered data.
2. **Running out of time on P1 tools.** Mitigation: get the 3 P0 tools fully working first; leave P1 tools as stubs if needed — Demo Day only needs P0.