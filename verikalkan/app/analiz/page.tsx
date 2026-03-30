"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { addPoints } from "@/features/gamification/useGamification";
import GamificationToast from "@/features/gamification/GamificationToast";
import DarkLayout from "@/components/DarkLayout";
import { useTheme } from "@/context/ThemeContext";
import PixelIcon from "@/features/ui/PixelIcon";

const COMPANY_PRIVACY_URLS = [
  { name: "Trendyol", privacyUrl: "https://www.trendyol.com/gizlilik-politikasi" },
  { name: "Hepsiburada", privacyUrl: "https://www.hepsiburada.com/gizlilik-politikasi" },
  { name: "Getir", privacyUrl: "https://getir.com/tr/gizlilik-politikasi/" },
  { name: "Yemeksepeti", privacyUrl: "https://www.yemeksepeti.com/tr-tr/gizlilik-politikasi" },
  { name: "Sahibinden", privacyUrl: "https://www.sahibinden.com/gizlilik-politikasi" },
  { name: "Instagram", privacyUrl: "https://privacycenter.instagram.com/policy" },
  { name: "Google", privacyUrl: "https://policies.google.com/privacy?hl=tr" },
  { name: "Facebook", privacyUrl: "https://www.facebook.com/privacy/policy/" },
  { name: "Twitter/X", privacyUrl: "https://twitter.com/tr/privacy" },
  { name: "LinkedIn", privacyUrl: "https://www.linkedin.com/legal/privacy-policy" },
  { name: "TikTok", privacyUrl: "https://www.tiktok.com/legal/page/row/privacy-policy/tr-TR" },
  { name: "Amazon TR", privacyUrl: "https://www.amazon.com.tr/gizlilik-politikasi" },
];

