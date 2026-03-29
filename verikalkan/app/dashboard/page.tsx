"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Plus, FileSearch, ArrowRight, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";
import HourglassTracker from "@/features/tracking/HourglassTracker";
import { getGamification, BADGES } from "@/features/gamification/useGamification";
import PixelBadge from "@/features/gamification/PixelBadge";
import DarkLayout from "@/components/DarkLayout";
import { useTheme } from "@/context/ThemeContext";

interface TrackingRecord {
  id: string;
  company_name: string;
  user_email: string;
  deadline: string;
  result: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [trackings, setTrackings] = useState<TrackingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  const gamification = getGamification();
  const nextBadge = BADGES.find(b => !gamification.badges.includes(b.id));
  const progressToNext = nextBadge ? Math.min(100, (gamification.score / nextBadge.threshold) * 100) : 100;

  useEffect(() => {
    const raw = localStorage.getItem("vk-user");
    if (!raw) { router.replace("/basla"); return; }
    try {
      const userData = JSON.parse(raw);
      if (!userData.onboardingComplete) { router.replace("/basla"); return; }
      setUser(userData);
      fetch("/api/get-trackings?email=" + encodeURIComponent(userData.email))
        .then(r => r.json())
        .then(data => { setTrackings(data.trackings || []); setLoading(false); })
        .catch(() => setLoading(false));
    } catch { router.replace("/basla"); }
  }, [router]);

  if (!user) return null;

  const cardStyle = { background: "var(--vk-bg-card)", border: "1px solid var(--vk-border)", borderRadius: "12px", padding: "24px" };
  const labelStyle = { color: "var(--vk-text-muted)", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase" as const, fontFamily: "monospace", marginBottom: "12px", display: "block" };
  const primaryButtonStyle = { background: "var(--vk-primary)", color: "var(--vk-bg)", fontFamily: "monospace", fontWeight: "bold", fontSize: "12px", letterSpacing: "2px", padding: "12px 24px", border: "none", borderRadius: "6px", cursor: "pointer", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" };
  const secondaryButtonStyle = { background: "transparent", border: "1px solid var(--vk-border)", color: "var(--vk-text-muted)", fontFamily: "monospace", fontSize: "12px", letterSpacing: "1px", padding: "12px 24px", borderRadius: "6px", cursor: "pointer", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" };

  return (
    <DarkLayout title="Dashboard">
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        
        {/* SECTION 1: Greeting */}
        <section>
          <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "var(--vk-text)", marginBottom: "8px" }}>Merhaba, {user.firstName} 👋</h1>
          <p style={{ color: "var(--vk-text-muted)", fontSize: "14px" }}>Dijital veri güvenliğin sistemimiz tarafından takip ediliyor.</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* SCORE CARD */}
            <div style={cardStyle}>
              <label style={labelStyle}>// DİJİTAL SAĞLIK SKORU</label>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="text-center md:text-left">
                  <div style={{ 
                    fontSize: "84px", 
                    fontWeight: 900, 
                    color: user.score >= 70 ? "var(--vk-primary)" : user.score >= 40 ? "#f59e0b" : "#ef4444",
                    lineHeight: 1,
                    textShadow: `0 0 20px ${user.score >= 70 ? "rgba(var(--vk-primary-rgb), 0.3)" : "#f59e0b33"}`
                  }}>
                    {user.score}
                  </div>
                  <div style={{ 
                    marginTop: "8px",
                    fontSize: "10px",
                    fontWeight: "bold",
                    color: user.score >= 70 ? "var(--vk-primary)" : user.score >= 40 ? "#f59e0b" : "#ef4444",
                    letterSpacing: "2px"
                  }}>
                    {user.score >= 70 ? 'GÜVENDESİNİZ' : user.score >= 40 ? 'RİSK ALTINDASINIZ' : 'KRİTİK DURUM'}
                  </div>
                </div>

                <div className="flex-1 max-w-xs space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500">
                      <span>Analiz Seviyesi</span>
                      <span>{user.score}%</span>
                    </div>
                    <div style={{ background: "var(--vk-bg-input)", height: "6px", borderRadius: "99px", overflow: "hidden" }}>
                      <div style={{ 
                        width: `${user.score}%`, 
                        height: "100%", 
                        background: user.score >= 70 ? "var(--vk-primary)" : user.score >= 40 ? "#f59e0b" : "#ef4444",
                        transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)"
                      }} />
                    </div>
                  </div>
                  <Link href="/basla" style={secondaryButtonStyle}>
                    <RefreshCw className="h-3 w-3" /> SKORU GÜNCELLE
                  </Link>
                </div>
              </div>
            </div>

