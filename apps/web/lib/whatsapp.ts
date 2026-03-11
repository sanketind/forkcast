import type { RecommendationBundle } from "@forkcast/domain";

// WhatsApp Business API via Twilio
// Requires: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM env vars
// From number format: "whatsapp:+14155238886" (Twilio sandbox) or approved business number

type TwilioMessageParams = {
  To: string;
  From: string;
  Body: string;
};

async function sendTwilioMessage(to: string, body: string): Promise<boolean> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM ?? "whatsapp:+14155238886";

  if (!accountSid || !authToken) {
    console.warn("[whatsapp] TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN not set — skipping send.");
    return false;
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const params: TwilioMessageParams = {
    To: `whatsapp:${to}`,
    From: from,
    Body: body
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams(params as Record<string, string>).toString()
    });

    if (!res.ok) {
      const error = (await res.json()) as { message?: string };
      console.error("[whatsapp] Twilio error:", error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[whatsapp] Network error:", err);
    return false;
  }
}

// ── Supply alert message ──────────────────────────────────────────────────────

export async function sendSupplyAlert(
  phoneNumber: string,
  outletName: string,
  alerts: RecommendationBundle["supplyAlerts"]
): Promise<boolean> {
  if (alerts.length === 0) return false;

  const criticalAlerts = alerts.filter(
    (a) => a.severity === "critical" || a.severity === "high"
  );
  if (criticalAlerts.length === 0) return false;

  const lines = criticalAlerts.map((alert) => {
    const urgency =
      alert.daysUntilImpact <= 1
        ? "TODAY"
        : alert.daysUntilImpact <= 3
          ? `within ${alert.daysUntilImpact} days`
          : `within ${alert.daysUntilImpact} days`;
    return `*${alert.commodity}* (${alert.severity.toUpperCase()}) — Act ${urgency}\n${alert.recommendation}`;
  });

  const body = [
    `*Supply Alert — ${outletName}*`,
    "",
    lines.join("\n\n"),
    "",
    "Reply *DONE* when actioned · Reply *SNOOZE* to remind tomorrow"
  ].join("\n");

  return sendTwilioMessage(phoneNumber, body);
}

// ── Daily 7pm briefing ────────────────────────────────────────────────────────

export async function sendDailyBriefing(
  phoneNumber: string,
  ownerName: string,
  outletName: string,
  bundle: RecommendationBundle
): Promise<boolean> {
  const { forecast, shoppingList, staffing, supplyAlerts } = bundle;

  const revStr = `₹${forecast.predictedRevenue.toLocaleString("en-IN")}`;
  const bandStr = `±₹${Math.round((forecast.confidenceHigh - forecast.confidenceLow) / 2).toLocaleString("en-IN")}`;
  const topReason = forecast.reasons[0] ?? "Based on your historical sales pattern.";

  const shoppingLines = shoppingList
    .slice(0, 4)
    .map((item) => `  • ${Math.ceil(item.quantityToBuy)}${item.unit} ${item.ingredient}`)
    .join("\n");

  const supplyLines =
    supplyAlerts.length > 0
      ? supplyAlerts
          .slice(0, 2)
          .map(
            (a) =>
              `  ⚠ *${a.commodity}* — ${a.recommendation.slice(0, 80)}${a.recommendation.length > 80 ? "…" : ""}`
          )
          .join("\n")
      : "";

  const sections: string[] = [
    `Good evening, ${ownerName} 👋`,
    `*Tomorrow for ${outletName}*`,
    "",
    `📈 *Revenue forecast:* ${revStr} (${bandStr})`,
    `   ${topReason}`,
    ""
  ];

  if (shoppingLines) {
    sections.push(`🛒 *Buy today:*`);
    sections.push(shoppingLines);
    sections.push("");
  }

  sections.push(
    `👨‍🍳 *Staff:* ${staffing.cooksNeeded} cooks + ${staffing.serviceStaffNeeded} floor from ${staffing.shiftStartHour}:00–${staffing.shiftEndHour}:00`
  );

  if (supplyLines) {
    sections.push("");
    sections.push(`*Supply Watch:*`);
    sections.push(supplyLines);
  }

  sections.push("");
  sections.push("Reply with your outlet name for full details on the dashboard.");

  return sendTwilioMessage(phoneNumber, sections.join("\n"));
}
