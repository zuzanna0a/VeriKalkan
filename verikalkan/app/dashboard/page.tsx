"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Plus, FileSearch, ArrowRight, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import HourglassTracker from "@/features/tracking/HourglassTracker";
import { getGamification, BADGES } from "@/features/gamification/useGamification";

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

  const gamification = getGamification();
  const activeBadges = BADGES.filter(b => gamification.badges.includes(b.id));
  const nextBadge = BADGES.find(b => !gamification.badges.includes(b.id));
  const progressToNext = nextBadge ? Math.min(100, (gamification.score / nextBadge.threshold) * 100) : 100;

  useEffect(() => {
    const raw = localStorage.getItem("vk-user");
    if (!raw) {
      router.replace("/basla");
      return;
    }

    try {
      const userData = JSON.parse(raw);
      if (!userData.onboardingComplete) {
        router.replace("/basla");
        return;
      }
      setUser(userData);
      
      // Fetch trackings
      fetch("/api/get-trackings?email=" + encodeURIComponent(userData.email))
        .then(r => r.json())
        .then(data => {
          setTrackings(data.trackings || []);
          setLoading(false);
        })
        .catch(err => {
          console.error("Tracking fetch error:", err);
          setLoading(false);
        });

    } catch (e) {
      console.error("User data parse error:", e);
      router.replace("/basla");
    }
  }, [router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Navigation */}
      <header className="bg-[#1E3A5F] text-white py-4 px-6 sticky top-0 z-20 shadow-md">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6" />
            <span className="font-bold text-lg">VeriKalkan</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/basla" className="text-sm text-blue-200 hover:text-white transition-colors">Yeniden Kur</Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-8 space-y-8">
        
        {/* SECTION 1: Greeting */}
        <section>
          <h1 className="text-3xl font-bold text-slate-900">Merhaba, {user.firstName} 👋</h1>
          <p className="text-slate-500 mt-1">Dijital veri güvenliğin takibimizde.</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Score & Actions) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* SECTION 2: Score Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">DİJİTAL SAĞLIK SKORU</span>
                  <div className={`text-8xl font-black leading-none ${user.score >= 70 ? 'text-green-500' : user.score >= 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                    {user.score}
                  </div>
                  <div className={`mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tighter ${
                    user.score >= 70 ? 'bg-green-100 text-green-700' : user.score >= 40 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {user.score >= 70 ? 'Güvendesiniz' : user.score >= 40 ? 'Risk Altındasınız' : 'Kritik Durum'}
                  </div>
                </div>

                <div className="flex-1 max-w-xs space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-500">
                      <span>İlerleme</span>
                      <span>{user.score}%</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${user.score >= 70 ? 'bg-green-500' : user.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${user.score}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">Son güncelleme: {new Date(user.lastUpdate).toLocaleDateString("tr-TR")}</p>
                  <Button asChild variant="outline" size="sm" className="w-full gap-2 text-slate-600">
                    <Link href="/basla"><RefreshCw className="h-3 w-3" /> Skoru Güncelle</Link>
                  </Button>
                </div>
              </div>
              {/* Decorative background element */}
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-slate-50 rounded-full blur-3xl opacity-50" />
            </div>

            {/* SECTION 2.5: Gamification Summary */}
            <div style={{ background: "#1E293B", borderRadius: "24px", padding: "24px", marginBottom: "20px", border: "1px solid #334155", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <h3 style={{ color: "white", margin: 0, fontSize: "18px", fontWeight: "bold" }}>⭐ Puanım</h3>
                  <p style={{ color: "#64748B", fontSize: "12px", margin: 0 }}>Aktif KVKK görevleri ile puanını artır.</p>
                </div>
                <span style={{ color: "#F59E0B", fontWeight: "900", fontSize: "28px" }}>{gamification.score}</span>
              </div>
              
              {/* Active badges */}
              {activeBadges.length > 0 && (
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
                  {activeBadges.map(b => (
                    <div key={b.id} style={{ background: "#0F172A", border: "1px solid #334155", borderRadius: "99px", padding: "6px 16px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "16px" }}>{b.icon}</span>
                      <span style={{ color: "#CBD5E1", fontSize: "13px", fontWeight: "medium" }}>{b.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Progress to next badge */}
              {nextBadge && (
                <div className="space-y-3">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <span style={{ color: "#94A3B8", fontSize: "13px" }}>Sonraki Hedef: <span className="text-blue-400 font-bold">{nextBadge.icon} {nextBadge.label}</span></span>
                    <span style={{ color: "#64748B", fontSize: "12px", fontWeight: "bold" }}>{gamification.score} / {nextBadge.threshold}</span>
                  </div>
                  <div style={{ background: "#0F172A", borderRadius: "99px", height: "8px", position: "relative", overflow: "hidden" }}>
                    <div style={{ width: progressToNext + "%", height: "100%", background: "linear-gradient(90deg, #3B82F6, #8B5CF6)", borderRadius: "99px", transition: "width: 0.8s cubic-bezier(0.4, 0, 0.2, 1)" }} />
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 3: Active Trackings */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Aktif KVKK Takipleri</h2>
                {trackings.length > 0 && <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{trackings.length} AKTİF</span>}
              </div>
              
              <div className="space-y-3">
                {loading ? (
                  <div className="p-10 text-center text-slate-400">Yükleniyor...</div>
                ) : trackings.length > 0 ? (
                  trackings.map(t => {
                    const startDate = new Date(t.deadline);
                    startDate.setDate(startDate.getDate() - 30);
                    return (
                      <HourglassTracker
                        key={t.id}
                        startDate={startDate.toISOString()}
                        companyName={t.company_name}
                        userEmail={t.user_email}
                        trackingId={t.id}
                        compact={true}
                      />
                    );
                  })
                ) : (
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center space-y-4">
                    <div className="text-4xl">⏳</div>
                    <p className="text-slate-500 text-sm">Henüz aktif takibiniz yok. Dilekçe gönderin ve takibi başlatın.</p>
                    <Button asChild variant="outline" className="text-blue-600 border-blue-200">
                      <Link href="/dilekce">Dilekçe Oluştur →</Link>
                    </Button>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column (Actions & At Risk) */}
          <div className="space-y-8">
            
            {/* SECTION 4: Quick Actions */}
            <section className="bg-[#1E3A5F] rounded-3xl p-6 text-white space-y-4 shadow-xl shadow-blue-900/10">
              <h3 className="font-bold text-lg">Hızlı Aksiyonlar</h3>
              <div className="grid grid-cols-1 gap-3">
                <Button asChild className="bg-white text-[#1E3A5F] hover:bg-white/90 justify-start gap-3 h-14 rounded-2xl">
                  <Link href="/dilekce">
                    <div className="bg-blue-50 p-2 rounded-xl">
                      <Plus className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="font-bold">Yeni Dilekçe Oluştur</span>
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="text-white hover:bg-white/10 hover:text-white justify-start gap-3 h-14 rounded-2xl border border-white/20">
                  <Link href="/analiz">
                    <div className="bg-white/10 p-2 rounded-xl">
                      <FileSearch className="h-5 w-5" />
                    </div>
                    <span className="font-bold">Metin Analizi (Beta)</span>
                  </Link>
                </Button>
              </div>
            </section>

            {/* SECTION 5: At Risk Platforms */}
            <section className="space-y-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" /> Risk Altındaki Platformlar
              </h3>
              <div className="space-y-3">
                {user.atRiskPlatforms.length > 0 ? user.atRiskPlatforms.map((p: string) => (
                  <div key={p} className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between group hover:border-red-200 transition-colors shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-50 p-2 rounded-xl group-hover:bg-red-100 transition-colors">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm">{p}</div>
                        <div className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Veri Sızıntısı Tespiti</div>
                      </div>
                    </div>
                    <Button asChild variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl px-4">
                      <Link href={`/dilekce?company=${encodeURIComponent(p)}`}>Dilekçe Gönder</Link>
                    </Button>
                  </div>
                )) : (
                  <div className="bg-green-50 border border-green-100 p-6 rounded-2xl text-center">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-green-700 font-bold text-sm">Harika!</p>
                    <p className="text-green-600 text-xs">Şu an için listende yüksek riskli bir platform bulunmuyor.</p>
                  </div>
                )}
              </div>
            </section>
          </div>

        </div>
      </main>
    </div>
  );
}
