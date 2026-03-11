import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";

import { AppNav } from "@/components/nav";

import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "Forkcast — AI Co-pilot for Restaurants",
  description: "Turns POS data, weather and local events into tomorrow's actions — what to buy, how many cooks, what to promote."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={sans.variable}>
      <body>
        <AppNav />
        <main>{children}</main>
      </body>
    </html>
  );
}
