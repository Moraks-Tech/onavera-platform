import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ONAVERA Technologies",
    template: "%s — ONAVERA Technologies",
  },
  description:
    "ONAVERA Technologies — Creating Pathways to Progress. Software development, cybersecurity, data analytics, and proprietary technology products.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}