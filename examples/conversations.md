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

1. `list_expenses` with `{ "category": "food" }`

No month was named, so the model shouldn't invent one. Listing everything and splitting
it by month in the answer is better than silently guessing "this month" — the user finds
out what the whole picture looks like and can narrow down from there.

**A good final answer**

> Every food item on record comes to 232. July was 167: weekly groceries at 120, dinner
> with friends at 32, and lunch at the campus cafeteria at 15. August so far is 65
> across three smaller items.
>
> The split is really one grocery run at 120 versus eating out at 112 spread over five
> purchases — the eating-out side accumulates in small, frequent bites.

The individual rows the user asked for, plus one line of interpretation. If more than 20
rows come back the response includes a `truncated` count, and the model should say
"showing the first 20 of 34" rather than silently hiding the rest.

**Watch for over-reading.** With this data a model may also note that six weeks with one
grocery run suggests some spending isn't being logged. That's a reasonable observation,
but it's inference from missing rows, not something the tools returned — so it should be
phrased as a question rather than a finding.

---

## What a bad answer looks like

For contrast, none of these are acceptable final answers:

- Pasting the raw JSON from the tool result
- "I called add_expense twice and it returned exp_011 and exp_012."
- Reporting an empty month as an error — `list_expenses` for a month with no data
  returns "No expenses matched.", which means *you spent nothing*, not *something broke*
- Inventing a total instead of calling `get_spending_summary`