            {/* GAMIFICATION */}
            <div style={cardStyle}>
              <div className="flex justify-between items-center mb-6">
                <label style={{...labelStyle, marginBottom: 0}}>// BAŞARIMLAR VE PUAN</label>
                <span style={{ color: "var(--vk-primary)", fontWeight: "900", fontSize: "24px" }}>{gamification.score}</span>
              </div>
              
              <div className="flex gap-8 flex-wrap justify-center py-6 border-y border-dashed border-vk-border mb-6">
                {["dedektif", "kalkan", "savasci", "usta"].map(badgeId => (
                  <PixelBadge key={badgeId} badgeId={badgeId as any} unlocked={gamification.badges.includes(badgeId)} size={56} />
                ))}
              </div>

              {nextBadge && (
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span style={{ color: "var(--vk-text-muted)", fontSize: "11px", letterSpacing: "1px" }}>SONRAKİ: <span style={{ color: "var(--vk-primary)" }}>{nextBadge.label}</span></span>
                    <span style={{ color: "var(--vk-text-muted)", fontSize: "10px", fontWeight: "bold" }}>{gamification.score} / {nextBadge.threshold}</span>
                  </div>
                  <div style={{ background: "var(--vk-bg-input)", borderRadius: "99px", height: "4px", overflow: "hidden" }}>
                    <div style={{ width: progressToNext + "%", height: "100%", background: "var(--vk-primary)", transition: "all 0.8s" }} />
                  </div>
                </div>
              )}
            </div>

            {/* ACTIVE TRACKINGS */}
            <section className="space-y-6">
              <label style={labelStyle}>// AKTİF KVKK TAKİPLERİ</label>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-12 text-vk-text-muted font-mono">TAKİP VERİLERİ ÇEKİLİYOR...</div>
                ) : trackings.length > 0 ? (
                  trackings.map(t => {
                    const startDate = new Date(t.deadline);
                    startDate.setDate(startDate.getDate() - 30);
                    return (
                      <div key={t.id} style={cardStyle} className="p-0 overflow-hidden">
                        <HourglassTracker
                          startDate={startDate.toISOString()}
                          companyName={t.company_name}
                          userEmail={t.user_email}
                          trackingId={t.id}
                          compact={true}
                        />
                      </div>
                    );
                  })
                ) : (
                  <div style={{...cardStyle, borderStyle: "dashed", textAlign: "center", padding: "48px"}}>
                    <p style={{ color: "var(--vk-text-muted)", fontSize: "13px", marginBottom: "24px" }}>Henüz aktif takibiniz yok. Dilekçe göndererek süreci başlatın.</p>
                    <Link href="/dilekce" style={primaryButtonStyle}>
                      DİLEKÇE OLUŞTUR →
                    </Link>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            
            {/* QUICK ACTIONS */}
            <section style={{...cardStyle, background: "rgba(var(--vk-primary-rgb), 0.05)", borderColor: "rgba(var(--vk-primary-rgb), 0.2)"}}>
              <label style={{...labelStyle, color: "var(--vk-primary)", opacity: 0.6}}>// HIZLI AKSİYONLAR</label>
              <div className="grid grid-cols-1 gap-4 mt-4">
                <Link href="/dilekce" style={primaryButtonStyle}>
                  <Plus className="h-4 w-4" /> YENİ DİLEKÇE
                </Link>
                <Link href="/analiz" style={secondaryButtonStyle}>
                  <FileSearch className="h-4 w-4" /> POLİTİKA ANALİZİ
                </Link>
              </div>
            </section>

            {/* RISKS */}
            <section className="space-y-6">
              <label style={labelStyle}>// RİSKLİ PLATFORMLAR</label>
              <div className="space-y-3">
                {user.atRiskPlatforms.length > 0 ? user.atRiskPlatforms.map((p: string) => (
                  <div key={p} style={cardStyle} className="flex items-center justify-between group">
                    <div>
                      <div style={{ color: "var(--vk-text)", fontWeight: "bold", fontSize: "14px" }}>{p}</div>
                      <div style={{ color: "#ef4444", fontSize: "10px", fontWeight: "bold", letterSpacing: "1px", marginTop: "2px" }}>SIZINTI TESPİTİ</div>
                    </div>
                    <Link href={`/dilekce?company=${encodeURIComponent(p)}`} style={{ color: "var(--vk-primary)", fontSize: "11px", textDecoration: "none" }}>DİLEKÇE →</Link>
                  </div>
                )) : (
                  <div style={{...cardStyle, textAlign: "center", padding: "32px"}}>
                    <CheckCircle className="h-8 w-8 opacity-20 mx-auto mb-4" />
                    <p style={{ color: "var(--vk-text-muted)", fontSize: "12px", fontWeight: "bold" }}>Şu an için yüksek riskli platform bulunmuyor.</p>
                  </div>
                )}
              </div>
            </section>
          </div>

        </div>
      </div>
    </DarkLayout>
  );
}
