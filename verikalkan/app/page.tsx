"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";

const PARTICLES = [
  { left: "12%", height: 120, duration: 3.2, delay: 0.8 },
  { left: "24%", height: 90, duration: 4.1, delay: 2.1 },
  { left: "36%", height: 140, duration: 3.8, delay: 0.3 },
  { left: "48%", height: 100, duration: 2.9, delay: 1.5 },
  { left: "60%", height: 115, duration: 4.5, delay: 3.2 },
  { left: "72%", height: 85, duration: 3.1, delay: 0.6 },
  { left: "84%", height: 130, duration: 2.7, delay: 2.8 },
  { left: "96%", height: 95, duration: 3.9, delay: 1.1 },
];

function ParticlesBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <>
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: "1px",
            height: p.height + "px",
            left: p.left,
            background: "linear-gradient(transparent, var(--vk-primary), transparent)",
            opacity: 0.3,
            animation: `flow ${p.duration}s linear infinite`,
            animationDelay: p.delay + "s",
          }}
        />
      ))}
    </>
  );
}

export default function HomePage() {
  const [visibleLines, setVisibleLines] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleLines(prev => {
        if (prev >= 5) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ backgroundColor: "var(--vk-bg)", minHeight: "100vh", position: "relative", overflow: "hidden", color: "var(--vk-text)", transition: "background 0.3s, color 0.3s" }}>
      
      {/* Background layers */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {/* Grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(var(--vk-grid) 1px, transparent 1px), linear-gradient(90deg, var(--vk-grid) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        
        {/* Scanline */}
        <div style={{ position: "absolute", left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, rgba(var(--vk-primary-rgb), 0.1), transparent)", animation: "scan 4s linear infinite", zIndex: 1 }} />
        
        {/* Particles */}
        <ParticlesBackground />
      </div>

      {/* HEADER bar */}
      <nav style={{ position: "relative", zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 40px" }}>
        <div style={{ fontFamily: "monospace", fontSize: "20px", fontWeight: "bold", letterSpacing: "-1px" }}>
          🛡 <span>Veri</span><span style={{ color: "var(--vk-primary)" }}>Kalkan</span>
        </div>
        <div style={{ display: "flex", gap: "32px", fontFamily: "monospace", fontSize: "14px" }}>
          <Link href="/dashboard" style={{ color: "var(--vk-text-muted)", textDecoration: "none", transition: "color 0.3s" }}>Dashboard</Link>
          <Link href="/basla" style={{ color: "var(--vk-primary)", fontWeight: "bold", textDecoration: "none" }}>BAŞLA</Link>
        </div>
      </nav>

      {/* Hero content */}
      <main style={{ position: "relative", zIndex: 10, maxWidth: "640px", margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        
        <div style={{ display: "inline-block", background: "rgba(var(--vk-primary-rgb), 0.1)", border: "1px solid rgba(var(--vk-primary-rgb), 0.2)", color: "var(--vk-primary)", fontSize: "10px", letterSpacing: "3px", padding: "4px 14px", borderRadius: "4px", marginBottom: "24px", fontFamily: "monospace" }}>
          // VERİKALKAN — KİŞİSEL VERİ KORUMA SİSTEMİ
        </div>

        <h1 style={{ fontFamily: "monospace", fontSize: "clamp(32px, 8vw, 48px)", fontWeight: 900, lineHeight: 1.1, marginBottom: "24px" }}>
          Dijital kimliğiniz<br />
          <span style={{ color: "var(--vk-primary)", animation: "glow 2s infinite" }}>sizin kontrolünüzde.</span>
        </h1>

        <p style={{ color: "var(--vk-text-muted)", fontSize: "16px", lineHeight: "1.8", maxWidth: "480px", margin: "0 auto 48px" }}>
          Hangi şirketlerin elinde hangi verileriniz var? Kaç sızıntıda yer aldınız? KVKK haklarınızı otomatik dilekçeyle kullanın — dakikalar içinde.
        </p>

        {/* Terminal card */}
        <div style={{ background: "var(--vk-bg-card)", border: "1px solid var(--vk-border)", borderRadius: "8px", padding: "24px", marginBottom: "40px", fontFamily: "monospace", textAlign: "left", boxShadow: "0 20px 50px rgba(0,0,0,0.2)" }}>
          <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444" }} />
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#f59e0b" }} />
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--vk-primary)" }} />
          </div>
          
          <div style={{ fontSize: "13px", lineHeight: "1.6", minHeight: "120px" }}>
            {visibleLines >= 1 && <div style={{ color: "var(--vk-text-muted)", marginBottom: "4px" }}>› VeriKalkan sistemi başlatılıyor...</div>}
            {visibleLines >= 2 && <div style={{ color: "var(--vk-primary)", marginBottom: "4px" }}>› KVKK veritabanı yüklendi ............. [OK]</div>}
            {visibleLines >= 3 && <div style={{ color: "#f59e0b", marginBottom: "4px" }}>› 14 aktif sızıntı kaydı tespit edildi ... [UYARI]</div>}
            {visibleLines >= 4 && <div style={{ color: "#ef4444", marginBottom: "4px" }}>› Kullanıcı profili bulunamadı ........... [HATA]</div>}
            {visibleLines >= 5 && (
              <div style={{ color: "var(--vk-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
                › Kayıt için devam edin
                <div style={{ width: "8px", height: "14px", background: "var(--vk-primary)", animation: "blink 1s infinite" }} />
              </div>
            )}
          </div>
        </div>

        <Link href="/basla" style={{ textDecoration: "none" }}>
          <button style={{
            background: "var(--vk-primary)",
            color: theme === "dark" ? "#020810" : "white",
            fontFamily: "monospace",
            fontWeight: "bold",
            fontSize: "14px",
            letterSpacing: "2px",
            padding: "16px 48px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            transition: "all 0.3s",
            boxShadow: "0 0 20px rgba(var(--vk-primary-rgb), 0.3)",
            animation: "fadeUp 0.5s ease 1s both"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 0 30px rgba(var(--vk-primary-rgb), 0.5)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(var(--vk-primary-rgb), 0.3)";
          }}
          >
            BAŞLAYALIM →
          </button>
        </Link>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "16px", marginTop: "64px" }}>
          {[
            { v: "14+", l: "Sızıntı Kaydı" },
            { v: "20+", l: "Şirket DPO" },
            { v: "30 Gün", l: "Yasal Takip" }
          ].map((s, i) => (
            <div key={i} style={{ background: "var(--vk-bg-card)", border: "1px solid var(--vk-border)", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
              <div style={{ color: "var(--vk-primary)", fontSize: "24px", fontWeight: "bold", fontFamily: "monospace", marginBottom: "4px" }}>{s.v}</div>
              <div style={{ color: "var(--vk-text-muted)", fontSize: "9px", fontFamily: "monospace", letterSpacing: "1px", textTransform: "uppercase" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </main>

      {/* "Nasıl Çalışır?" SECTION */}
      <section style={{ backgroundColor: "var(--vk-bg-card)", padding: "80px 24px", position: "relative", zIndex: 10 }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "monospace", fontSize: "24px", textAlign: "center", marginBottom: "48px", color: "var(--vk-text)" }}>
            <span style={{ color: "var(--vk-primary)" }}>›</span> NASIL ÇALIŞIR?
          </h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
            {[
              { n: "01", t: "Profil Oluştur", d: "Platformlarını seç, e-postanı gir, dijital sağlık skorunu öğren." },
              { n: "02", t: "Analiz Et", d: "Gizlilik politikalarını yapay zeka ile saniyeler içinde analiz et." },
              { n: "03", t: "Hakkını Kullan", d: "KVKK dilekçeni oluştur, şirkete gönder, 30 gün takip et." },
              { n: "04", t: "Saye ile Danış", d: "Kişisel veri haklarını ve dijital risklerini 7/24 Saye'ye sor, bilinçlen." }
            ].map((step, i) => (
              <div key={i} style={{ background: "var(--vk-bg)", border: "1px solid var(--vk-border)", borderRadius: "12px", padding: "24px" }}>
                <div style={{ color: "rgba(var(--vk-primary-rgb), 0.3)", fontSize: "11px", fontFamily: "monospace", marginBottom: "12px" }}>{step.n}</div>
                <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px", color: "var(--vk-text)" }}>{step.t}</h3>
                <p style={{ color: "var(--vk-text-muted)", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: "var(--vk-bg)", borderTop: "1px solid var(--vk-border)", padding: "40px 24px", textAlign: "center" }}>
        <p style={{ color: "var(--vk-text-muted)", fontSize: "11px", fontFamily: "monospace", margin: 0, letterSpacing: "1px", opacity: 0.5 }}>
          © 2025 VERİKALKAN — TÜM HAKLARI SAKLIDIR. KVKK UYUMLU PLATFORM.
        </p>
      </footer>
    </div>
  );
}
