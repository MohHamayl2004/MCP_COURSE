import { promises as fs } from "node:fs";
import path from "node:path";
import { z } from "zod";

/*
 * Absolute path of the project's data directory.
 *
 * process.cwd() is expected to be the project root when the server runs.
 */
const DATA_DIRECTORY = path.resolve(process.cwd(), "data");
const EXPENSES_FILE_NAME = "expenses.csv";

/*
 * The columns that must appear in expenses.csv.
 */
const CSV_HEADER = "id,date,amount,category,note";

/*
 * Validation schema for one expense record.
 *
 * z.coerce.number() is used because values read from a CSV file
 * initially arrive as strings.
 */
export const expenseSchema = z.object({
  id: z.coerce
    .number()
    .int()
    .positive("Expense ID must be a positive integer"),

  date: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Expense date must use YYYY-MM-DD format",
    ),

  amount: z.coerce
    .number()
    .positive("Expense amount must be greater than zero"),

  category: z
    .string()
    .trim()
    .min(1, "Expense category cannot be empty"),

  note: z.string().trim(),
});

export type Expense = z.infer<typeof expenseSchema>;

/*
 * Input used when adding a new expense.
 * The ID is generated automatically.
 */
export interface AddExpenseInput {
  date: string;
  amount: number;
  category: string;
  note: string;
}

/*
 * Optional filters used by list_expenses.
 */
export interface ExpenseFilters {
  month?: string;
  category?: string;
}

/*
 * Result returned by get_monthly_summary.
 */
export interface MonthlySummary {
  month: string;
  total: number;
  byCategory: Record<string, number>;
  message?: string;
}

/*
 * Result returned by delete_expense.
 */
export interface DeleteExpenseResult {
  deleted: true;
  row: number;
  expense: Expense;
}

/**
 * Resolve a file path safely inside the data directory.
 *
 * This prevents paths such as ../../secret.txt from accessing files
 * outside the project's data folder.
 */
function resolveDataPath(fileName: string): string {
  const resolvedPath = path.resolve(DATA_DIRECTORY, fileName);

  if (!resolvedPath.startsWith(`${DATA_DIRECTORY}${path.sep}`)) {
    throw new Error("Access outside the data directory is not allowed");
  }

  return resolvedPath;
}

/**
 * Parse one CSV line.
 *
 * This supports:
 * - commas inside quoted values
 * - escaped quotes written as ""
 *
 * Example:
 * 1,2026-08-01,20,Food,"Lunch, coffee"
 */
function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let currentField = "";
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];

    if (character === '"') {
      const nextCharacter = line[index + 1];

      if (insideQuotes && nextCharacter === '"') {
        currentField += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (character === "," && !insideQuotes) {
      fields.push(currentField);
      currentField = "";
    } else {
      currentField += character;
    }
  }

  if (insideQuotes) {
    throw new Error("Invalid CSV data: an opening quote was not closed");
  }

  fields.push(currentField);

  return fields;
}

/**
 * Escape one value before writing it into CSV.
 *
 * Values containing commas, quotes, or newlines are wrapped in quotes.
 */
function escapeCsvValue(value: string | number): string {
  const text = String(value);

  if (
    text.includes(",") ||
    text.includes('"') ||
    text.includes("\n") ||
    text.includes("\r")
  ) {
    return `"${text.replaceAll('"', '""')}"`;
  }

  return text;
}

/**
 * Convert one expense object into a CSV line.
 */
function expenseToCsvLine(expense: Expense): string {
  return [
    expense.id,
    expense.date,
    expense.amount,
    expense.category,
    expense.note,
  ]
    .map(escapeCsvValue)
    .join(",");
}

/**
 * Validate the CSV header.
 */
function validateHeader(headerLine: string): void {
  const normalizedHeader = headerLine
    .replace(/^\uFEFF/, "")
    .trim()
    .toLowerCase();

  if (normalizedHeader !== CSV_HEADER) {
    throw new Error(
      `Invalid CSV header. Expected: ${CSV_HEADER}`,
    );
  }
}

