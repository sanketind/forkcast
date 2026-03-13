"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { detectPosFormat, FORMAT_TEMPLATES, parsePosCsv, summarizeTopSkus } from "@forkcast/integrations";
import type { OutletProfile } from "@/lib/demo-state";
import { saveOutletId } from "@/lib/outlet-actions";

type Props = {
  outletProfile: OutletProfile;
};

const SAMPLE_CSV = `businessDate,sku,itemName,quantity,lineRevenue,orderHour
2026-03-03,CB-001,Chicken Biryani,2,580,12
2026-03-03,BC-002,Butter Chicken Bowl,1,310,13
2026-03-03,PW-003,Paneer Tikka Wrap,3,660,15
2026-03-03,ML-004,Masala Lemonade,4,320,14
2026-03-04,CB-001,Chicken Biryani,3,870,12
2026-03-04,BC-002,Butter Chicken Bowl,2,620,13
2026-03-04,PW-003,Paneer Tikka Wrap,2,440,14
2026-03-05,CB-001,Chicken Biryani,4,1160,12
2026-03-05,ML-004,Masala Lemonade,6,480,14
2026-03-06,BC-002,Butter Chicken Bowl,3,930,13
2026-03-06,PW-003,Paneer Tikka Wrap,4,880,15
2026-03-06,ML-004,Masala Lemonade,5,400,16
2026-03-07,CB-001,Chicken Biryani,5,1450,12
2026-03-07,BC-002,Butter Chicken Bowl,4,1240,13
2026-03-07,PW-003,Paneer Tikka Wrap,3,660,15`;

type UploadTab = "file" | "paste";
type UploadState = "idle" | "uploading" | "success" | "error";

