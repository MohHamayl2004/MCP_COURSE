# Example conversations

Three examples of how someone would actually use the Expense Tracker MCP with a model.
Each one shows the user's prompt, the tool calls the model is expected to make, and the
answer the user should end up reading — not the raw tool JSON.

The fixture data used in these examples is `data/expenses.csv`.

---

## A — Logging two expenses at once

**User:** "I spent 15 on lunch and 40 on gas today."

**Expected tool calls**

1. `add_expense` with `{ "date": "2026-08-17", "amount": 15, "category": "food", "note": "Lunch" }`
2. `add_expense` with `{ "date": "2026-08-17", "amount": 40, "category": "transport", "note": "Gas" }`

The model fills in today's date because the user said "today", and maps "lunch" to
`food` and "gas" to `transport` on its own — the category descriptions in the schema are
what make that possible.

**A good final answer**

> Saved both — 15 for food and 40 for transport, dated today. That's 55 added.

Not a dump of the two returned records, and not the generated ids, which the user
doesn't care about unless they want to delete something later.

---

## B — Asking where the money went

**User:** "How much did I spend in July, and on what?"

**Expected tool calls**

1. `get_spending_summary` with `{ "month": "2026-07" }`

One call is enough — the tool returns the total and the per-category breakdown together,
so the model shouldn't also call `list_expenses` to work it out itself.

**A good final answer**

> You spent 511.25 in July. The biggest chunk was rent at 200, then food at 167 and
> transport at 100. Entertainment was 25.50 and other bits came to 18.75.

Sorted largest first, written as a sentence. The user asked a question about their
money, so they should get an answer about their money, not a table of JSON keys.

---

## C — Drilling into one category

**User:** "What am I actually spending on food? Show me the individual items."

**Expected tool calls**

1. `list_categories` with `{}` — optional, only if the model needs to confirm that
   "food" is a category that exists in the data
2. `list_expenses` with `{ "month": "2026-07", "category": "food" }`

If the user hadn't named a month, the model should either ask which month or default to
the current one and say so, rather than listing everything ever recorded.

**A good final answer**

> In July you spent 167 on food across three purchases: weekly groceries at 120, dinner
> with friends at 32, and lunch at the campus cafeteria at 15. Groceries account for
> most of it.

The individual rows the user asked for, plus one line of interpretation. If more than
20 rows come back, the response includes a `truncated` count, and the model should say
"showing the first 20 of 34" rather than silently hiding the rest.

---

## What a bad answer looks like

For contrast, none of these are acceptable final answers:

- Pasting the raw JSON from the tool result
- "I called add_expense twice and it returned exp_011 and exp_012."
- Reporting an empty month as an error — `list_expenses` for a month with no data
  returns "No expenses matched.", which means *you spent nothing*, not *something broke*
- Inventing a total instead of calling `get_spending_summary`