/**
 * Parse and validate the contents of expenses.csv.
 *
 * Empty data rows are ignored.
 */
export function parseExpensesCsv(csvContent: string): Expense[] {
  const normalizedContent = csvContent.replace(/\r\n/g, "\n").trim();

  if (normalizedContent === "") {
    return [];
  }

  const lines = normalizedContent.split("\n");

  validateHeader(lines[0]);

  const dataLines = lines
    .slice(1)
    .filter((line) => line.trim() !== "");

  return dataLines.map((line, index) => {
    const columns = parseCsvLine(line);

    if (columns.length !== 5) {
      throw new Error(
        `Invalid CSV data at row ${index + 2}: expected 5 columns but found ${columns.length}`,
      );
    }

    const rawExpense = {
      id: columns[0].trim(),
      date: columns[1].trim(),
      amount: columns[2].trim(),
      category: columns[3].trim(),
      note: columns[4].trim(),
    };

    const validationResult = expenseSchema.safeParse(rawExpense);

    if (!validationResult.success) {
      const reason = validationResult.error.issues
        .map((issue) => issue.message)
        .join("; ");

      throw new Error(
        `Invalid expense data at CSV row ${index + 2}: ${reason}`,
      );
    }

    return validationResult.data;
  });
}

/**
 * Read and validate all expenses from data/expenses.csv.
 *
 * If the file does not exist, it is created with the correct header.
 */
