// Default Imports
import type { Metadata } from "next";
import localFont from "next/font/local";

// Custom Imports
import "./globals.css";

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Prima Pizza",
  description: "Manage pizzas and toppings for Prima Pizza restaurant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

/* eslint-disable @typescript-eslint/no-unused-vars */
