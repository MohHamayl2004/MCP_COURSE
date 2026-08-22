# Demo script — Expense Tracker MCP

**Length:** 5 minutes. **Presenters:** Mohammad Hamayl and Malak Shamasneh.

Live tool calls in Claude Desktop, with Inspector open in a second tab as the fallback.

---

## Before I start

- [ ] `git checkout data/expenses.csv` — fixture back to 9 known rows
- [ ] Claude Desktop already open, `expense-tracker` connected, one throwaway message sent so the connection is warm
- [ ] Inspector already running in another window, connected
- [ ] Slides open on slide 1
- [ ] Notifications off, phone silent

The last item matters more than it sounds — a notification popup mid-demo costs ten seconds and all my momentum.

---

## 0:00–0:40 — The problem

*Slide 1: title. Slide 2: the problem.*

> Tracking spending by hand is tedious, so people stop doing it and then have no idea where their money went. The apps that solve this want your bank login and a subscription.
>
> My project takes the opposite approach. Your expenses stay in a plain CSV on your own machine, and an AI assistant becomes the interface to it. You talk, it records and answers. No accounts, no API keys, and it works with the Wi-Fi off.

**Don't** list the six tools here. That's the next section, and repeating it wastes the opening.

---

## 0:40–1:10 — Architecture

*Slide 3: the one diagram.*

> Three layers, each with one job.
>
> The **schema** validates every argument before my code runs — tool arguments come from a model, not a person, so I treat them like untrusted input. It also describes each field, which is how the model knows what to send; it has never seen my code.
>
> The **tool** exposes a function over the protocol and decides how the answer is worded.
>
> The **lib** does the actual work — filtering, totals, safe file writes — and knows nothing about MCP. That's why 27 unit tests cover the logic without ever starting a server.

Thirty seconds. If I'm at 1:20 here, I skip straight to the demo.

---

## 1:10–3:30 — Live tool calls

Claude Desktop, full screen, font already enlarged.

### Prompt 1 — writing (about 50 seconds)

> "I spent 15 on lunch and 40 on gas today."

Expect: two `add_expense` calls.

While it runs:

> Notice I never said the word "category". The model read my schema, saw the descriptions, and mapped lunch to food and gas to transport on its own. That mapping isn't in my code — it comes from how I wrote the field descriptions.

### Prompt 2 — reading (about 60 seconds)

> "How much did I spend in July, and on what?"

Expect: one `get_spending_summary` call, total **511.25**.

While it runs:

> One call, not two. The tool returns the total and the breakdown together, so the model doesn't have to fetch every row and add them up itself. That's deliberate — arithmetic belongs in code, where it's deterministic and tested, not in the model.

### Prompt 3 — the failure (about 40 seconds)

> "Add an expense of -50 on food."

Expect: rejected — *amount must be greater than zero*.

> That's the schema refusing it before my handler ever runs, so nothing was written to the file. This is the part I'd argue matters most: an MCP server is a public interface that a model can call with anything, so validation is the boundary.

**Backup prompt** if any of the above misbehaves:

> "What were my three biggest expenses in July?"

Expect: `get_top_expenses` → utilities 200, groceries 120, bus pass 60.

---

## 3:30–4:30 — What I'd build next

*Slide 4: tools table. Slide 5: next steps.*

> Six tools and two read-only resources, all against one CSV.
>
> Next: SQLite instead of a flat file, budgets that warn when a category goes over, and month-over-month comparison.
>
> One thing I'd do differently from the start — my first CSV writer joined fields with commas while the reader split on them, so a note containing a comma silently corrupted a row. A peer caught it in review. Everything looked fine until someone tried the input I hadn't thought of. That case is now the first unit test in the file.

---

## 4:30–5:00 — Questions

Prepared answers:

**Why a CSV and not a database?** One user, one file, works offline, readable in Excel. A database is more machinery than this problem needs — and swapping it later only touches one file, because the storage is behind the lib.

**What stops a tool reading other files?** Every file access goes through one function that resolves the path and rejects anything outside the data folder. No tool takes a filename as an argument, so there's nothing for a model to inject.

**What if the file gets huge?** Lists are capped and report how many rows were hidden, so a growing file can't flood the model's context.

**Why not let the model read the CSV directly?** Then it does arithmetic on raw text and can be wrong. `get_spending_summary` computes the total in code — same input, same answer, every time.

---

## If the Wi-Fi dies

Nothing changes. There are no network calls anywhere in the project — no API keys, no external services. The CSV is committed to the repo, so the demo runs entirely offline.

If **Claude Desktop** itself fails to connect, I switch to Inspector, already open in the other window, and call the same three tools by hand. The story is identical; only the client changes.

---

## Rehearsal log

| run | time | cut |
|---|---|---|
| 1 | | |
| 2 | | |

If I'm over 5 minutes, I cut a slide — never the live demo. The live calls are the whole point; the slides are scaffolding.
