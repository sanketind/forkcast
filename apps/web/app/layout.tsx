import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AppNav } from "@/components/nav";

import "./globals.css";

export const metadata: Metadata = {
  title: "Forkcast",
  description: "AI co-pilot for restaurants that turns demand signals into tomorrow's actions."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppNav />
        <main>{children}</main>
      </body>
    </html>
  );
}