export default function AnalysisPage() {
  const router = useRouter();
  const [companySearch, setCompanySearch] = useState("");
  const [suggestions, setSuggestions] = useState<{name: string, privacyUrl: string}[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<{name: string, privacyUrl: string} | null>(null);
  const [manualText, setManualText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [toastBadge, setToastBadge] = useState<any>(null);
  const { theme } = useTheme();

  const handleCompanySearch = (value: string) => {
    setCompanySearch(value);
    setSelectedCompany(null);
    if (value.length < 2) { setSuggestions([]); return; }
    const filtered = COMPANY_PRIVACY_URLS.filter(c => c.name.toLowerCase().includes(value.toLowerCase()));
    setSuggestions(filtered.slice(0, 5));
  };

  const selectCompany = (company: {name: string, privacyUrl: string}) => {
    setSelectedCompany(company);
    setCompanySearch(company.name);
    setSuggestions([]);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    try {
      const body = selectedCompany ? { mode: "url", url: selectedCompany.privacyUrl } : { mode: "text", text: manualText };
      const res = await fetch("/api/analyze-text", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      const { newBadges } = addPoints(8, "analiz");
      if (newBadges.length > 0) setToastBadge(newBadges[0]);
    } catch(e: any) {
      alert(e.message || "Hata oluştu.");
    } finally { setLoading(false); }
  };

  const labelStyle = { color: "var(--vk-text-muted)", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase" as const, fontFamily: "monospace", marginBottom: "12px", display: "block" };
  const inputStyle = { width: "100%", background: "var(--vk-bg-input)", border: "1px solid var(--vk-border)", borderRadius: "8px", padding: "12px 16px", color: "var(--vk-text)", fontFamily: "monospace", outline: "none" };
  const cardStyle = { background: "var(--vk-bg-card)", border: "1px solid var(--vk-border)", borderRadius: "12px", padding: "32px", width: "100%", maxWidth: "600px", margin: "0 auto" };
  const primaryButtonStyle = { background: "var(--vk-primary)", color: "var(--vk-bg)", fontFamily: "monospace", fontWeight: "bold", fontSize: "12px", letterSpacing: "2px", padding: "14px 24px", border: "none", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" };

  return (
    <DarkLayout title="Gizlilik Analizi">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div style={cardStyle}>
          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>// ŞİRKET ARA</label>
            <div className="relative">
              <input style={inputStyle} placeholder="Amazon, Trendyol, Instagram..." value={companySearch} onChange={e => handleCompanySearch(e.target.value)} />
              {suggestions.length > 0 && (
                <div style={{ position: "absolute", top: "110%", left: 0, right: 0, background: "var(--vk-bg-card)", border: "1px solid var(--vk-border)", borderRadius: "8px", zIndex: 50, overflow: "hidden" }}>
                  {suggestions.map(s => (
                    <div key={s.name} onClick={() => selectCompany(s)} style={{ padding: "12px 16px", color: "var(--vk-text)", fontSize: "12px", fontFamily: "monospace", cursor: "pointer", borderBottom: "1px solid var(--vk-border)" }}>{s.name}</div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ margin: "24px 0", textAlign: "center", color: "var(--vk-text-muted)", fontSize: "11px" }}>--- VEYA ---</div>

          <div style={{ marginBottom: "32px" }}>
            <label style={labelStyle}>// METNİ YAPIŞTIR</label>
            <textarea style={{...inputStyle, height: "200px", resize: "none"}} placeholder="Gizlilik politikası metnini buraya yapıştırın..." value={manualText} onChange={e => setManualText(e.target.value)} />
          </div>

          <button onClick={handleAnalyze} disabled={loading} style={{...primaryButtonStyle, width: "100%"}}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>ANALİZİ BAŞLAT <PixelIcon variant="arrow" size={14} color="currentColor" /></>}
          </button>
        </div>

        {result && (
          <div style={{...cardStyle, marginTop: "40px", border: `1px solid ${result.riskScore >= 70 ? "rgba(239, 68, 68, 0.3)" : "rgba(var(--vk-primary-rgb), 0.3)"}`}}>
            <div className="flex justify-between items-center mb-10">
              <label style={labelStyle}>// ANALİZ SONUCU</label>
              <div style={{ fontSize: "28px", fontWeight: "bold", color: result.riskScore >= 70 ? "#ef4444" : result.riskScore >= 40 ? "#f59e0b" : "var(--vk-primary)", fontFamily: "monospace" }}>{result.riskScore}/100</div>
            </div>

            <div className="space-y-4 mb-10">
              {[
                { key: "sellsData", label: "Verileri 3. taraflara satıyor mu?" },
                { key: "deletesOnClose", label: "Hesap kapatılınca siliyor mu?" },
                { key: "hasRetentionPeriod", label: "Saklama süresi belirtilmiş mi?" },
                { key: "tracksLocation", label: "Konum takibi yapıyor mu?" }
              ].map(q => (
                <div key={q.key} className="flex justify-between items-center py-3 border-b border-vk-border">
                  <span style={{ fontSize: "12px", color: "var(--vk-text-muted)", fontFamily: "monospace" }}>{q.label}</span>
                  <span style={{ fontSize: "11px", fontWeight: "bold", color: result[q.key] === "EVET" ? "#ef4444" : "var(--vk-primary)", fontFamily: "monospace" }}>{result[q.key]}</span>
                </div>
              ))}
            </div>

            <div style={{ background: "var(--vk-bg)", padding: "16px", borderRadius: "8px", border: "1px solid var(--vk-border)", color: "var(--vk-text-muted)", fontSize: "12px", lineHeight: "1.6", marginBottom: "20px" }}>
              {result.summary}
            </div>

            <Link href="/dilekce" style={{...primaryButtonStyle, width: "100%"}}>BU ŞİRKETE DİLEKÇE GÖNDER <PixelIcon variant="arrow" size={14} color="currentColor" /></Link>
          </div>
        )}
      </div>
      {toastBadge && <GamificationToast badge={toastBadge} onClose={() => setToastBadge(null)} />}
    </DarkLayout>
  );
}
