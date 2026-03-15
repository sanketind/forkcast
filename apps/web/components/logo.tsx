interface ForkcastIconProps {
  size?: number;
  color?: string;
  className?: string;
}

/**
 * Forkcast logo mark — a fork whose tines rise like an ascending forecast chart.
 * Renders a raw SVG path; wrap in `.logo-icon` (CSS) for the coral pill background.
 */
export function ForkcastIcon({ size = 20, color = "currentColor", className }: ForkcastIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {/* Left tine — shortest */}
      <rect x="1" y="10" width="4.5" height="9" rx="2.25" />
      {/* Center tine — medium */}
      <rect x="9.75" y="6" width="4.5" height="13" rx="2.25" />
      {/* Right tine — tallest */}
      <rect x="18.5" y="2" width="4.5" height="17" rx="2.25" />
      {/* Shoulder — connects all three tines */}
      <rect x="1" y="16.5" width="22" height="2.5" rx="1.25" />
      {/* Handle / stem */}
      <rect x="9.75" y="18.5" width="4.5" height="5.5" rx="2.25" />
    </svg>
  );
}

/** Full wordmark: icon pill + "Forkcast" text, suitable for nav/sidebar. */
export function ForkcastLogo({ iconSize = 28, textSize = 16 }: { iconSize?: number; textSize?: number }) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span
        style={{
          width: iconSize,
          height: iconSize,
          background: "var(--accent)",
          borderRadius: Math.round(iconSize * 0.28),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <ForkcastIcon size={Math.round(iconSize * 0.65)} color="#ffffff" />
      </span>
      <span
        style={{
          fontSize: textSize,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: "var(--text)",
          lineHeight: 1,
        }}
      >
        Forkcast
      </span>
    </span>
  );
}
