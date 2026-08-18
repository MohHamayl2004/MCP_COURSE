import path from "node:path";
import { fileURLToPath } from "node:url";

/*
 * The data folder is anchored to the project, not to process.cwd().
 *
 * An MCP client such as Claude Desktop launches the server from an arbitrary
 * working directory, so resolving "data" against cwd would silently find nothing.
 * EXPENSES_DATA_DIR overrides the location if you want to point at other data.
 */
const HERE = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(HERE, "..", "..");

const DATA_DIR = process.env.EXPENSES_DATA_DIR
  ? path.resolve(process.env.EXPENSES_DATA_DIR)
  : path.resolve(PROJECT_ROOT, "data");

/** Resolve a file name inside the data folder, rejecting anything that escapes it. */
export function resolveDataPath(fileName: string): string {
  const full = path.resolve(DATA_DIR, fileName);
  if (full !== DATA_DIR && !full.startsWith(DATA_DIR + path.sep)) {
    throw new Error("Refusing to read outside the data directory");
  }
  return full;
}
