import path from "node:path";

const DATA_DIR = path.resolve(process.cwd(), "data");

export function resolveDataPath(fileName: string): string {
  const full = path.resolve(DATA_DIR, fileName);
  if (full !== DATA_DIR && !full.startsWith(DATA_DIR + path.sep)) {
    throw new Error("Refusing to read outside ./data");
  }
  return full;
}