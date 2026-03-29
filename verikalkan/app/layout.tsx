import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import SayeBot from "@/features/kalkanbot/KalkanBot";

const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

export const metadata: Metadata = {
  title: "VeriKalkan — Dijital Haklarınızı Koruyun",
  description: "KVKK haklarınızı kolayca kullanın. Veri sızıntılarını tespit edin, şirketlere dilekçe gönderin.",
  openGraph: {
    title: "VeriKalkan",
    description: "Dijital haklarınızı koruyun",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning className={pixelFont.variable}>
      <body>
        <ThemeProvider>
          {children}
          <SayeBot />
        </ThemeProvider>
      </body>
    </html>
  );
}
