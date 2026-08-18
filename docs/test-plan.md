# Manual Test Plan

This test plan covers the two assigned tools:

* `get_monthly_summary`
* `delete_expense`

The `result` and `evidence` columns will be completed during Section 5.2 after running the tests in MCP Inspector.

| ID    | Tool                  | Setup                                                                               | Input                                       | Expected                                                                                                               | Result | Evidence |
| ----- | --------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------ | -------- |
| TC-01 | `get_monthly_summary` | `data/expenses.csv` contains valid expenses for August 2026.                        | `{"month":"2026-08"}`                       | Returns the correct monthly total and category breakdown using real CSV data.                                          |        |          |
| TC-02 | `get_monthly_summary` | Server is running normally.                                                         | `{"month":"2026-13"}`                       | Input is rejected because the month is outside the valid `01-12` range.                                                |        |          |
| TC-03 | `get_monthly_summary` | `data/expenses.csv` contains no expenses for December 2026.                         | `{"month":"2026-12"}`                       | Returns a valid empty summary with `total: 0`, an empty category breakdown, and a clear message instead of failing.    |        |          |
| TC-04 | `get_monthly_summary` | Add one malformed row to `data/expenses.csv` while keeping other rows valid.        | `{"month":"2026-08"}`                       | Skips the invalid row, calculates the summary from valid rows, and reports the skipped row count without crashing.     |        |          |
| TC-05 | `delete_expense`      | `data/expenses.csv` contains an expense with a known unique ID, for example ID `4`. | `{"id":4}`                                  | Deletes only the expense with ID `4` and returns the deleted expense record.                                           |        |          |
| TC-06 | `delete_expense`      | ID `999` does not exist in `data/expenses.csv`.                                     | `{"id":999}`                                | Returns a short sanitized error message and does not delete any other expense.                                         |        |          |
| TC-07 | `delete_expense`      | Server is running normally.                                                         | `{"id":0}`                                  | Input is rejected by Zod because the ID must be a positive integer.                                                    |        |          |
| TC-08 | `delete_expense`      | Delete a valid ID once, then run the same delete request again.                     | Same ID as the previous successful deletion | The second request returns a clean not-found error and does not delete a different expense whose row position shifted. |        |          |

## Fixture Reset Notes

Before running the happy-path tests, reset `data/expenses.csv` to a known valid fixture so expected totals and IDs are predictable.

After any `delete_expense` test, restore the fixture before running another test that depends on specific IDs or monthly totals.

For the malformed-row test, add one invalid row only for that case, then restore the valid fixture afterward.
