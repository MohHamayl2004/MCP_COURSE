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
| `delete_expense` | Local CSV | `data/expenses.csv` | None | CSV file not found, invalid row number, row does not exist, empty CSV file | `{"deleted":true,"row":2}` |

## Notes

- Expense data is stored in `data/expenses.csv`.
- `get_monthly_summary` reads all expenses for the requested month and calculates the total spending and category breakdown.
- `delete_expense` removes the selected expense row from the CSV file and saves the updated file.


## Failure Modes

*get_monthly_summary*
CSV file not found
Empty CSV file
Invalid month format
Invalid CSV data
No expenses found for the requested month

*delete_expense*
CSV file not found
Empty CSV file
Invalid row number
Row not found
Failed to save updated CSV