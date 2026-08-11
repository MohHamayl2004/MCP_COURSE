# Security

## Supported versions

Only the current `main` branch of this repository is
supported. There are no releases and no older versions to patch.

## Reporting an issue

1. Email the mentor: <Mjaradat@nextflows.ai> , or   
2. Open an issue in this repository and tag @mohammad-jaradat.

## What this server does and doesn't do

The Expense Tracker MCP reads and writes a single local CSV file over stdio. It runs on
one developer's machine. It is not hosted, has no authentication, and makes no network
requests.

## Security Measures

* **Input validation:** `getMonthlySummary` validates the month format (`YYYY-MM`) before processing. `deleteExpense` validates that the row number is a positive integer and rejects rows outside the available expense data.
* **Data access:** Both operations use the application's controlled `expenses.csv` data source rather than accepting arbitrary file paths from the caller.
* **Capped:** `deleteExpense` is limited to deleting a single expense row per call.
* **Timed out:** No explicit timeout is required for these operations because they only process local CSV data and do not perform external network requests.
* **Error handling:** Invalid inputs return short, actionable error messages instead of exposing raw stack traces.

## Secrets

This project requires no API keys or tokens. `.env`, `.env.local`, and common key
filenames are gitignored, and `.env.example` contains placeholders only. The repository
history has been searched for committed credentials; none were found.

## Out of scope

No authentication, encryption at rest, rate limiting, or dependency auditing. The server
runs locally over stdio against fixture data. If it were ever deployed as a hosted
service, authentication would be the first addition.