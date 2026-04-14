import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PersonaLift",
  description:
    "AI landing page personalization prototype that adapts an existing page to match an ad creative."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
