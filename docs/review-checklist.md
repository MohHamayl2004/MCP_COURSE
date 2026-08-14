## Action items

| # | finding | priority | owner | due date | status |
|---|---|---|---|---|---|
| 1 | CSV values written with `.join(",")` and read with `.split(",")`; a note containing a comma or quote corrupts the row | P0 | Mohammad Hamayl | 2026-08-15 | Done |
| 2 | `date` regex accepts impossible dates such as 2026-13-45 | P0 | Mohammad Hamayl | 2026-08-15 | Done |
| 3 | `list_categories` returns hardcoded values instead of reading the CSV | P1 | Mohammad Hamayl | 2026-08-15 | Done |
| 4 | `month` parameter validated but unused in `list_categories` | P1 | Mohammad Hamayl | 2026-08-15 | Done |
| 5 | `nextId()` stripped non-digits from every id, so one malformed id produced `exp_7.35e+23` and every later row collided with it — found while testing fix 1, not in the original review | P0 | Mohammad Hamayl | 2026-08-15 | Done |
| 6 | No README | P1 | Mohammad Hamayl | 2026-08-22 | Open |

## Fixes

All P0 items were fixed by Mohammad Hamayl on `week-4-harden` within the same week.

| # | fix | verification |
|---|---|---|
| 1 | Added `src/lib/csv-format.ts` with `toCsvValue()` for writing and `parseCsvLine()` for reading. Values containing a comma, quote or newline are quoted on write, inner quotes doubled, and quoted fields parsed correctly on read. | Added an expense with the note `Lunch, coffee and a "large" tea`, then listed expenses. The note round-tripped intact with `skippedRows: 0`. Screenshot attached. |
| 2 | Date regex in `expense-row.ts` and `add_expense.ts` now validates month `01–12` and day `01–31`. | `safeParse` with `2026-13-45` returns a rejection. |
| 3, 4 | `list_categories` now reads distinct categories from the CSV and honours the optional `month` filter. The `[P1 — not implemented]` prefix was removed from its description. | Verified in Inspector with and without a month argument. |
| 5 | `nextId()` now matches ids strictly against `/^exp_(\d+)$/` and ignores malformed ones; `expenseRowSchema` rejects ids that don't match, so a bad row is skipped rather than poisoning the generator. | New expenses receive sequential ids such as `exp_009`. |