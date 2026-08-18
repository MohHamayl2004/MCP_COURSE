# Example Conversations

This document shows example conversations for using the MCP expense server with a model.

## Conversation A — Get Monthly Summary

### User Prompt

> How much did I spend in August 2026?

### Expected Tool Call

1. `get_monthly_summary`
   - `month`: `"2026-08"`

### Good Final Answer

> You spent $591.50 in August 2026. Your spending was divided across food, transport, entertainment, and rent.


## Conversation B — Delete an Expense

### User Prompt

> Delete the expense with ID 4.

### Expected Tool Call

1. `delete_expense`
   - `id`: `4`

### Good Final Answer

> Expense ID 4 was deleted successfully.


## Conversation C — Delete an Expense and Get Updated Monthly Summary

### User Prompt

> Delete expense ID 4, then show me my updated spending summary for August 2026.

### Expected Tool Calls

1. `delete_expense`
   - `id`: `4`

2. `get_monthly_summary`
   - `month`: `"2026-08"`

### Good Final Answer

> Expense ID 4 was deleted successfully. Your updated spending summary for August 2026 has been calculated based on the remaining expenses.