export async function loadExpenses(): Promise<Expense[]> {
  const filePath = resolveDataPath(EXPENSES_FILE_NAME);

  try {
    const csvContent = await fs.readFile(filePath, "utf8");
    return parseExpensesCsv(csvContent);
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;

    if (nodeError.code === "ENOENT") {
      await fs.mkdir(DATA_DIRECTORY, { recursive: true });
      await fs.writeFile(filePath, `${CSV_HEADER}\n`, "utf8");

      return [];
    }

    throw new Error(
      `Failed to load expenses: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
}

/**
 * Save all expense records to data/expenses.csv.
 *
 * The complete file is rewritten with a valid header.
 */
export async function saveExpenses(
  expenses: Expense[],
): Promise<void> {
  const filePath = resolveDataPath(EXPENSES_FILE_NAME);

  /*
   * Validate records again before writing.
   * This prevents invalid application data from corrupting the CSV.
   */
  const validatedExpenses = expenses.map((expense, index) => {
    const validationResult = expenseSchema.safeParse(expense);

    if (!validationResult.success) {
      const reason = validationResult.error.issues
        .map((issue) => issue.message)
        .join("; ");

      throw new Error(
        `Cannot save invalid expense at index ${index}: ${reason}`,
      );
    }

    return validationResult.data;
  });

  const csvLines = [
    CSV_HEADER,
    ...validatedExpenses.map(expenseToCsvLine),
  ];

  await fs.mkdir(DATA_DIRECTORY, { recursive: true });

  try {
    await fs.writeFile(
      filePath,
      `${csvLines.join("\n")}\n`,
      "utf8",
    );
  } catch (error) {
    throw new Error(
      `Failed to save expenses: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
}

/**
 * Add a new expense to the CSV file.
 *
 * A new ID is generated using the highest current ID + 1.
 */
export async function addExpense(
  input: AddExpenseInput,
): Promise<Expense> {
  const expenses = await loadExpenses();

  const nextId =
    expenses.length === 0
      ? 1
      : Math.max(...expenses.map((expense) => expense.id)) + 1;

  const validationResult = expenseSchema.safeParse({
    id: nextId,
    date: input.date,
    amount: input.amount,
    category: input.category,
    note: input.note,
  });

  if (!validationResult.success) {
    const reason = validationResult.error.issues
      .map((issue) => issue.message)
      .join("; ");

    throw new Error(`Invalid expense input: ${reason}`);
  }

  const newExpense = validationResult.data;

  await saveExpenses([...expenses, newExpense]);

  return newExpense;
}

/**
 * List expenses with optional month and category filters.
 *
 * Month format: YYYY-MM
 * Category matching is case-insensitive.
 */
export async function listExpenses(
  filters: ExpenseFilters = {},
): Promise<Expense[]> {
  const expenses = await loadExpenses();

  if (
    filters.month !== undefined &&
    !/^\d{4}-\d{2}$/.test(filters.month)
  ) {
    throw new Error("Month must use YYYY-MM format");
  }

  const normalizedCategory = filters.category?.trim().toLowerCase();

  return expenses.filter((expense) => {
    const matchesMonth =
      filters.month === undefined ||
      expense.date.startsWith(`${filters.month}-`);

    const matchesCategory =
      normalizedCategory === undefined ||
      expense.category.toLowerCase() === normalizedCategory;

    return matchesMonth && matchesCategory;
  });
}

/**
 * Calculate the total spending and category breakdown for one month.
 *
 * If no records match, this returns a valid empty summary instead
 * of throwing an error.
 */
export async function getMonthlySummary(
  month: string,
): Promise<MonthlySummary> {
  if (!/^\d{4}-\d{2}$/.test(month)) {
    throw new Error("Month must use YYYY-MM format");
  }

  const monthlyExpenses = await listExpenses({ month });

  if (monthlyExpenses.length === 0) {
    return {
      month,
      total: 0,
      byCategory: {},
      message: "No expenses were found for the requested month.",
    };
  }

  const byCategory: Record<string, number> = {};

  for (const expense of monthlyExpenses) {
    byCategory[expense.category] =
      (byCategory[expense.category] ?? 0) + expense.amount;
  }

  const total = monthlyExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  /*
   * Round values to two decimal places to avoid floating-point
   * results such as 19.999999999.
   */
  const roundedCategories = Object.fromEntries(
    Object.entries(byCategory).map(([category, amount]) => [
      category,
      Number(amount.toFixed(2)),
    ]),
  );

  return {
    month,
    total: Number(total.toFixed(2)),
    byCategory: roundedCategories,
  };
}

/**
 * Delete an expense using its CSV data-row number.
 *
 * row = 1 means the first expense after the CSV header.
 * The header itself is not counted.
 */
export async function deleteExpense(
  row: number | string,
): Promise<DeleteExpenseResult> {
  const numericRow =
    typeof row === "string" ? Number(row) : row;

  if (!Number.isInteger(numericRow) || numericRow < 1) {
    throw new Error("Row number must be a positive integer");
  }

  const expenses = await loadExpenses();

  if (expenses.length === 0) {
    throw new Error("Cannot delete an expense because the CSV is empty");
  }

  const expenseIndex = numericRow - 1;

  if (expenseIndex >= expenses.length) {
    throw new Error(`Expense row ${numericRow} was not found`);
  }

  const deletedExpense = expenses[expenseIndex];

  const remainingExpenses = expenses.filter(
    (_, index) => index !== expenseIndex,
  );

  await saveExpenses(remainingExpenses);

  return {
    deleted: true,
    row: numericRow,
    expense: deletedExpense,
  };
}


export interface TopExpensesOptions {
  month?: string;
  limit: number;
}

export async function getTopExpenses(
  options: TopExpensesOptions,
): Promise<Expense[]> {
  const { month, limit } = options;

  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error("Limit must be a positive integer");
  }

  if (month !== undefined && !/^\d{4}-\d{2}$/.test(month)) {
    throw new Error("Month must use YYYY-MM format");
  }

  const expenses = await loadExpenses();

  return expenses
    .filter(
      (expense) =>
        month === undefined || expense.date.startsWith(`${month}-`),
    )
    .sort((first, second) => second.amount - first.amount)
    .slice(0, limit);
}