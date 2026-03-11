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

type ColumnMap = {
  businessDate: string;
  sku: string;
  itemName: string;
  quantity: string;
  lineRevenue: string;
  orderHour: string;
};

type FormatTemplate = {
  name: string;
  headers: string[];
  columnMap: ColumnMap;
  transformDate?: (raw: string) => string;
  transformHour?: (raw: string) => string;
};

export const FORMAT_TEMPLATES: Record<string, FormatTemplate> = {
  forkcast: {
    name: "Forkcast Standard",
    headers: ["businessDate", "sku", "itemName", "quantity", "lineRevenue", "orderHour"],
    columnMap: {
      businessDate: "businessDate",
      sku: "sku",
      itemName: "itemName",
      quantity: "quantity",
      lineRevenue: "lineRevenue",
      orderHour: "orderHour"
    }
  },
  petpooja: {
    name: "Petpooja",
    headers: ["Bill Date", "Item Code", "Item Name", "Qty", "Net Amount", "Hour"],
    columnMap: {
      businessDate: "Bill Date",
      sku: "Item Code",
      itemName: "Item Name",
      quantity: "Qty",
      lineRevenue: "Net Amount",
      orderHour: "Hour"
    }
  },
  urbanpiper: {
    name: "UrbanPiper",
    headers: ["order_date", "item_id", "item_title", "item_quantity", "subtotal", "placed_at"],
    columnMap: {
      businessDate: "order_date",
      sku: "item_id",
      itemName: "item_title",
      quantity: "item_quantity",
      lineRevenue: "subtotal",
      orderHour: "placed_at"
    },
    transformDate: (raw) => raw.slice(0, 10),
    transformHour: (raw) => {
      const d = new Date(raw);
      return isNaN(d.getTime()) ? "12" : String(d.getHours());
    }
  },
  posist: {
    name: "Posist",
    headers: ["Date", "Item", "Name", "Count", "Revenue", "Time"],
    columnMap: {
      businessDate: "Date",
      sku: "Item",
      itemName: "Name",
      quantity: "Count",
      lineRevenue: "Revenue",
      orderHour: "Time"
    },
    transformHour: (raw) => raw.split(":")[0] ?? "12"
  }
};

export type PosFormat = keyof typeof FORMAT_TEMPLATES;

export function detectPosFormat(headers: string[]): PosFormat {
  const headerSet = new Set(headers.map((h) => h.trim()));

  let bestFormat: PosFormat = "forkcast";
  let bestScore = 0;

  for (const [format, template] of Object.entries(FORMAT_TEMPLATES)) {
    const score = template.headers.filter((h) => headerSet.has(h)).length;
    if (score > bestScore) {
      bestScore = score;
      bestFormat = format as PosFormat;
    }
  }

  return bestFormat;
}

function normalizeRow(raw: Record<string, string>, format: PosFormat): PosCsvRow {
  const template = FORMAT_TEMPLATES[format];
  const { columnMap, transformDate, transformHour } = template;

  const businessDateRaw = raw[columnMap.businessDate] ?? "";
  const orderHourRaw = raw[columnMap.orderHour] ?? "12";

  return csvRowSchema.parse({
    businessDate: transformDate ? transformDate(businessDateRaw) : businessDateRaw,
    sku: raw[columnMap.sku] ?? "",
    itemName: raw[columnMap.itemName] ?? "",
    quantity: raw[columnMap.quantity] ?? "0",
    lineRevenue: raw[columnMap.lineRevenue] ?? "0",
    orderHour: transformHour ? transformHour(orderHourRaw) : orderHourRaw
  });
}

export function parsePosCsv(rawText: string): PosCsvRow[] {
  const [headerLine, ...lines] = rawText.trim().split(/\r?\n/);
  if (!headerLine) return [];

  const headers = headerLine.split(",").map((value) => value.trim());
  const format = detectPosFormat(headers);

  const results: PosCsvRow[] = [];
  for (const line of lines.filter(Boolean)) {
    try {
      const columns = line.split(",").map((value) => value.trim());
      const rawRow = Object.fromEntries(headers.map((header, i) => [header, columns[i] ?? ""]));
      results.push(normalizeRow(rawRow, format));
    } catch {
      // skip malformed rows silently
    }
  }
  return results;
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
