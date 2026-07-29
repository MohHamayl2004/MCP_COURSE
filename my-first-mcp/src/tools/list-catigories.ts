import { readFileSync } from "node:fs";
import path from "node:path";
import { McpServer } from "@modelcontextprotocol/server";
import { listCategoriesInputSchema } from "../schemas/list-catigories.js";

function readCategoriesFromCsv(): string[] {
  const filePath = path.resolve(process.cwd(), "expenses.csv");
  const content = readFileSync(filePath, "utf8");

  return Array.from(
    new Set(
      content
        .trim()
        .split(/\r?\n/)
        .slice(1)
        .filter(Boolean)
        .map((line: string) => {
          const [, , , category] = line.split(",");
          return category?.trim();
        })
        .filter((category): category is string => Boolean(category)),
    ),
  ).sort();
}

/** List all categories seen in the expense data. */
export function registerListCategoriesTool(server: McpServer): void {
  server.registerTool(
    "list_categories",
    {
      title: "List categories",
      description: "List all categories seen in expense records.",
      inputSchema: listCategoriesInputSchema,
    },
    async () => ({
      content: [
        {
          type: "text",
          text: JSON.stringify(readCategoriesFromCsv(), null, 2),
        },
      ],
    }),
  );
}
