# Week 4 — Threat model

Expense Tracker MCP. Tool arguments come from a model, not a person, so I treat them
like untrusted HTTP input.

## Assets

`./data/expenses.csv` is the only real data — corrupting it breaks the demo, leaking it
exposes my spending. Beyond that, the rest of the filesystem, which my server could
reach if a path escaped `./data`. No API keys or tokens anywhere.

## Trust boundaries

- **Model → tool arguments** — every Zod schema field. The only surface an attacker controls.
- **Tool → filesystem** — `paths.ts` and `csv.ts`; all disk access goes through `resolveDataPath()`.
- **Tool → network** — none. No tool makes a request.
- **Server → model** — response size, which matters even though it isn't an attack.

## Top 5 risks

1. `expenses://fixture` returns the whole CSV uncapped, and `add_expense` grows that file every call.
2. `src/lib/http.ts` accepts any URL. Unused today, but an SSRF hole the moment a tool passes it a model-supplied string.
3. No tool takes a filename yet, so the hardcoded `"expenses.csv"` protects me by accident. The first path argument makes `resolveDataPath()` the only defence.
4. `note` accepts a string of any length and writes it straight into the CSV.
5. `logFailure()` prints whole bad CSV rows to stderr, note column included.

## Mitigations this week

1. Cap the fixture resource at 50 rows plus a total count.
2. Delete `http.ts`, or add a hostname allowlist and keep the 8s timeout.
3. Test that `resolveDataPath("../package.json")` throws, so the guard can't be silently removed.
4. `.max(200)` on `note`, `.max(40)` on `category`.
5. Log the row number and reason only, never row contents.

## Out of scope

No auth, no encryption at rest, no rate limiting, no dependency auditing. This runs on
my own machine over stdio, not as a hosted service, the data is fake, and local file
access has no quota to protect. If it were ever deployed, auth would come first.