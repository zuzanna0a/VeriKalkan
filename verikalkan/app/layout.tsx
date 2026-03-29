import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import SayeBot from "@/features/kalkanbot/KalkanBot";

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
      <body>
        <ThemeProvider>
          {children}
          <SayeBot />
        </ThemeProvider>
      </body>
    </html>
  );
}