export function OnboardingWizard({ outletProfile }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<UploadTab>("file");
  const [isDragging, setIsDragging] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadResult, setUploadResult] = useState<{ daysUploaded: number; rowsProcessed: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const rows = useMemo(() => {
    if (!csvText.trim()) return [];
    try {
      return parsePosCsv(csvText);
    } catch {
      return [];
    }
  }, [csvText]);

  const topSkus = useMemo(() => summarizeTopSkus(rows), [rows]);

  const detectedFormat = useMemo(() => {
    if (!csvText.trim()) return null;
    const firstLine = csvText.trim().split(/\r?\n/)[0] ?? "";
    const headers = firstLine.split(",").map((h) => h.trim());
    const fmt = detectPosFormat(headers);
    return FORMAT_TEMPLATES[fmt]?.name ?? "Forkcast Standard";
  }, [csvText]);

  const loadFile = useCallback((file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === "string") {
        setCsvText(text);
        setActiveTab("paste");
      }
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file?.name.endsWith(".csv") || file?.type === "text/csv") {
        loadFile(file);
      }
    },
    [loadFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) loadFile(file);
    },
    [loadFile]
  );

  const handleSubmit = async () => {
    if (rows.length === 0) return;
    setUploadState("uploading");
    setErrorMsg("");

    const mappingPayload = topSkus.map((sku) => ({
      sku: sku.sku,
      itemName: sku.itemName,
      ingredientText: mappings[sku.sku] ?? ""
    }));

    try {
      const res = await fetch("/api/upload-sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rows,
          mappings: mappingPayload,
          outletProfile: {
            outletName: outletProfile.outletName,
            city: outletProfile.city,
            state: outletProfile.state,
            cuisine: outletProfile.cuisine,
            seats: outletProfile.seats
          }
        })
      });

      const data = (await res.json()) as {
        success?: boolean;
        outletId?: number;
        daysUploaded?: number;
        rowsProcessed?: number;
        error?: string;
      };

      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "Upload failed.");
      }

      if (data.outletId) {
        await saveOutletId(data.outletId);
      }

      setUploadResult({ daysUploaded: data.daysUploaded ?? 0, rowsProcessed: data.rowsProcessed ?? 0 });
      setUploadState("success");

      setTimeout(() => router.push("/dashboard"), 1800);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setUploadState("error");
    }
  };

  return (
    <div className="grid gap-6">
      {/* Step 2 — Data Import */}
      <section className="panel">
        <div className="section-title">
          <div>
            <p className="eyebrow">Step 2</p>
            <h2>Import your sales data</h2>
          </div>
          {rows.length > 0 && (
            <span className="pill">
              {rows.length} rows · {detectedFormat}
            </span>
          )}
        </div>

        <p className="lead" style={{ marginBottom: "20px" }}>
          Upload a CSV export from your POS. We auto-detect Petpooja, UrbanPiper, Posist and standard formats.
        </p>

        {/* Tab switcher */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          {(["file", "paste"] as UploadTab[]).map((tab) => (
            <button
              key={tab}
              className={`button ${activeTab === tab ? "" : "ghost"}`}
              style={{ fontSize: "0.85rem", padding: "8px 16px" }}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "file" ? "Upload file" : "Paste CSV"}
            </button>
          ))}
        </div>

        {activeTab === "file" ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${isDragging ? "var(--accent)" : "var(--border)"}`,
              borderRadius: "18px",
              padding: "48px 24px",
              textAlign: "center",
              cursor: "pointer",
              background: isDragging ? "var(--accent-soft)" : "transparent",
              transition: "all 0.15s ease"
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <div style={{ fontSize: "2.4rem", marginBottom: "12px" }}>📄</div>
            {fileName ? (
              <>
                <p style={{ color: "var(--teal)", fontWeight: 600, margin: "0 0 4px" }}>{fileName}</p>
                <small>{rows.length} rows parsed · {detectedFormat}</small>
              </>
            ) : (
              <>
                <p style={{ margin: "0 0 6px", fontWeight: 600 }}>Drop your POS export here</p>
                <small>or click to choose a .csv file</small>
              </>
            )}
          </div>
        ) : (
          <textarea
            className="editor"
            value={csvText}
            onChange={(e) => { setCsvText(e.target.value); setFileName(null); }}
            rows={9}
            placeholder="Paste CSV rows here…"
            style={{ width: "100%" }}
          />
        )}

        {/* Quick-fill with sample */}
        {rows.length === 0 && (
          <button
            className="button ghost"
            style={{ marginTop: "12px", fontSize: "0.82rem" }}
            onClick={() => { setCsvText(SAMPLE_CSV); setActiveTab("paste"); }}
          >
            Load sample data to try the demo
          </button>
        )}
      </section>

      {/* Step 3 — Ingredient Mapping */}
      {topSkus.length > 0 && (
        <section className="panel">
          <div className="section-title">
            <div>
              <p className="eyebrow">Step 3</p>
              <h2>Map ingredients</h2>
            </div>
            <span className="pill">Top {topSkus.length} SKUs</span>
          </div>
          <p className="lead" style={{ marginBottom: "16px" }}>
            List ingredients for each item, comma-separated. This powers the shopping list and waste reduction engine.
          </p>

          <div className="table-shell">
            <table>
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Item</th>
                  <th>Units sold</th>
                  <th>Ingredients (comma-separated)</th>
                </tr>
              </thead>
              <tbody>
                {topSkus.map((sku) => (
                  <tr key={sku.sku}>
                    <td style={{ color: "var(--indigo)", fontFamily: "monospace", fontSize: "0.85rem" }}>{sku.sku}</td>
                    <td style={{ fontWeight: 600 }}>{sku.itemName}</td>
                    <td>{sku.quantity}</td>
                    <td>
                      <input
                        className="text-input"
                        value={mappings[sku.sku] ?? ""}
                        onChange={(e) => setMappings((prev) => ({ ...prev, [sku.sku]: e.target.value }))}
                        placeholder={
                          sku.itemName.toLowerCase().includes("chicken")
                            ? "chicken, rice, masala, curd"
                            : sku.itemName.toLowerCase().includes("paneer")
                              ? "paneer, wrap, mint chutney"
                              : "ingredient 1, ingredient 2"
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Submit */}
          <div style={{ marginTop: "24px", display: "flex", gap: "12px", alignItems: "center" }}>
            {uploadState === "idle" || uploadState === "error" ? (
              <button
                className="button"
                onClick={handleSubmit}
                disabled={rows.length === 0}
                style={{ opacity: rows.length === 0 ? 0.5 : 1 }}
              >
                Save data &amp; generate forecast
              </button>
            ) : uploadState === "uploading" ? (
              <button className="button" disabled style={{ opacity: 0.7 }}>
                Saving…
              </button>
            ) : (
              <button className="button" disabled style={{ background: "var(--accent)", opacity: 0.9 }}>
                ✓ {uploadResult?.daysUploaded} days saved — redirecting…
              </button>
            )}

            {uploadState === "error" && (
              <span style={{ color: "var(--amber)", fontSize: "var(--text-sm)" }}>{errorMsg}</span>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
