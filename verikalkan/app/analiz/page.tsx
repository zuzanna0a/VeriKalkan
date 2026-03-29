"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Globe, FileText, Loader2, AlertCircle, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnalysisResult {
  sellsData: string;
  deletesOnClose: string;
  hasRetentionPeriod: string;
  collectsChildData: string;
  tracksLocation: string;
  riskScore: number;
  summary: string;
}

export default function AnalizPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"url" | "text">("url");
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!inputValue.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/analyze-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          url: mode === "url" ? inputValue : undefined,
          text: mode === "text" ? inputValue : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Bir hata oluştu");
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeStyle = (value: string) => {
    if (value === "EVET") return { bg: "#FEE2E2", color: "#DC2626" };
    if (value === "HAYIR") return { bg: "#DCFCE7", color: "#16A34A" };
    return { bg: "#FEF9C3", color: "#CA8A04" };
  };

  const getScoreColor = (score: number) => {
    if (score <= 40) return "bg-green-500";
    if (score <= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  const questions = [
    { key: "sellsData", label: "Verilerini 3. taraflara satıyor mu?" },
    { key: "deletesOnClose", label: "Hesap kapatılınca veriler siliniyor mu?" },
    { key: "hasRetentionPeriod", label: "Veri saklama süresi belirtilmiş mi?" },
    { key: "collectsChildData", label: "Çocuk verisi topluyor mu?" },
    { key: "tracksLocation", label: "Konum takibi yapıyor mu?" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-[#1E3A5F] text-white py-4 px-6 sticky top-0 z-20 shadow-md">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6" />
            <span className="font-bold text-lg">VeriKalkan</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link href="/" className="text-blue-200 hover:text-white transition-colors">Ana Sayfa</Link>
            <Link href="/dashboard" className="text-blue-200 hover:text-white transition-colors">Dashboard</Link>
            <Link href="/dilekce" className="text-blue-200 hover:text-white transition-colors">Dilekçe</Link>
            <Link href="/analiz" className="text-white">Analiz</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[680px] mx-auto px-4 py-12">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Politika Analizörü</h1>
            <p className="text-slate-500">Gizlilik politikalarını AI ile saniyeler içinde analiz edin.</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b">
              <button 
                onClick={() => { setMode("url"); setInputValue(""); setResult(null); setError(null); }}
                className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all ${mode === "url" ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-slate-50 text-slate-400 hover:text-slate-600'}`}
              >
                <Globe className="h-4 w-4" /> URL Yapıştır
              </button>
              <button 
                onClick={() => { setMode("text"); setInputValue(""); setResult(null); setError(null); }}
                className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all ${mode === "text" ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-slate-50 text-slate-400 hover:text-slate-600'}`}
              >
                <FileText className="h-4 w-4" /> Metin Yapıştır
              </button>
            </div>

            <div className="p-8 space-y-6">
              {mode === "url" ? (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gizlilik Politikası Linki</label>
                  <input 
                    type="url"
                    placeholder="https://sirket.com/gizlilik-politikasi"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Politika Metni</label>
                  <textarea 
                    rows={10}
                    placeholder="Gizlilik politikası veya kullanım koşulları metnini buraya yapıştırın..."
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm resize-none"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </div>
              )}

              <Button 
                onClick={handleAnalyze} 
                disabled={loading || !inputValue.trim()}
                className="w-full bg-[#1A56DB] text-white py-8 text-lg rounded-2xl shadow-lg shadow-blue-200"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Analiz Ediliyor...</span>
                  </div>
                ) : (
                  "Analiz Et →"
                )}
              </Button>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Results Card */}
          {result && (
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-8 space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Analiz Sonucu</h2>
                    <p className="text-sm text-slate-500">AI tarafından gizlilik analizi tamamlandı.</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 text-center">RİSK SKORU</div>
                    <div className={`px-4 py-1.5 rounded-full text-white font-bold text-sm ${getScoreColor(result.riskScore)}`}>
                      {result.riskScore} / 100
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-slate-100">
                  {questions.map((q) => {
                    const val = (result as any)[q.key];
                    const style = getBadgeStyle(val);
                    return (
                      <div key={q.key} className="flex justify-between items-center py-4">
                        <span className="text-sm text-slate-600 font-medium">{q.label}</span>
                        <span style={{
                          padding: "4px 12px",
                          borderRadius: "99px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          background: style.bg,
                          color: style.color
                        }}>
                          {val}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 italic relative">
                  <p className="text-sm text-slate-600 leading-relaxed text-center relative z-10">"{result.summary}"</p>
                  <div className="absolute top-0 left-0 w-8 h-8 bg-blue-100/30 rounded-full blur-xl" />
                </div>

                <Button 
                  asChild
                  className="w-full bg-[#1E3A5F] text-white py-8 text-lg rounded-2xl shadow-lg border-b-4 border-blue-900 active:border-b-0 hover:bg-[#1E3A5F]/95"
                >
                  <Link href="/dilekce" className="flex items-center justify-center gap-2">
                    Bu Şirkete Dilekçe Gönder <ChevronRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <footer className="py-8 text-center text-slate-400 text-xs">
        🛡️ Politikalarınız uçtan uca şifrelenir ve asla kaydedilmez.
      </footer>
    </div>
  );
}
