# Expense Management MCP Server

An MCP (Model Context Protocol) server for managing personal expenses stored in a local CSV file.

The server provides tools for adding, listing, summarizing, and deleting expense records. It includes input validation, CSV validation, safe error handling, and protections against common data-handling issues.

## Requirements

Before running the project, make sure you have:

* Node.js 20 or later
* npm
* Git
* A terminal or command-line environment

## Installation

Clone the repository:

```bash
git clone https://github.com/MohHamayl2004/MCP_COURSE.git
```

Move into the project directory:

```bash
cd MCP_COURSE
```

Install the project dependencies:

```bash
npm install
```

No authentication or API key is required for the local expense tools.

If environment variables are introduced, use `.env.example` as a template and keep `.env` out of Git.

## Run the Server

Start the MCP server in development mode:

```bash
npm run dev
```

You can also start it with:

```bash
npm start
```

To check that the TypeScript project builds successfully:

```bash
npm run build
```

## Run with MCP Inspector

Launch MCP Inspector with:

```bash
npm run inspect
```

The command starts MCP Inspector and connects it to:

```text
src/index.ts
```

After Inspector opens:

1. Connect to the MCP server.
2. Open the **Tools** section.
3. Select the tool you want to test.
4. Enter valid input.
5. Run the tool and inspect the response.

## Tools

| Tool                  | Description                                                                              |
| --------------------- | ---------------------------------------------------------------------------------------- |
| `add_expense`         | Adds a new expense to the local CSV file.                                                |
| `list_expenses`       | Lists stored expenses with supported filters.                                            |
| `get_monthly_summary` | Returns total spending and category totals for a selected month.                         |
| `delete_expense`      | Deletes an expense using its unique expense ID.                                          |
| `get_top_expenses`    | Returns the largest expense records using the requested limit and optional month filter. |

## Example Tool Usage

### Add an Expense

Example input:

```json
{
  "date": "2026-08-18",
  "amount": 25.5,
  "category": "food",
  "note": "Lunch"
}
```

### List Expenses

Example input:

```json
{
  "month": "2026-08"
}
```

### Get Monthly Summary

Example input:

```json
{
  "month": "2026-08"
}
```

The month must use the `YYYY-MM` format and contain a valid month from `01` to `12`.

If no expenses exist for the requested month, the tool returns a valid empty summary instead of failing.

### Delete an Expense

Example input:

```json
{
  "id": 4
}
```

Expenses are deleted using their unique IDs instead of CSV row positions because row positions can change after records are removed.

## Example Prompts

Example prompts that can trigger the expense tools include:

```text
Add a food expense of 25.50 for August 18, 2026 with the note "Lunch".
```

```text
Show me my expense summary for August 2026.
```

```text
List my expenses for August 2026.
```

```text
Delete the expense with ID 4.
```

## Data Storage

Expense records are stored locally in:

```text
data/expenses.csv
```

The expected CSV header is:

```csv
id,date,amount,category,note
```

Example data:

```csv
id,date,amount,category,note
1,2026-08-01,12.50,food,Breakfast
2,2026-08-03,35.00,transport,Taxi
3,2026-08-05,75.25,entertainment,Cinema
```

Expense records are validated when they are read and before they are written.

Malformed rows are skipped instead of causing all valid expense data to fail.

## Validation and Reliability

The project includes several safeguards:

* Zod input validation
* Strict month validation
* Positive integer validation for expense IDs
* CSV record validation
* Malformed-row handling
* Expense deletion using stable unique IDs
* Safe filesystem path resolution
* Sanitized model-facing error messages
* Detailed failures logged to `stderr`
* Temporary-file writing before replacing `expenses.csv`
* `.env` files excluded from Git

Internal error details are not returned to the model. The model receives short, safe messages while debugging information remains in the server logs.

## Troubleshooting

### 1. `npm run dev` fails because modules are missing

Run:

```bash
npm install
```

Then try again:

```bash
npm run dev
```

### 2. MCP Inspector does not start or connect

First verify the project can start normally:

```bash
npm run dev
```

Stop it, then launch Inspector:

```bash
npm run inspect
```

If Inspector still fails, check the terminal for server-side error messages.

### 3. Expense results are missing or unexpected

Check:

```text
data/expenses.csv
```

Make sure the CSV starts with:

```csv
id,date,amount,category,note
```

Also verify that IDs, dates, amounts, and categories contain valid values.

Malformed rows may be skipped during parsing rather than included in summaries or tool results.

## Testing

The manual Week 5 test plan is documented in:

```text
docs/test-plan.md
```

It covers happy paths, validation failures, empty-data handling, malformed CSV records, ID-based deletion, and repeated deletion safety.

If automated smoke tests are available, run:

```bash
npm test
```

## Project Structure

```text
.
├── data/
│   └── expenses.csv
├── docs/
│   ├── data-plan.md
│   ├── review-checklist.md
│   ├── test-plan.md
│   └── threat-model.md
├── examples/
├── src/
│   ├── lib/
│   ├── resources/
│   ├── schemas/
│   ├── tools/
│   └── index.ts
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── tsconfig.json
```

## License

This project is intended for educational use as part of the Next Flows Academy MCP coursework.
Academy link: https://nextflows.ai/academy/

## Author 

Malak Shamasneh