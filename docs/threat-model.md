# Week 4 — Threat model

Expense Tracker MCP. Tool arguments come from a model, not a person, so I treat them
like untrusted HTTP input.

## Assets

- `./data/expenses.csv` — the only real data in the project. Losing it or corrupting it
  breaks the demo; leaking it exposes my spending history.
- The rest of the filesystem — anything my server could read if a path escaped `./data`
  (`.env`, `package.json`, files outside the repo entirely).
- No API keys, no tokens, no credentials. Nothing external to steal.

## Trust boundaries

- **Model → tool arguments.** Every field in every Zod schema. This is the main
  boundary and the only one an attacker actually controls.
- **Tool → filesystem.** `src/lib/paths.ts` and `src/lib/csv.ts`. Everything that
  touches disk goes through `resolveDataPath()`.
- **Tool → network.** None. No tool makes a request. `src/lib/http.ts` exists with a
  working `fetchJson()` but nothing calls it.
- **Server → model.** What I return. Oversized responses are a real problem here even
  though they aren't an "attack."

## Top 5 risks

1. **Uncapped resource output.** `expenses://fixture` returns the whole CSV with no
   limit. It's 10 rows today, but `add_expense` grows it every call. Nothing stops it
   flooding the model's context.
2. **Unused fetch helper becomes SSRF.** `http.ts` takes any URL. If a future tool
   passes a model-supplied string to it, that's a request to anywhere — including
   internal addresses.
3. **Path traversal if I add a file argument.** No tool takes a filename today, so the
   hardcoded `"expenses.csv"` protects me by accident. The first tool that accepts a
   path makes `resolveDataPath()` the only defence.
4. **Unbounded `note` field.** `add_expense` accepts a string of any length and writes
   it into the CSV. A very long note bloats the file and every later read.
5. **Raw row data in logs.** `logFailure()` prints the whole bad CSV line to stderr,
   including the note column.

## Mitigations this week

1. Cap `expenses://fixture` at 50 rows plus a total count — size cap.
2. Delete `http.ts`, or add a hostname allowlist and keep the existing 8s timeout.
3. Add a test asserting `resolveDataPath("../package.json")` throws, so the guard can't
   be removed without a failure.
4. Add `.max(200)` to `note` and `.max(40)` to `category` in the Zod schema.
5. Log only the row number and the reason, not the row contents.

## Out of scope

- **Auth and multi-user.** Single local user, one CSV, no server exposed to a network.
- **Encryption at rest.** The data is fake fixture spending in a public repo.
- **Rate limiting.** Local file access, no quota to protect.
- **Supply-chain auditing.** Two dependencies, both from the MCP SDK ecosystem.

All four are fine to skip because this server runs on my own machine over stdio, not as
a hosted service. If it were ever deployed, auth and rate limiting would come first.