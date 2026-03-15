import Link from "next/link";
import { ForkcastIcon } from "@/components/logo";

type Props = {
  outletName: string;
  email?: string;
  activePath?: string;
};

const NAV_ITEMS = [
  {
    label: "Today's Forecast",
    href: "/dashboard",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="12" height="11" rx="2"/>
        <path d="M5 3V1M11 3V1M2 7h12"/>
      </svg>
    )
  },
  {
    label: "Settings",
    href: "/settings",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="8" r="2.5"/>
        <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M12.95 3.05l-1.06 1.06M4.11 11.89l-1.06 1.06"/>
      </svg>
    )
  },
  {
    label: "Upload POS Data",
    href: "/onboarding",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 10V3M5 6l3-3 3 3"/>
        <path d="M3 13h10"/>
      </svg>
    )
  }
];

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function AppSidebar({ outletName, email, activePath = "/dashboard" }: Props) {
  return (
    <aside className="app-sidebar">
      {/* Logo */}
      <div className="app-sidebar-logo">
        <Link href="/dashboard">
          <div className="logo-icon"><ForkcastIcon size={18} color="#ffffff" /></div>
          <span className="logo-name">Forkcast</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="app-sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebar-nav-item ${activePath === item.href ? "active" : ""}`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="app-sidebar-footer">
        <div className="sidebar-outlet-info">
          <div className="sidebar-outlet-avatar">{getInitials(outletName)}</div>
          <div style={{ minWidth: 0 }}>
            <div className="sidebar-outlet-name">{outletName}</div>
            {email && (
              <div className="sidebar-outlet-role" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {email}
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
