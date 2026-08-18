# Expense Tracker MCP

An MCP server that lets an AI assistant answer questions about your spending. Add an
expense in plain language, list what you spent in a given month or category, and get a
monthly total with a per-category breakdown — all read from and written to a single
local CSV file.

Everything runs offline. There are no API keys, no accounts, and no network calls, so
the server works with the Wi-Fi switched off.

## Requirements

- [Node.js](https://nodejs.org/) 20 or newer (`node --version` to check)
- [Git](https://git-scm.com/)

That's it. No database, no API keys.

## Install

```bash
git clone https://github.com/MohHamayl2004/MCP_COURSE.git
cd MCP_COURSE
npm install
```

## Run

```bash
npm run dev
```

You should see `mcprepo MCP server running on stdio`, then nothing else — that means
it's working and waiting for an MCP client. Press `Ctrl+C` to stop it.

To run the tests:

```bash
npm test
```

27 tests covering the pure helper functions: CSV escaping and parsing, filtering,
monthly summaries, id generation and output caps.

## Try it in Inspector

The easiest way to see the tools working:

```bash
npx @modelcontextprotocol/inspector npx tsx src/index.ts
```

Open the URL it prints, click the toggle next to the server to connect, then open the
**Tools** tab. Select `list_expenses`, leave the arguments empty and hit **Execute
Tool** — you should get the sample expenses back.

## Use it with Claude Desktop

Open Claude Desktop → **Settings** → **Developer** → **Edit Config**, and add this
inside `mcpServers` (keep anything already in the file):

```json
{
  "mcpServers": {
    "expense-tracker": {
      "command": "npx",
      "args": ["tsx", "C:\\path\\to\\MCP_COURSE\\src\\index.ts"]
    }
  }
}
```

Replace the path with wherever you cloned the repo. On macOS or Linux use a normal path
like `/Users/you/MCP_COURSE/src/index.ts`.

Quit Claude Desktop completely and reopen it — it only reads that file at launch. The
server should then appear under **Manage connectors**, and you can just ask:

> How much did I spend in July?

The data folder is resolved relative to the project, not your working directory, so it
works no matter where Claude launches the process from. Set `EXPENSES_DATA_DIR` if you
want to point it at a different CSV.

## Tools

| tool | what it does | inputs |
|---|---|---|
| `add_expense` | Saves a new expense to the CSV and returns it with a new id | `date` (YYYY-MM-DD), `amount` (positive number), `category`, `note` (optional, max 200 chars) |
| `list_expenses` | Lists expenses, optionally filtered | `month` (YYYY-MM, optional), `category` (optional), `limit` (1–100, default 20) |
| `get_spending_summary` | Monthly total plus a per-category breakdown | `month` (YYYY-MM) |
| `list_categories` | Every category present in the data | `month` (YYYY-MM, optional) |
| `delete_expense` | Removes one expense by id | `id` (e.g. `exp_003`) |
| `get_top_expenses` | The largest expenses, optionally for one month | `month` (YYYY-MM, optional), `limit` (1–100) |

## Resources

Read-only context the assistant can pull without calling a tool:

| uri | contents |
|---|---|
| `expenses://fixture` | The raw CSV, capped at 50 rows |
| `expenses://categories` | The list of categories currently in use |

## Example prompts

Once the server is connected to an MCP client, these all work in plain language:

- "I spent 15 on lunch and 40 on gas today."
- "How much did I spend this month?"
- "Show me everything I spent on food in July."
- "What categories am I tracking?"
- "What was my biggest expense in July?"

See [`examples/conversations.md`](examples/conversations.md) for three worked examples
showing the tool calls behind each prompt and what a good final answer looks like.

## Data

All expenses live in `data/expenses.csv`, which is committed to the repo so the project
has data to work with straight after cloning. The columns are:

```csv
id,date,amount,category,note
exp_001,2026-07-02,15.00,food,Lunch at campus cafeteria
```

To reset it to the committed state at any time:

```bash
git checkout data/expenses.csv
```

## Troubleshooting

**"Cannot find module '@modelcontextprotocol/server'"**
You skipped `npm install`, or it failed part way. Run it again from the repo root — not
from inside `src/`.

**Inspector connects then immediately shows "Disconnected"**
The server crashed on startup. Run `npx tsx src/index.ts` on its own to see the error.
The usual cause is a stray `console.log` somewhere in `src/` — stdout carries the MCP
protocol, so anything printed there breaks the connection. Use `console.error` instead.

**`list_expenses` returns nothing, or `skippedRows` is above 0**
The server reads `data/expenses.csv` relative to the folder you started it from, so run
it from the repo root. If rows are being skipped, some lines in the CSV don't match the
expected shape — ids must look like `exp_001` and dates must be valid `YYYY-MM-DD`.
Check stderr, which logs the line number of every skipped row.

## Project docs

- [`docs/design.md`](docs/design.md) — scope, tool inventory, success criteria
- [`docs/data-plan.md`](docs/data-plan.md) — data sources and failure modes
- [`docs/threat-model.md`](docs/threat-model.md) — assets, risks, mitigations
- [`docs/test-plan.md`](docs/test-plan.md) — manual test cases and results
- [`SECURITY.md`](SECURITY.md) — how to report an issue

## License

MIT — see [LICENSE](LICENSE).
