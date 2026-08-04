import { readFile } from "node:fs/promises";
import path from "node:path";
import type { McpServer } from "@modelcontextprotocol/server";

const PROJECT_ROOT = process.cwd();

async function readProjectFile(relativePath: string): Promise<string> {
  const allowedPaths = new Set([
    "docs/design.md",
    "docs/data-plan.md",
    "data/expenses.csv",
  ]);

  if (!allowedPaths.has(relativePath)) {
    throw new Error(`Resource path is not allowed: ${relativePath}`);
  }

  const filePath = path.resolve(PROJECT_ROOT, relativePath);

  return readFile(filePath, "utf8");
}

export function registerProjectResources(server: McpServer): void {
  server.registerResource(
    "expense-tracker-design",
    "expenses://design",
    {
      title: "Expense Tracker Design",
      description:
        "Read-only project design, scope, tool inventory, and success criteria.",
      mimeType: "text/markdown",
    },
    async (uri) => {
      try {
        const text = await readProjectFile("docs/design.md");

        return {
          contents: [
            {
              uri: uri.href,
              mimeType: "text/markdown",
              text,
            },
          ],
        };
      } catch (error) {
        const reason =
          error instanceof Error ? error.message : "Unknown error";

        console.error(`[resource:expense-tracker-design] ${reason}`);

        throw new Error(`Could not read project design: ${reason}`);
      }
    },
  );

  server.registerResource(
    "expense-tracker-data-plan",
    "expenses://data-plan",
    {
      title: "Expense Tracker Data Plan",
      description:
        "Read-only documentation of tool data sources, fixture paths, and failure modes.",
      mimeType: "text/markdown",
    },
    async (uri) => {
      try {
        const text = await readProjectFile("docs/data-plan.md");

        return {
          contents: [
            {
              uri: uri.href,
              mimeType: "text/markdown",
              text,
            },
          ],
        };
      } catch (error) {
        const reason =
          error instanceof Error ? error.message : "Unknown error";

        console.error(`[resource:expense-tracker-data-plan] ${reason}`);

        throw new Error(`Could not read data plan: ${reason}`);
      }
    },
  );

  server.registerResource(
    "expense-tracker-sample-data",
    "expenses://sample-data",
    {
      title: "Expense Tracker Sample Data",
      description:
        "Read-only view of the local expense records stored in the CSV fixture.",
      mimeType: "text/csv",
    },
    async (uri) => {
      try {
        const text = await readProjectFile("data/expenses.csv");

        return {
          contents: [
            {
              uri: uri.href,
              mimeType: "text/csv",
              text,
            },
          ],
        };
      } catch (error) {
        const reason =
          error instanceof Error ? error.message : "Unknown error";

        console.error(`[resource:expense-tracker-sample-data] ${reason}`);

        throw new Error(`Could not read expense data: ${reason}`);
      }
    },
  );
}