"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, CheckCircle2, CheckCircle, AlertCircle, Trash2, Plus, ArrowRight } from "lucide-react";
import { KNOWN_BREACHES } from "@/features/score/breach-database";
import { addPoints } from "@/features/gamification/useGamification";
import GamificationToast from "@/features/gamification/GamificationToast";
import DarkLayout from "@/components/DarkLayout";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [subStep, setSubStep] = useState(1); 
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    selectedPlatforms: [] as string[],
    customPlatforms: [] as string[],
    yearsOnline: "1-3 yıl", 
    hasRequestedDeletion: false,
    score: 0,
    atRiskPlatforms: [] as string[],
  });

  const [customInput, setCustomInput] = useState("");
  const [customBreachFeedback, setCustomBreachFeedback] = useState<{
    match: boolean;
    name: string;
    year?: number;
    dataClasses?: string[];
  } | null>(null);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [toastBadge, setToastBadge] = useState<any>(null);

  const platforms = [
    "Trendyol", "Hepsiburada", "Getir", "Yemeksepeti", "Sahibinden", "Amazon TR",
    "Instagram", "Twitter/X", "LinkedIn", "TikTok", "Facebook",
    "Papara", "Monese", "Ziraat Bankası"
  ];

  const handleTogglePlatform = (name: string) => {
    setFormData(prev => ({
      ...prev,
      selectedPlatforms: prev.selectedPlatforms.includes(name)
        ? prev.selectedPlatforms.filter(p => p !== name)
        : [...prev.selectedPlatforms, name]
    }));
  };

  const checkCustomBreach = (companyName: string) => {
    const lower = companyName.toLowerCase().trim();
    const match = KNOWN_BREACHES.find(b => 
      b.name.toLowerCase().includes(lower) || 
      lower.includes(b.name.toLowerCase())
    );
    if (match) {
      setCustomBreachFeedback({ match: true, name: match.name, year: match.year, dataClasses: match.dataClasses });
    } else {
      setCustomBreachFeedback({ match: false, name: companyName });
    }
  };

  const handleAddCustom = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && customInput.trim()) {
      e.preventDefault();
      const val = customInput.trim();
      if (!formData.customPlatforms.includes(val)) {
        setFormData(prev => ({ ...prev, customPlatforms: [...prev.customPlatforms, val] }));
        checkCustomBreach(val);
      }
      setCustomInput("");
    }
  };

  const removeCustom = (name: string) => {
    setFormData(prev => ({ ...prev, customPlatforms: prev.customPlatforms.filter(p => p !== name) }));
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const calculateScore = () => {
    const allPlatforms = [...formData.selectedPlatforms, ...formData.customPlatforms];
    const matchedBreaches = KNOWN_BREACHES.filter(b => allPlatforms.some(p => p.toLowerCase() === b.name.toLowerCase()));
    const atRisk = matchedBreaches.map(b => b.name);
    const atRiskCount = atRisk.length;
    
    let score = 90;
    if (atRiskCount === 1) score = 75;
    else if (atRiskCount <= 3 && atRiskCount > 1) score = 55;
    else if (atRiskCount <= 5 && atRiskCount > 3) score = 35;
    else if (atRiskCount > 5) score = 20;

    if (formData.yearsOnline === "12+ yıl") score -= 10;
    if (formData.hasRequestedDeletion) score += 10;
    score = Math.max(0, Math.min(100, score));

    setFormData(prev => ({ ...prev, score, atRiskPlatforms: atRisk }));
    const { newBadges } = addPoints(5, "skor");
    if (newBadges.length > 0) setToastBadge(newBadges[0]);
  };

  const handleFinish = () => {
    const saveData = { ...formData, onboardingComplete: true, lastUpdate: new Date().toISOString() };
    localStorage.setItem("vk-user", JSON.stringify(saveData));
    localStorage.setItem("user-email", formData.email);
    addPoints(10, "onboarding");
    router.push("/dashboard");
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !validateEmail(formData.email)) {
        setIsValidEmail(validateEmail(formData.email));
        return;
      }
      setStep(2);
      return;
    }
    if (step === 2) {
      if (subStep === 1) {
        if (formData.selectedPlatforms.length + formData.customPlatforms.length === 0) {
          alert("En az bir platform seçin.");
          return;
        }
        setSubStep(2);
        return;
      }
      if (subStep === 2) { setSubStep(3); return; }
      if (subStep === 3) { calculateScore(); setStep(3); return; }
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (step === 2) {
      if (subStep === 2) { setSubStep(1); return; }
      if (subStep === 3) { setSubStep(2); return; }
      setStep(1);
      return;
    }
    setStep(prev => prev - 1);
  };

  const labelStyle = { color: "var(--vk-text-muted)", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase" as const, fontFamily: "monospace", marginBottom: "8px", display: "block" };
  const inputStyle = { width: "100%", background: "var(--vk-bg-input)", border: "1px solid var(--vk-border)", borderRadius: "8px", padding: "12px 16px", color: "var(--vk-text)", fontFamily: "monospace", outline: "none" };
  const cardStyle = { background: "var(--vk-bg-card)", border: "1px solid var(--vk-border)", borderRadius: "12px", padding: "24px", marginBottom: "24px" };
  const primaryButtonStyle = { background: "var(--vk-primary)", color: "var(--vk-bg)", fontFamily: "monospace", fontWeight: "bold", fontSize: "12px", letterSpacing: "2px", padding: "14px 24px", border: "none", borderRadius: "6px", cursor: "pointer" };
  const secondaryButtonStyle = { background: "transparent", border: "1px solid var(--vk-border)", color: "var(--vk-text-muted)", fontFamily: "monospace", fontSize: "12px", letterSpacing: "1px", padding: "14px 24px", borderRadius: "6px", cursor: "pointer" };

  return (
    <DarkLayout title="Profil Oluştur">
      <div className="max-w-xl mx-auto px-6 py-12">
        
        {/* Progress Bar */}
        <div style={{ background: "var(--vk-bg-card)", border: "1px solid var(--vk-border)", height: "6px", borderRadius: "99px", marginBottom: "40px", overflow: "hidden", display: "flex" }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ flex: 1, background: s <= step ? "var(--vk-primary)" : "transparent", transition: "all 0.5s ease" }} />
          ))}
        </div>

        <div style={cardStyle}>
          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 style={{ color: "var(--vk-text)", fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>Tanışalım 👋</h2>
                <p style={{ color: "var(--vk-text-muted)", fontSize: "14px" }}>Dilekçelerini senin adına hazırlayabilmemiz için bu bilgiler gerekli.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label style={labelStyle}>// AD</label>
                  <input style={inputStyle} value={formData.firstName} onChange={e => setFormData(p => ({...p, firstName: e.target.value}))} placeholder="Ayşe" />
                </div>
                <div className="space-y-2">
                  <label style={labelStyle}>// SOYAD</label>
                  <input style={inputStyle} value={formData.lastName} onChange={e => setFormData(p => ({...p, lastName: e.target.value}))} placeholder="Yılmaz" />
                </div>
              </div>

              <div className="space-y-2">
                <label style={labelStyle}>// E-POSTA</label>
                <input style={{...inputStyle, borderColor: !isValidEmail ? "#ef4444" : "var(--vk-border)"}} value={formData.email} onChange={e => setFormData(p => ({...p, email: e.target.value}))} placeholder="ayse@örnek.com" />
                {!isValidEmail && <p style={{ color: "#ef4444", fontSize: "10px", marginTop: "4px" }}>Geçerli bir e-posta adresi girin.</p>}
              </div>

              <button onClick={nextStep} style={{...primaryButtonStyle, width: "100%"}}>İLERİ →</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              {subStep === 1 && (
                <>
                  <div className="text-center">
                    <h2 style={{ color: "var(--vk-text)", fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>Platform Seçimi</h2>
                    <p style={{ color: "var(--vk-text-muted)", fontSize: "14px" }}>Kullandığın platformları seç, risklerini analiz edelim.</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto p-1">
                    {platforms.map(p => {
                      const isSelected = formData.selectedPlatforms.includes(p);
                      return (
                        <button
                          key={p}
                          onClick={() => handleTogglePlatform(p)}
                          style={{
                            padding: "12px",
                            fontSize: "13px",
                            fontFamily: "monospace",
                            border: `1px solid ${isSelected ? "var(--vk-primary)" : "var(--vk-border)"}`,
                            background: isSelected ? "rgba(var(--vk-primary-rgb), 0.1)" : "var(--vk-bg-input)",
                            color: isSelected ? "var(--vk-primary)" : "var(--vk-text-muted)",
                            borderRadius: "8px",
                            textAlign: "left",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            transition: "all 0.2s"
                          }}
                        >
                          {p}
                          {isSelected && <CheckCircle2 className="h-4 w-4" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-2">
                    <label style={labelStyle}>// LİSTEDE OLMAYAN VAR MI?</label>
                    <div className="relative">
                      <input 
                        style={inputStyle}
                        value={customInput}
                        onChange={e => setCustomInput(e.target.value)}
                        onKeyDown={handleAddCustom}
                        placeholder="Şirket adı yazın ve Enter'a basın"
                      />
                    </div>
                    {customBreachFeedback && (
                      <div style={{ 
                        marginTop: "12px", 
                        padding: "12px", 
                        borderRadius: "8px", 
                        fontSize: "11px", 
                        border: `1px solid ${customBreachFeedback.match ? "#ef444455" : "rgba(var(--vk-primary-rgb), 0.3)"}`,
                        background: customBreachFeedback.match ? "#ef444411" : "rgba(var(--vk-primary-rgb), 0.1)",
                        color: customBreachFeedback.match ? "#ef4444" : "var(--vk-primary)",
                        fontFamily: "monospace"
                      }}>
                        {customBreachFeedback.match ? (
                          <>
                            <span className="font-bold">[{customBreachFeedback.name}] SIZINTI TESPİT EDİLDİ</span>
                            <br />{customBreachFeedback.year} — {customBreachFeedback.dataClasses?.join(', ')}
                          </>
                        ) : (
                          <span>[{customBreachFeedback.name}] SIZINTI KAYDI BULUNAMADI.</span>
                        )}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {formData.customPlatforms.map(cp => (
                        <span key={cp} style={{ background: "var(--vk-bg)", color: "var(--vk-text)", padding: "4px 12px", borderRadius: "99px", fontSize: "11px", display: "flex", alignItems: "center", gap: "8px", border: "1px solid var(--vk-border)" }}>
                          {cp}
                          <button onClick={() => removeCustom(cp)}><Trash2 className="h-3 w-3 opacity-50 hover:opacity-100" /></button>
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {subStep === 2 && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 style={{ color: "var(--vk-text)", fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>İnternet Deneyimi</h2>
                    <p style={{ color: "var(--vk-text-muted)", fontSize: "14px" }}>Kaç yıldır aktif internet kullanıcısısın?</p>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {["1-3 yıl", "4-7 yıl", "8-12 yıl", "12+ yıl"].map(opt => (
                      <button
                        key={opt}
                        onClick={() => setFormData(p => ({...p, yearsOnline: opt}))}
                        style={{
                          padding: "16px",
                          textAlign: "left",
                          borderRadius: "12px",
                          border: `1px solid ${formData.yearsOnline === opt ? "var(--vk-primary)" : "var(--vk-border)"}`,
                          background: formData.yearsOnline === opt ? "rgba(var(--vk-primary-rgb), 0.1)" : "var(--vk-bg-input)",
                          color: formData.yearsOnline === opt ? "var(--vk-primary)" : "var(--vk-text-muted)",
                          fontFamily: "monospace",
                          display: "flex",
                          justifyContent: "space-between",
                          transition: "all 0.2s"
                        }}
                      >
                        <span className="font-bold">{opt}</span>
                        {formData.yearsOnline === opt && <CheckCircle2 className="h-5 w-5" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {subStep === 3 && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 style={{ color: "var(--vk-text)", fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>Veri Bilinci</h2>
                    <p style={{ color: "var(--vk-text-muted)", fontSize: "14px" }}>Son 1 yılda veri silme talebinde bulundun mu?</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <button
                      onClick={() => setFormData(p => ({...p, hasRequestedDeletion: true}))}
                      style={{
                        padding: "24px",
                        textAlign: "center",
                        borderRadius: "12px",
                        border: `1px solid ${formData.hasRequestedDeletion ? "var(--vk-primary)" : "var(--vk-border)"}`,
                        background: formData.hasRequestedDeletion ? "rgba(var(--vk-primary-rgb), 0.1)" : "var(--vk-bg-input)",
                        color: formData.hasRequestedDeletion ? "var(--vk-primary)" : "var(--vk-text-muted)",
                        transition: "all 0.2s"
                      }}
                    >
                      <CheckCircle style={{ margin: "0 auto 12px", color: formData.hasRequestedDeletion ? "var(--vk-primary)" : "var(--vk-text-muted)" }} />
                      <span className="font-bold text-lg">Evet, bulundum</span>
                    </button>
                    <button
                      onClick={() => setFormData(p => ({...p, hasRequestedDeletion: false}))}
                      style={{
                        padding: "24px",
                        textAlign: "center",
                        borderRadius: "12px",
                        border: `1px solid ${!formData.hasRequestedDeletion ? "var(--vk-primary)" : "var(--vk-border)"}`,
                        background: !formData.hasRequestedDeletion ? "rgba(var(--vk-primary-rgb), 0.1)" : "var(--vk-bg-input)",
                        color: !formData.hasRequestedDeletion ? "var(--vk-primary)" : "var(--vk-text-muted)",
                        transition: "all 0.2s"
                      }}
                    >
                      <Trash2 style={{ margin: "0 auto 12px", color: !formData.hasRequestedDeletion ? "var(--vk-primary)" : "var(--vk-text-muted)" }} />
                      <span className="font-bold">Hayır, bulunmadım</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button onClick={prevStep} style={{...secondaryButtonStyle, flex: 1}}>GERİ</button>
                <button onClick={nextStep} style={{...primaryButtonStyle, flex: 2}}>İLERİ →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-10">
              <div className="text-center">
                <h2 style={{ color: "var(--vk-text)", fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>Dijital Sağlık Skorun</h2>
                <p style={{ color: "var(--vk-text-muted)", fontSize: "14px" }}>Analiz tamamlandı, durumunuzu inceleyin.</p>
              </div>

              <div className="flex flex-col items-center">
                <div style={{ 
                  fontSize: "84px", 
                  fontWeight: 900, 
                  lineHeight: 1, 
                  color: formData.score >= 70 ? "var(--vk-primary)" : formData.score >= 40 ? "#f59e0b" : "#ef4444",
                  textShadow: `0 0 20px ${formData.score >= 70 ? "rgba(var(--vk-primary-rgb), 0.4)" : formData.score >= 40 ? "#f59e0b44" : "#ef444444"}`,
                  fontFamily: "monospace"
                }}>
                  {formData.score}
                </div>
                <div style={{ 
                  marginTop: "16px",
                  padding: "4px 16px",
                  borderRadius: "4px",
                  fontSize: "11px",
                  fontWeight: "bold",
                  background: formData.score >= 70 ? "rgba(var(--vk-primary-rgb), 0.1)" : formData.score >= 40 ? "#f59e0b11" : "#ef444411",
                  color: formData.score >= 70 ? "var(--vk-primary)" : formData.score >= 40 ? "#f59e0b" : "#ef4444",
                  border: `1px solid ${formData.score >= 70 ? "rgba(var(--vk-primary-rgb), 0.3)" : formData.score >= 40 ? "#f59e0b33" : "#ef444433"}`,
                  textTransform: "uppercase",
                  letterSpacing: "2px"
                }}>
                  {formData.score >= 70 ? 'GÜVENLİ' : formData.score >= 40 ? 'RİSKLİ' : 'KRİTİK'}
                </div>
              </div>

              <div className="space-y-4">
                <div style={{ background: "var(--vk-bg-input)", border: "1px solid var(--vk-border)", padding: "20px", borderRadius: "8px" }}>
                  <label style={{...labelStyle, marginBottom: "16px"}}>// TESPİT EDİLEN RİSKLER</label>
                  <div className="space-y-3">
                    {formData.atRiskPlatforms.length > 0 ? formData.atRiskPlatforms.map(pName => {
                      const breach = KNOWN_BREACHES.find(b => b.name === pName);
                      return (
                        <div key={pName} style={{ padding: "12px", background: "#ef44440a", border: "1px solid #ef444433", borderRadius: "8px" }}>
                          <div className="flex justify-between items-center mb-2">
                            <span style={{ color: "#ef4444", fontWeight: "bold", fontSize: "13px" }}>{pName} ({breach?.year})</span>
                            <span style={{ fontSize: "10px", color: "#ef4444aa" }}>SIZINTI</span>
                          </div>
                          <div style={{ color: "var(--vk-text-muted)", fontSize: "11px" }}>{breach?.dataClasses.join(', ')}</div>
                        </div>
                      );
                    }) : (
                      <div className="text-center py-4" style={{ color: "var(--vk-primary)", fontSize: "12px", border: "1px dashed rgba(var(--vk-primary-rgb), 0.3)", borderRadius: "8px" }}>
                        Mükemmel! Seçtiğin platformlarda bilinen bir sızıntı yok.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button onClick={handleFinish} style={{...primaryButtonStyle, width: "100%", padding: "20px"}}>
                DASHBOARD'A GİT →
              </button>
            </div>
          )}
        </div>

        <p style={{ textAlign: "center", color: "var(--vk-text-muted)", fontSize: "11px", letterSpacing: "1px" }}>
          🛡️ Verileriniz yerel cihazınızda saklanır.
        </p>
      </div>
      {toastBadge && <GamificationToast badge={toastBadge} onClose={() => setToastBadge(null)} />}
    </DarkLayout>
  );
}
