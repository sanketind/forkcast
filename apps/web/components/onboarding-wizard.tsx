"use client";

import { useMemo, useState } from "react";

import { parsePosCsv, summarizeTopSkus } from "@forkcast/integrations";

const sampleCsv = `businessDate,sku,itemName,quantity,lineRevenue,orderHour
2026-03-08,CB-001,Chicken Biryani,2,580,12
2026-03-08,BC-002,Butter Chicken Bowl,1,310,13
2026-03-08,PW-003,Paneer Tikka Wrap,3,660,15
2026-03-08,ML-004,Masala Lemonade,4,320,14`;

export function OnboardingWizard() {
  const [csvText, setCsvText] = useState(sampleCsv);
  const rows = useMemo(() => {
    try {
      return parsePosCsv(csvText);
    } catch {
      return [];
    }
  }, [csvText]);
  const topSkus = useMemo(() => summarizeTopSkus(rows), [rows]);

  return (
    <div className="grid gap-6">
      <section className="panel">
        <div className="section-title">
          <div>
            <p className="eyebrow">Step 2</p>
            <h2>CSV POS import</h2>
          </div>
          <span className="pill">{rows.length} rows parsed</span>
        </div>
        <p className="muted">
          Paste a POS export with `businessDate, sku, itemName, quantity, lineRevenue, orderHour`.
        </p>
        <textarea
          className="editor"
          value={csvText}
          onChange={(event) => setCsvText(event.target.value)}
          rows={8}
        />
      </section>

      <section className="panel">
        <div className="section-title">
          <div>
            <p className="eyebrow">Step 3</p>
            <h2>Top SKU mapping</h2>
          </div>
          <span className="pill">Top 10 SKUs</span>
        </div>
        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Item</th>
                <th>Orders</th>
                <th>Suggested ingredient map</th>
              </tr>
            </thead>
            <tbody>
              {topSkus.map((sku) => (
                <tr key={`${sku.sku}-${sku.itemName}`}>
                  <td>{sku.sku}</td>
                  <td>{sku.itemName}</td>
                  <td>{sku.quantity}</td>
                  <td>
                    <input
                      className="text-input"
                      defaultValue={
                        sku.itemName.includes("Chicken")
                          ? "Chicken, rice, masala"
                          : sku.itemName.includes("Paneer")
                            ? "Paneer, wrap, chutney"
                            : "Sugar, mint, lemon"
                      }
                    />
                  </td>
                </tr>
              ))}
              {topSkus.length === 0 ? (
                <tr>
                  <td colSpan={4}>Paste valid CSV rows to preview onboarding mappings.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
