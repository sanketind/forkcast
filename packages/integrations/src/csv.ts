import { z } from "zod";

const csvRowSchema = z.object({
  businessDate: z.string(),
  sku: z.string(),
  itemName: z.string(),
  quantity: z.coerce.number(),
  lineRevenue: z.coerce.number(),
  orderHour: z.coerce.number().min(0).max(23)
});

export type PosCsvRow = z.infer<typeof csvRowSchema>;

export function parsePosCsv(rawText: string): PosCsvRow[] {
  const [headerLine, ...lines] = rawText.trim().split(/\r?\n/);
  if (!headerLine) {
    return [];
  }

  const headers = headerLine.split(",").map((value) => value.trim());

  return lines
    .filter(Boolean)
    .map((line) => {
      const columns = line.split(",").map((value) => value.trim());
      const row = Object.fromEntries(headers.map((header, index) => [header, columns[index] ?? ""]));
      return csvRowSchema.parse(row);
    });
}

export function summarizeTopSkus(rows: PosCsvRow[]) {
  const summary = new Map<string, { sku: string; itemName: string; quantity: number; revenue: number }>();

  for (const row of rows) {
    const key = `${row.sku}:${row.itemName}`;
    const existing = summary.get(key) ?? {
      sku: row.sku,
      itemName: row.itemName,
      quantity: 0,
      revenue: 0
    };

    existing.quantity += row.quantity;
    existing.revenue += row.lineRevenue;
    summary.set(key, existing);
  }

  return [...summary.values()]
    .sort((left, right) => right.quantity - left.quantity)
    .slice(0, 10);
}
