# Expense Tracker MCP – Data Plan

## Data Source

The project stores expense records in a local CSV file.

**Fixture path:** `data/expenses.csv`

- Authentication: **None**
- Rate limits: **None**
- Works completely offline.

| Tool | Source | Fixture Path | Auth | Failure Modes | Example Response |
|------|--------|--------------|------|---------------|------------------|

| `get_monthly_summary` | Local CSV | `data/expenses.csv` | None | CSV file not found, empty CSV file, invalid month format, no expenses for the requested month | `{"month":"2026-08","total":130,"byCategory":{"Food":20,"Transport":40,"Shopping":70}}` |

| `add_expense` | Local CSV | `data/expenses.csv` | None | CSV file not found, invalid date format, invalid amount, failed to save expense | `{"id":4,"date":"2026-08-03","amount":15,"category":"Food","note":"Lunch"}` |

| `list_expenses` | Local CSV | `data/expenses.csv` | None | CSV file not found, empty CSV file, invalid filter values | `[{"id":1,"date":"2026-08-01","amount":20,"category":"Food","note":"Breakfast"}]` |

| `delete_expense` | Local CSV | `data/expenses.csv` | None | CSV file not found, invalid row number, row does not exist, empty CSV file | `{"deleted":true,"row":2}` |

## Notes

- Expense data is stored in `data/expenses.csv`.
- `add_expense` appends a new expense record to the CSV file.
- `list_expenses` reads expense records and optionally filters them.
- `get_monthly_summary` reads all expenses for the requested month and calculates the total spending and category breakdown.
- `delete_expense` removes the selected expense row from the CSV file and saves the updated file.