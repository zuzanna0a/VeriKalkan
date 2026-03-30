"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Shield } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface DarkLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function DarkLayout({ children, title }: DarkLayoutProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const T = theme === "dark" ? {
    bg: "#020810",
    bgCard: "#0d1420",
    border: "#1a2a3a",
    text: "#e2e8f0",
    textMuted: "#475569",
    primary: "#00ff88",
    headerBg: "#020810ee",
    gridColor: "#00ff8806",
  } : {
    bg: "#f8fafc",
    bgCard: "#ffffff",
    border: "#e2e8f0",
    text: "#0f172a",
    textMuted: "#64748b",
    primary: "#0ea5e9",
    headerBg: "#ffffffee",
    gridColor: "#0ea5e906",
  };

  const navLinks = [
    { href: "/", label: "Ana Sayfa" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/analiz", label: "Analiz" },
    { href: "/takip", label: "Takip" },
  ];

  return (
    <div style={{ background: T.bg, minHeight: "100vh", fontFamily: "monospace", color: T.text, transition: "background 0.3s, color 0.3s" }}>
      
      {/* Grid background */}
      <div style={{
        position: "fixed",
        inset: 0,
        backgroundImage: `linear-gradient(${T.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${T.gridColor} 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
        pointerEvents: "none",
        zIndex: 0
      }} />

      {/* Header */}
      <header style={{
        position: "relative",
        zIndex: 10,
        borderBottom: `1px solid ${T.border}`,
        background: T.headerBg,
        backdropFilter: "blur(10px)",
        padding: isMobile ? "0 12px" : "0 24px",
      }}>
        <div style={{
          maxWidth: "900px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "56px"
        }}>
          <Link href="/" className="group flex items-center gap-3 no-underline">
            {/* Icon */}
            <div className="relative flex items-center">
              <Shield
                size={28}
                className="text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)] transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
              />
              <div className="absolute inset-0 blur-xl opacity-20 bg-green-500 rounded-full"></div>
            </div>

            {/* Pixel Text */}
            <h1 className="relative font-pixel text-[12px] md:text-[16px] leading-tight tracking-[0.2em] m-0 p-0 overflow-visible">
              {/* Ana yazı */}
              <span className="relative z-10 text-green-400">
                VeriKalkan
              </span>

              {/* Pixel glitch katmanları */}
              <span className="absolute left-0 top-0 text-green-500 opacity-30 translate-x-[1px] translate-y-[1px] pointer-events-none">
                VeriKalkan
              </span>
              <span className="absolute left-0 top-0 text-cyan-400 opacity-20 -translate-x-[1px] -translate-y-[1px] pointer-events-none">
                VeriKalkan
              </span>
            </h1>
          </Link>
          
          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              onClick={toggleTheme}
              style={{
                background: "transparent",
                border: `1px solid ${T.border}`,
                borderRadius: "6px",
                padding: isMobile ? "4px 6px" : "6px 10px",
                cursor: "pointer",
                fontFamily: "monospace",
                fontSize: isMobile ? "9px" : "11px",
                color: T.text,
                fontWeight: "bold",
                letterSpacing: "1px",
                marginRight: isMobile ? "8px" : "16px",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = T.primary;
                e.currentTarget.style.color = T.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = T.border;
                e.currentTarget.style.color = T.text;
              }}
            >
              {theme === "dark" ? "☀ AÇIK" : "◉ KOYU"}
            </button>

            <nav style={{ display: "flex", gap: isMobile ? "12px" : "24px", alignItems: "center" }}>
              {navLinks.map(link => {
                // Mobilde sadece önemli linkleri göster veya hepsini küçült
                if (isMobile && ["/takip", "/analiz"].includes(link.href)) return null;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{
                      color: pathname === link.href ? T.primary : T.textMuted,
                      fontSize: isMobile ? "10px" : "12px",
                      textDecoration: "none",
                      letterSpacing: "1px",
                      fontFamily: "monospace",
                      transition: "color 0.2s",
                      borderBottom: pathname === link.href ? `1px solid ${T.primary}` : "none",
                      paddingBottom: "2px"
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Page title bar */}
      {title && (
        <div style={{
          position: "relative",
          zIndex: 10,
          borderBottom: `1px solid ${T.border}`,
          padding: "12px 24px",
          background: T.bgCard
        }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <span style={{ color: T.textMuted, fontSize: "11px", letterSpacing: "2px" }}>
              // {title.toUpperCase()}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <main style={{ position: "relative", zIndex: 10 }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{
        position: "relative",
        zIndex: 10,
        borderTop: `1px solid ${T.border}`,
        padding: "20px 24px",
        textAlign: "center",
        marginTop: "60px"
      }}>
        <span style={{ color: T.textMuted, fontSize: "11px", letterSpacing: "1px", fontFamily: "monospace", opacity: 0.5 }}>
          © 2025 VeriKalkan — KVKK uyumlu platform
        </span>
      </footer>
    </div>
  );
}
