import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VeriKalkan",
  description:
    "Türkiye'nin KVKK Veri Hakları Asistanı - dijital veri riskini keşfet, hak dilekçeni üret.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

