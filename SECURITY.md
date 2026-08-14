# Security

## Supported versions

This is a student project. Only the current `main` branch of this repository is
supported. There are no releases and no older versions to patch.

## Reporting an issue

Email the mentor: <Mjaradat@nextflows.ai> ,
or open an issue in this repository and tag @mohammad-jaradat.

Please don't open a public issue for anything you believe is exploitable — email first.

## What this server does and doesn't do

The Expense Tracker MCP reads and writes a single local CSV file over stdio. It runs on
one developer's machine. It is not hosted, has no authentication, and makes no network
requests.

## Hardening in place

**Input validation.** Every tool argument goes through a Zod schema before any handler
runs. Strings have length caps (`note` 200 chars), numbers have ranges (`amount` must be
positive and at most 1,000,000, `limit` between 1 and 100), dates must match `YYYY-MM-DD`
and months `YYYY-MM`, and `category` is a fixed enum. Invalid input is rejected before
the CSV is touched.

**File access allowlist.** All disk reads go through `resolveDataPath()`, which resolves
the path and rejects anything landing outside `./data`. No tool accepts a filename as an
argument. Attempts like `../../etc/passwd` are refused, and the rejected path is not
echoed back in the error.

**Network allowlist and timeout.** No tool makes a network request. The unused
`fetchJson()` helper enforces an empty host allowlist, requires HTTPS, and applies an
8-second `AbortSignal.timeout`, so it fails closed if it is ever wired up.

**Output caps.** `list_expenses` returns at most 100 rows (20 by default) and reports how
many were truncated. The `expenses://fixture` resource returns at most 50 rows plus a
count of what was hidden. This keeps a growing CSV from flooding the model's context.

**Logging.** Failures go to stderr with a tool name, a reason, and a row number — never
row contents, which may hold personal notes. Nothing reads or prints environment
variables.

## Secrets

This project requires no API keys or tokens. `.env`, `.env.local`, and common key
filenames are gitignored, and `.env.example` contains placeholders only. The repository
history has been searched for committed credentials; none were found.

## Out of scope

No authentication, encryption at rest, rate limiting, or dependency auditing. The server
runs locally over stdio against fixture data. If it were ever deployed as a hosted
service, authentication would be the first addition.