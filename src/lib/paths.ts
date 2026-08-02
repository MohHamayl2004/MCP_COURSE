import path from "node:path";

const DATA_DIR = path.resolve(process.cwd(), "data");

/** Resolve a file name inside ./data, rejecting anything that escapes it. */
export function resolveDataPath(fileName: string): string {
  const full = path.resolve(DATA_DIR, fileName);
  if (full !== DATA_DIR && !full.startsWith(DATA_DIR + path.sep)) {
    throw new Error(`Refusing to read outside ./data: ${fileName}`);
  }
  return full;
}