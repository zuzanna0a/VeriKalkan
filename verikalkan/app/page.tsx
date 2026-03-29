"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Search, FileText, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { addPoints } from "@/features/gamification/useGamification";
import GamificationToast from "@/features/gamification/GamificationToast";

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
  { name: "Papara", privacyUrl: "https://www.papara.com/tr/gizlilik-politikasi" },
  { name: "N11", privacyUrl: "https://www.n11.com/gizlilik-politikasi" },
  { name: "MediaMarkt TR", privacyUrl: "https://www.mediamarkt.com.tr/gizlilik-politikasi" },
];

const AnalysisResult = ({ result }: { result: any }) => {
  const router = useRouter();
  const questions = [
    { key: "sellsData", label: "Verilerini 3. taraflara satıyor mu?" },
    { key: "deletesOnClose", label: "Hesap kapatılınca veriler siliniyor mu?" },
    { key: "hasRetentionPeriod", label: "Veri saklama süresi belirtilmiş mi?" },
    { key: "collectsChildData", label: "Çocuk verisi topluyor mu?" },
    { key: "tracksLocation", label: "Konum takibi yapıyor mu?" },
  ];
  const riskColor = result.riskScore >= 70 ? "#DC2626" : result.riskScore >= 40 ? "#D97706" : "#16A34A";
  
  return (
    <div style={{ width: "100%", maxWidth: "560px", marginTop: "24px", background: "#1E293B", border: "1px solid #334155", borderRadius: "20px", padding: "24px", boxShadow: "0 25px 50px rgba(0,0,0,0.4)" }} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h3 style={{ color: "white", margin: 0, fontSize: "18px" }}>Analiz Sonucu</h3>
        <div style={{ background: riskColor + "22", border: "1px solid " + riskColor, borderRadius: "99px", padding: "4px 14px" }}>
          <span style={{ color: riskColor, fontWeight: "bold", fontSize: "14px" }}>Risk: {result.riskScore}/100</span>
        </div>
      </div>
      {questions.map(q => {
        const value = result[q.key];
        const bg = value === "EVET" ? "#FEE2E2" : value === "HAYIR" ? "#DCFCE7" : "#FEF9C3";
        const color = value === "EVET" ? "#DC2626" : value === "HAYIR" ? "#16A34A" : "#CA8A04";
        return (
          <div key={q.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #334155" }}>
            <span style={{ color: "#CBD5E1", fontSize: "13px", flex: 1, paddingRight: "12px" }}>{q.label}</span>
            <span style={{ background: bg, color, padding: "3px 12px", borderRadius: "99px", fontSize: "12px", fontWeight: "bold", whiteSpace: "nowrap" }}>{value}</span>
          </div>
        );
      })}
      <div style={{ background: "#0F172A", borderRadius: "12px", padding: "16px", margin: "16px 0" }}>
        <p style={{ color: "#94A3B8", fontSize: "13px", lineHeight: "1.7", margin: 0 }}>{result.summary}</p>
      </div>
      <button
        onClick={() => router.push("/dilekce")}
        style={{ width: "100%", padding: "14px", background: "#1E3A5F", color: "white", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "bold", cursor: "pointer" }}
      >
        Bu Şirkete Dilekçe Gönder →
      </button>
    </div>
  );
};

export default function HomePage() {
  const [companySearch, setCompanySearch] = useState("");
  const [suggestions, setSuggestions] = useState<{name: string, privacyUrl: string}[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<{name: string, privacyUrl: string} | null>(null);
  const [manualText, setManualText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [toastBadge, setToastBadge] = useState<any>(null);

  const handleCompanySearch = (value: string) => {
    setCompanySearch(value);
    setSelectedCompany(null);
    if (value.length < 2) { setSuggestions([]); return; }
    const filtered = COMPANY_PRIVACY_URLS.filter(c =>
      c.name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 5));
  };

  const selectCompany = (company: {name: string, privacyUrl: string}) => {
    setSelectedCompany(company);
    setCompanySearch(company.name);
    setSuggestions([]);
    setManualText("");
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    try {
      const body = selectedCompany
        ? { mode: "url", url: selectedCompany.privacyUrl }
        : { mode: "text", text: manualText };
      
      const res = await fetch("/api/analyze-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      
      // Gamification +8 puan
      const { newBadges } = addPoints(8, "analiz");
      if (newBadges.length > 0) setToastBadge(newBadges[0]);
    } catch(e: any) {
      alert(e.message || "Analiz başarısız oldu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "linear-gradient(135deg, #0F172A, #1E3A5F)", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: "40px" }} className="animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 style={{ color: "white", fontSize: "36px", fontWeight: "900", margin: "0 0 8px" }}>🛡️ VeriKalkan</h1>
        <p style={{ color: "#94A3B8", fontSize: "16px", margin: 0 }}>Gizlilik politikalarını saniyeler içinde analiz et</p>
      </div>

      {/* Main analyzer card */}
      <div style={{ background: "#1E293B", borderRadius: "20px", padding: "32px", width: "100%", maxWidth: "560px", boxShadow: "0 25px 50px rgba(0,0,0,0.4)" }} className="animate-in zoom-in-95 duration-500">
        
        {/* Company search input */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ color: "#94A3B8", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>
            Şirket Ara
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Trendyol, Instagram, Google..."
              value={companySearch}
              onChange={e => handleCompanySearch(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "10px",
                border: "1px solid #334155",
                background: "#0F172A",
                color: "white",
                fontSize: "15px",
                boxSizing: "border-box"
              }}
            />
            {/* Dropdown suggestions */}
            {suggestions.length > 0 && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#1E293B", border: "1px solid #334155", borderRadius: "10px", marginTop: "4px", zIndex: 50, overflow: "hidden" }}>
                {suggestions.map(s => (
                  <div
                    key={s.name}
                    onClick={() => selectCompany(s)}
                    style={{ padding: "12px 16px", cursor: "pointer", color: "white", fontSize: "14px", borderBottom: "1px solid #0F172A33" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#334155")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    {s.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* OR divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "16px 0" }}>
          <div style={{ flex: 1, height: "1px", background: "#334155" }} />
          <span style={{ color: "#64748B", fontSize: "12px" }}>veya</span>
          <div style={{ flex: 1, height: "1px", background: "#334155" }} />
        </div>

        {/* Manual text paste */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ color: "#94A3B8", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>
            Metni Yapıştır
          </label>
          <textarea
            placeholder="Gizlilik politikası metnini buraya yapıştırın..."
            value={manualText}
            onChange={e => setManualText(e.target.value)}
            rows={5}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "10px",
              border: "1px solid #334155",
              background: "#0F172A",
              color: "white",
              fontSize: "14px",
              resize: "vertical",
              boxSizing: "border-box",
              fontFamily: "Arial, sans-serif"
            }}
          />
        </div>

        {/* Analyze button */}
        <button
          onClick={handleAnalyze}
          disabled={loading || (!selectedCompany && !manualText.trim())}
          style={{
            width: "100%",
            padding: "16px",
            background: loading ? "#334155" : "#1E3A5F",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "15px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px"
          }}
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Analiz ediliyor...
            </>
          ) : "Analiz Et →"}
        </button>

        {/* Quick access links */}
        <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginTop: "20px" }}>
          <Link href="/basla" style={{ color: "#3B82F6", fontSize: "13px", textDecoration: "none" }}>Dijital Skor →</Link>
          <Link href="/dilekce" style={{ color: "#3B82F6", fontSize: "13px", textDecoration: "none" }}>Dilekçe Oluştur →</Link>
          <Link href="/dashboard" style={{ color: "#3B82F6", fontSize: "13px", textDecoration: "none" }}>Dashboard →</Link>
        </div>
      </div>

      {/* Results shown below the card */}
      {result && <AnalysisResult result={result} />}

      {toastBadge && <GamificationToast badge={toastBadge} onClose={() => setToastBadge(null)} />}
    </div>
  );
}
