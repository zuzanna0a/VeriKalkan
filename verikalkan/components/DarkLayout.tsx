"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";

interface DarkLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function DarkLayout({ children, title }: DarkLayoutProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

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
    { href: "/dilekce", label: "Dilekçe" },
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
        padding: "0 24px",
      }}>
        <div style={{
          maxWidth: "900px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "56px"
        }}>
          <Link href="/" style={{
            color: T.primary,
            fontWeight: "bold",
            fontSize: "15px",
            textDecoration: "none",
            letterSpacing: "1px",
            fontFamily: "monospace"
          }}>
            🛡 VeriKalkan
          </Link>
          
          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              onClick={toggleTheme}
              style={{
                background: "transparent",
                border: `1px solid ${T.border}`,
                borderRadius: "6px",
                padding: "6px 10px",
                cursor: "pointer",
                fontFamily: "monospace",
                fontSize: "11px",
                color: T.textMuted,
                letterSpacing: "1px",
                marginRight: "16px",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = T.primary;
                e.currentTarget.style.color = T.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = T.border;
                e.currentTarget.style.color = T.textMuted;
              }}
            >
              {theme === "dark" ? "☀ LIGHT" : "◉ DARK"}
            </button>

            <nav style={{ display: "flex", gap: "24px", alignItems: "center" }}>
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    color: pathname === link.href ? T.primary : T.textMuted,
                    fontSize: "12px",
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
              ))}
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
