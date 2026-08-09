# Week 4 — Threat model

Rule I'm working from: tool arguments come from a model, not a person, so treat them
like untrusted HTTP input.

## What each tool touches

| tool | disk | network | user-controlled strings |
|---|---|---|---|
| add_expense | write (append) | no | date, amount, category, note |
| list_expenses | read | no | month, category |
| get_spending_summary | read | no | month |
| delete_expense (P1 stub) | would rewrite | no | id |
| get_top_expenses (P1 stub) | read | no | month, limit |
| list_categories (P1 stub) | read | no | none |
| expenses://fixture (resource) | read | no | none |
| expenses://categories (resource) | read | no | none |

## The four risks, applied to my project

**1. Path traversal — low right now, easy to break later.**
No tool takes a file path as an argument. Every read goes through
`resolveDataPath("expenses.csv")`, a hardcoded name, and that helper already rejects
anything resolving outside `./data`. The risk is future me: the moment I add a tool
that accepts a filename, the guard is the only thing standing between a model and
`../../.env`. Keep the guard, never call `fs.readFileSync` directly.

**2. SSRF — not applicable, but there's dead code.**
No tool makes a network request. However `src/lib/http.ts` exists with a working
`fetchJson()` that takes any URL. Nothing calls it today. If someone wires it to a
tool argument later, that's an SSRF hole. Either delete it or add an allowlist before
it's ever used.

**3. Secret leaks — low, but worth checking.**
No API keys anywhere. Things to verify: `.env` is gitignored (only `.env.example` is
committed), and `logFailure()` writes the raw CSV line to stderr on a bad row — if the
notes column ever holds something sensitive, that ends up in logs. Also `node_modules`
was committed early in this repo's history, so old commits are worth a glance.

**4. Runaway responses — this is my real risk.**
`list_expenses` is capped at 20 items via `cap()`. Good. But `expenses://fixture`
returns the **entire CSV with no limit**. Right now that's 10 rows, but nothing stops
the file growing to thousands after repeated `add_expense` calls, and the whole thing
would land in the model's context. `get_spending_summary` is naturally bounded (one
object per category), so it's fine.

## What I'll harden next

1. Cap or paginate the `expenses://fixture` resource — biggest actual gap.
2. Decide on `http.ts`: delete it, or allowlist it before anything calls it.
3. Add a test that `resolveDataPath("../package.json")` throws, so the guard can't be
   removed silently.
4. Cap `note` length in `add_expense` so one huge string can't bloat the CSV.