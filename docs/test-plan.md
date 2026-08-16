# Week 5 — Manual test plan

Test cases for the Expense Tracker MCP, written before running them so the boring cases
get covered and not just the happy path.

**How to run:** `npx @modelcontextprotocol/inspector npx tsx src/index.ts`, connect, then
call each tool with the input below.

**Fixture reset:** several cases write to or move `data/expenses.csv`. Reset it before
each run with:

```powershell
git checkout data/expenses.csv
```

The committed fixture has 9 rows: 5 food, 2 transport, 1 entertainment, 1 rent, 1 other
(8 rows dated 2026-07, 1 dated 2026-08).

## Cases

| id | tool | setup | input | expected | result | evidence |
|---|---|---|---|---|---|---|
| T-01 | `add_expense` | Fixture reset | `examples/add_expense.json` — `{"date":"2026-07-29","amount":15,"category":"food","note":"Lunch at the campus cafeteria"}` | Success. Returns the saved record with the next sequential id (`exp_010`). A new row appears in the CSV. | | |
| T-02 | `list_expenses` | Fixture reset | `examples/list_expenses.json` — `{"month":"2026-07","category":"food"}` | Success. Returns only July food rows (`exp_001`, `exp_003`, `exp_006`) with `skippedRows: 0` and `truncated: 0`. | | |
| T-03 | `get_spending_summary` | Fixture reset | `examples/get_spending_summary.json` — `{"month":"2026-07"}` | Success. `total: 511.25` with a per-category breakdown of food 167, transport 100, entertainment 25.5, rent 200, other 18.75. | | |
| T-04 | `add_expense` | Fixture reset | `{"date":"2026-13-45","amount":25,"category":"food"}` | Rejected by the schema before the handler runs: "Date must be a valid YYYY-MM-DD". No row is written to the CSV. | | |
| T-05 | `list_expenses` | Fixture reset | `{"limit":9999}` | Rejected by the schema: limit must be 100 or less. Note Inspector's form clamps this client-side, so verify with `safeParse` from the terminal as well. | | |
| T-06 | `get_spending_summary` | Fixture reset | `{"month":"August"}` | Rejected by the schema: month must be in YYYY-MM format. | | |
| T-07 | `list_expenses` | Fixture reset | `{"month":"2026-01"}` | Success, not an error. Returns "No expenses matched." Empty data is a valid answer. | | |
| T-08 | `get_spending_summary` | Fixture reset | `{"month":"2026-01"}` | Success, not an error. Returns "No expenses recorded for 2026-01." with no crash. | | |
| T-09 | `list_expenses` | Rename the fixture away: `Rename-Item data\expenses.csv data\expenses.bak` | `{}` | Handled offline: returns "No expenses matched." and logs "data/expenses.csv not found" to stderr. No stack trace reaches the model. Restore with `Rename-Item data\expenses.bak data\expenses.csv`. | | |
| T-10 | `add_expense` then `list_expenses` | Fixture reset | Add `{"date":"2026-08-12","amount":25,"category":"food","note":"Lunch, coffee and a \"large\" tea"}`, then list with `{}` | The note round-trips exactly, including the comma and the quotes, with `skippedRows: 0`. Proves CSV escaping on write and quote-aware parsing on read. | | |
| T-11 | `add_expense` | Fixture reset | `{"date":"2026-07-29","amount":25,"category":"../../etc/passwd"}` | Rejected: category may only contain letters, numbers, spaces and hyphens. Nothing is written. | | |
| T-12 | `list_categories` | Fixture reset | `{}` and `{"month":"2026-07"}` | Returns the categories actually present in the CSV, sorted. The month variant excludes any category not used in July. | | |

## Coverage

- Happy path, one per P0 tool: T-01, T-02, T-03
- Invalid input, one per P0 tool: T-04, T-05, T-06
- Empty data: T-07, T-08
- Offline / missing file: T-09
- Data integrity and validation extras: T-10, T-11, T-12

`result` and `evidence` are left blank on purpose — they get filled in during the next
section, after the cases are actually run.
