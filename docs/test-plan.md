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

**Run date:** 2026-08-16 — all 12 cases PASS, no code changes were needed.

## Cases

| id | tool | setup | input | expected | result | evidence |
|---|---|---|---|---|---|---|
| T-01 | `add_expense` | Fixture reset | `{"date":"2026-08-16","amount":25,"category":"food","note":"nothing"}` | Success. Returns the saved record with the next sequential id (`exp_010`). A new row appears in the CSV. | PASS — returned `exp_010`, row count 9 → 10 | Figure 1 |
| T-02 | `list_expenses` | Fixture reset | `{"month":"2026-07","category":"food"}` | Only July food rows (`exp_001`, `exp_003`, `exp_006`), `skippedRows: 0`, `truncated: 0`. | PASS — 3 rows, `skippedRows: 0` | Inspector run |
| T-03 | `get_spending_summary` | Fixture reset | `{"month":"2026-07"}` | `total: 511.25`, breakdown food 167, transport 100, entertainment 25.5, rent 200, other 18.75. | PASS — total 511.25, breakdown exact | Inspector run |
| T-04 | `add_expense` | Fixture reset | `{"date":"2026-13-45","amount":25,"category":"food"}` | Rejected before the handler runs: "Date must be a valid YYYY-MM-DD". Nothing written. | PASS — rejected, CSV unchanged | Figure 2 |
| T-05 | `list_expenses` | Fixture reset | `{"limit":9999}` | Rejected: limit must be 100 or less. | PASS — "Too big: expected number to be <=100". Note Inspector's form clamps this client-side, so it was also checked with `safeParse` from the terminal. | Inspector run + terminal |
| T-06 | `get_spending_summary` | Fixture reset | `{"month":"August"}` | Rejected: month must be YYYY-MM. | PASS — "Month must be in YYYY-MM format (e.g. 2026-07)" | Inspector run |
| T-07 | `list_expenses` | Fixture reset | `{"month":"2026-01"}` | Success, not an error. "No expenses matched." | PASS — 0 matched, clean message | Figure 3 |
| T-08 | `get_spending_summary` | Fixture reset | `{"month":"2026-01"}` | Success, not an error. "No expenses recorded for 2026-01." | PASS — `count: 0`, `total: 0`, no crash | Inspector run |
| T-09 | `list_expenses` | Rename the fixture away: `Rename-Item data\expenses.csv data\expenses.bak` | `{}` | Handled offline: empty result plus "data/expenses.csv not found" on stderr. No stack trace reaches the model. | PASS — returned "No expenses recorded yet.", stderr logged the missing file, no stack trace | Inspector run |
| T-10 | `add_expense` then `list_expenses` | Fixture reset | Add note `Lunch, coffee and a "large" tea`, then list with `{}` | The note round-trips exactly, including the comma and quotes, `skippedRows: 0`. | PASS — note returned byte-for-byte, and survived the file rewrite from T-01 | Inspector run |
| T-11 | `add_expense` | Fixture reset | `{"date":"2026-07-29","amount":25,"category":"../../etc/passwd"}` | Rejected: category may only contain letters, numbers, spaces and hyphens. Nothing written. | PASS — rejected before the handler | Inspector run |
| T-12 | `list_categories` | Fixture reset | `{}` and `{"month":"2026-07"}` | Categories actually present in the CSV, sorted. Month variant excludes unused categories. | PASS — `["entertainment","food","other","rent","transport"]` | Inspector run |

## Coverage

- Happy path, one per P0 tool: T-01, T-02, T-03
- Invalid input, one per P0 tool: T-04, T-05, T-06
- Empty data: T-07, T-08
- Offline / missing file: T-09
- Data integrity and validation extras: T-10, T-11, T-12

## Failures and fixes

No case failed on this run. The two bugs these cases were written to catch had already
been fixed in Week 4, after the peer review:

- CSV escaping on write (`toCsvValue`) — commit `fix(week4): escape CSV values on write`
- Sequential id generation — commit `fix(week4): generate sequential ids and reject
  malformed ones`

Before running the plan, five rows left over from earlier manual testing were removed
from the fixture (three with UUID ids, two with `exp_7.35e+23` ids). They were the cause
of `skippedRows: 5` in the Week 4 screenshots. Commit: `docs(week5): add manual test
plan and clean fixture data`.

## Later

Ideas noticed while testing, deliberately not implemented now:

- `src/schemas/get-spending-summary.ts` exports a raw shape object while every other
  schema exports a `z.object(...)`. Both work with `registerTool`, but the inconsistency
  is confusing and makes the schema harder to unit test.
- `examples/` contains stale duplicates (`get-monthly-summary.json`,
  `delete-expense.json`) left over from the tool rename.
- No README yet.
- `delete_expense` and `get_top_expenses` are still stubs.
