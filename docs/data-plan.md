# Week 3 - Data Plan

Everything in this project comes from one CSV file that lives in the repo. No APIs, no
keys, no network. If the Wi-Fi dies on Demo Day the server still works, which is the
whole reason I went with a file instead of hitting some expenses API.

File: `./data/expenses.csv`
Auth: none
Rate limits: none (it's a file on disk)

## The three P0 tools

| tool | source | fixture path | auth | rate limits | failure modes | example response |
| add_expense | local CSV, append a row | ./data/expenses.csv | none | none | file doesn't exist yet, file open in Excel so it's locked, bad rows already in the file, date or amount that doesn't make sense | below |
| list_expenses | local CSV, read and filter | ./data/expenses.csv | none | none | file doesn't exist, file is empty, a row has the wrong number of columns, amount isn't a number, filter matches nothing | below |
| get_spending_summary | local CSV, read and add up | ./data/expenses.csv | none | none | file doesn't exist, file is empty, bad row, asking for a month with no expenses, a junk amount that breaks the total | below |

## What the CSV looks like

```csv
id,date,amount,category,note
exp_001,2026-07-02,15.00,food,Lunch at campus cafeteria
exp_002,2026-07-03,40.00,transport,Gas
exp_003,2026-07-05,120.00,food,Weekly groceries
```

## Example responses

These are what the stubs will eventually return for real.

add_expense:

```json
{
  "id": "exp_009",
  "date": "2026-07-29",
  "amount": 15,
  "category": "food",
  "note": "Lunch at the campus cafeteria"
}
```

list_expenses:

```json
[
  {
    "id": "exp_001",
    "date": "2026-07-02",
    "amount": 15,
    "category": "food",
    "note": "Lunch at campus cafeteria"
  },
  {
    "id": "exp_003",
    "date": "2026-07-05",
    "amount": 120,
    "category": "food",
    "note": "Weekly groceries"
  }
]
```

get_spending_summary:

```json
{
  "month": "2026-07",
  "total": 511.25,
  "byCategory": {
    "food": 167,
    "transport": 100,
    "entertainment": 25.5,
    "rent": 200,
    "other": 18.75
  }
}
```

## What happens when things break

If the file isn't there, reads just return nothing and writes create it with a header
row first. Same idea for an empty file, that's zero expenses, not an error, so the
summary comes back with a total of 0.

Bad rows are the annoying case. If a row has the wrong column count or an amount that
won't parse, I skip it and keep going, but I return a `skippedRows` count so you can
tell something was wrong instead of quietly getting the wrong total.

Bad arguments never reach my code at all. The Zod schema rejects them first, so a
negative amount or a month like "July" gets an error back and the CSV is never touched.

For writes I'll write to a temp file and rename it over the original. If the process
dies halfway through, the original file is still fine. This was the main risk I
listed in design.md so I wanted an actual plan for it.

The assignment mentions HTTP 5xx, timeouts and "city not found" but none of those
apply here since nothing goes over the network. Noting it so it's clear I didn't just
skip that part.

## Staying in scope

All three tools read the same file. Not adding a database, not adding an API, not
adding a second data source. The P1 tools later on will use this same CSV.