import { randomUUID } from "node:crypto";
import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { McpServer } from "@modelcontextprotocol/server";

import { addExpenseInputSchema, addExpenseOutputSchema } from "../schemas/add_expense.js";

const DATA_DIR = path.resolve(process.cwd(), "data");
const CSV_PATH = path.join(DATA_DIR, "expenses.csv");
const CSV_HEADER = "id,date,amount,category,note";

function escapeCsvField(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

async function ensureCsvFile(): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await readFile(CSV_PATH, "utf8");
  } catch {
    await appendFile(CSV_PATH, `${CSV_HEADER}\n`, "utf8");
  }
}

export function registerAddExpenseTool(server: McpServer): void {
  server.registerTool(
    "add_expense",
    {
      title: "Add Expense",
      description:
        "Save a new expense record (date, amount, category, optional note) to the local expense log. Call this whenever the user reports spending money.",
      inputSchema: addExpenseInputSchema,
      outputSchema: addExpenseOutputSchema,
    },
    async ({ date, amount, category, note }) => {
      await ensureCsvFile();

      const id = randomUUID();
      const row = [id, date, String(amount), category, note ?? ""]
        .map(escapeCsvField)
        .join(",");
      await appendFile(CSV_PATH, `${row}\n`, "utf8");

      const output = { id, date, amount, category, note: note ?? "" };
      return {
        content: [{ type: "text", text: JSON.stringify(output) }],
        structuredContent: output,
      };
    }
  );
}
