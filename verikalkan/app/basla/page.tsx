"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, CheckCircle2, CheckCircle, AlertCircle, Trash2, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KNOWN_BREACHES } from "@/features/score/breach-database";
import { addPoints } from "@/features/gamification/useGamification";
import GamificationToast from "@/features/gamification/GamificationToast";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [subStep, setSubStep] = useState(1); // 1: Platforms, 2: Years, 3: Deletion
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    selectedPlatforms: [] as string[],
    customPlatforms: [] as string[],
    yearsOnline: "1-3 yıl", // default
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

  // Platforms for selection
  const platforms = [
    "Trendyol", "Hepsiburada", "Getir", "Yemeksepeti", "Sahibinden", "Amazon TR",
    "Instagram", "Twitter/X", "LinkedIn", "TikTok", "Facebook",
    "Papara", "Monese", "Ziraat Bankası" // Moneyou was Papara competitor? Replaced with common ones.
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
      setCustomBreachFeedback({
        match: true,
        name: match.name,
        year: match.year,
        dataClasses: match.dataClasses
      });
    } else {
      setCustomBreachFeedback({
        match: false,
        name: companyName
      });
    }
  };

  const handleAddCustom = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && customInput.trim()) {
      e.preventDefault();
      const val = customInput.trim();
      if (!formData.customPlatforms.includes(val)) {
        setFormData(prev => ({
          ...prev,
          customPlatforms: [...prev.customPlatforms, val]
        }));
        checkCustomBreach(val);
      }
      setCustomInput("");
    }
  };

  const removeCustom = (name: string) => {
    setFormData(prev => ({
      ...prev,
      customPlatforms: prev.customPlatforms.filter(p => p !== name)
    }));
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const calculateScore = () => {
    const allPlatforms = [...formData.selectedPlatforms, ...formData.customPlatforms];
    const matchedBreaches = KNOWN_BREACHES.filter(b => 
      allPlatforms.some(p => p.toLowerCase() === b.name.toLowerCase())
    );
    
    const atRisk = matchedBreaches.map(b => b.name);
    const atRiskCount = atRisk.length;
    
    let score = 90;
    if (atRiskCount === 1) score = 75;
    else if (atRiskCount <= 3 && atRiskCount > 1) score = 55;
    else if (atRiskCount <= 5 && atRiskCount > 3) score = 35;
    else if (atRiskCount > 5) score = 20;

    // Apply modifiers
    if (formData.yearsOnline === "12+ yıl") score -= 10;
    if (formData.hasRequestedDeletion) score += 10;

    // Normalize (0-100)
    score = Math.max(0, Math.min(100, score));

    setFormData(prev => ({
      ...prev,
      score,
      atRiskPlatforms: atRisk
    }));

    // Gamification +5 puan
    const { newBadges } = addPoints(5, "skor");
    if (newBadges.length > 0) setToastBadge(newBadges[0]);
  };

  const handleFinish = () => {
    const saveData = {
      ...formData,
      onboardingComplete: true,
      lastUpdate: new Date().toISOString()
    };
    localStorage.setItem("vk-user", JSON.stringify(saveData));
    localStorage.setItem("user-email", formData.email);

    // Gamification +10 puan
    const { newBadges } = addPoints(10, "onboarding");
    // Uyarı: Redirect hemen olacağı için buradaki toast görünmeyebilir, 
    // ancak puanlar kaydedilmiş olur. 
    // Alternatif olarak dashboard'da gösterilebilir ama prompt "step 4 redirect" diyor.
    
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
      if (subStep === 2) {
        setSubStep(3);
        return;
      }
      if (subStep === 3) {
        calculateScore();
        setStep(3);
        return;
      }
    }
    
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (step === 2) {
      if (subStep === 2) {
        setSubStep(1);
        return;
      }
      if (subStep === 3) {
        setSubStep(2);
        return;
      }
      setStep(1);
      return;
    }
    setStep(prev => prev - 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Progress bar */}
        <div className="h-1.5 w-full bg-slate-100 flex">
          {[1, 2, 3, 4].map(s => (
            <div 
              key={s} 
              className={`h-full flex-1 transition-all duration-500 ${s <= step ? 'bg-blue-600' : 'bg-transparent'}`}
            />
          ))}
        </div>

        <div className="p-8">
          {/* Header */}
          <div className="flex items-center gap-2 mb-8 justify-center">
            <ShieldCheck className="text-blue-600 h-6 w-6" />
            <span className="font-bold text-slate-900 tracking-tight">VeriKalkan Kurulum</span>
          </div>

          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900">Tanışalım 👋</h2>
                <p className="text-slate-500 mt-2">Dilekçelerini senin adına hazırlayabilmemiz için bu bilgiler gerekli.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ad</Label>
                  <Input 
                    value={formData.firstName} 
                    onChange={e => setFormData(p => ({...p, firstName: e.target.value}))}
                    placeholder="Ayşe"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Soyad</Label>
                  <Input 
                    value={formData.lastName}
                    onChange={e => setFormData(p => ({...p, lastName: e.target.value}))}
                    placeholder="Yılmaz"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>E-posta</Label>
                <Input 
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData(p => ({...p, email: e.target.value}))}
                  placeholder="ayse@örnek.com"
                  className={!isValidEmail ? "border-red-500" : ""}
                />
                {!isValidEmail && <p className="text-xs text-red-500">Geçerli bir e-posta adresi girin.</p>}
              </div>
              <Button onClick={nextStep} className="w-full bg-[#1A56DB] text-white py-6 text-lg rounded-xl">
                İleri →
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {subStep === 1 && (
                <>
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900">Platform Seçimi</h2>
                    <p className="text-slate-500 mt-2">Kullandığın platformları seç, risklerini analiz edelim.</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 max-h-[250px] overflow-y-auto p-1">
                    {platforms.map(p => {
                      const isSelected = formData.selectedPlatforms.includes(p);
                      return (
                        <button
                          key={p}
                          onClick={() => handleTogglePlatform(p)}
                          className={`p-3 text-sm font-medium border-2 rounded-xl transition-all text-left flex justify-between items-center ${
                            isSelected ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200'
                          }`}
                        >
                          {p}
                          {isSelected && <CheckCircle2 className="h-4 w-4" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-slate-500 uppercase tracking-wider">Listede olmayan var mı?</Label>
                    <div className="relative">
                      <Input 
                        value={customInput}
                        onChange={e => setCustomInput(e.target.value)}
                        onKeyDown={handleAddCustom}
                        placeholder="Şirket adı yazın ve Enter'a basın"
                        className="pr-10"
                      />
                      <Plus className="absolute right-3 top-2.5 h-5 w-5 text-slate-400" />
                    </div>
                    {customBreachFeedback && (
                      <div className={`mt-2 p-2 rounded-lg text-xs flex items-start gap-2 border ${
                        customBreachFeedback.match ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'
                      }`}>
                        {customBreachFeedback.match ? (
                          <>
                            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold">{customBreachFeedback.name}</span> için veri sızıntısı tespit edildi ({customBreachFeedback.year}).
                              <br />Çalınan veriler: {customBreachFeedback.dataClasses?.join(', ')}
                            </div>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                            <div><span className="font-bold">{customBreachFeedback.name}</span> için bilinen bir sızıntı kaydı bulunamadı.</div>
                          </>
                        )}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.customPlatforms.map(cp => (
                        <span key={cp} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs flex items-center gap-2 border border-slate-200 animate-in zoom-in-95">
                          {cp}
                          <button onClick={() => removeCustom(cp)}><Trash2 className="h-3 w-3 text-slate-400 hover:text-red-500" /></button>
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {subStep === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900">İnternet Deneyimi</h2>
                    <p className="text-slate-500 mt-2">Kaç yıldır aktif internet kullanıcısısın?</p>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {["1-3 yıl", "4-7 yıl", "8-12 yıl", "12+ yıl"].map(opt => (
                      <button
                        key={opt}
                        onClick={() => setFormData(p => ({...p, yearsOnline: opt}))}
                        className={`p-4 text-left rounded-2xl border-2 transition-all flex items-center justify-between ${
                          formData.yearsOnline === opt ? 'border-blue-600 bg-blue-50 text-blue-700 ring-4 ring-blue-100' : 'border-slate-100 hover:border-slate-200 bg-white'
                        }`}
                      >
                        <span className="font-bold">{opt}</span>
                        {formData.yearsOnline === opt && <CheckCircle2 className="h-5 w-5" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {subStep === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900">Veri Bilinci</h2>
                    <p className="text-slate-500 mt-2">Son 1 yılda herhangi bir yerden veri silme talebinde bulundun mu?</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <button
                      onClick={() => setFormData(p => ({...p, hasRequestedDeletion: true}))}
                      className={`p-6 text-center rounded-2xl border-2 transition-all group ${
                        formData.hasRequestedDeletion === true ? 'border-green-600 bg-green-50 text-green-700' : 'border-slate-100 hover:border-slate-200 bg-white'
                      }`}
                    >
                      <CheckCircle className={`h-8 w-8 mx-auto mb-2 ${formData.hasRequestedDeletion === true ? 'text-green-600' : 'text-slate-300 group-hover:text-slate-400'}`} />
                      <span className="font-bold text-lg">Evet, bulundum</span>
                    </button>
                    <button
                      onClick={() => setFormData(p => ({...p, hasRequestedDeletion: false}))}
                      className={`p-6 text-center rounded-2xl border-2 transition-all group ${
                        formData.hasRequestedDeletion === false ? 'border-slate-300 bg-slate-50 text-slate-600' : 'border-slate-100 hover:border-slate-200 bg-white'
                      }`}
                    >
                      <Trash2 className={`h-8 w-8 mx-auto mb-2 ${formData.hasRequestedDeletion === false ? 'text-slate-500' : 'text-slate-300 group-hover:text-slate-400'}`} />
                      <span className="font-bold">Hayır, bulunmadım</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button onClick={prevStep} variant="outline" className="flex-1 py-6">Geri</Button>
                <Button onClick={nextStep} className="flex-[2] bg-[#1A56DB] text-white py-6 text-lg rounded-xl">İleri →</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900">Dijital Sağlık Skorun</h2>
                <p className="text-slate-500 mt-2">Analiz tamamlandı, durumunuzu inceleyin.</p>
              </div>

              <div className="flex flex-col items-center">
                <div className={`text-7xl font-black mb-2 animate-in zoom-in duration-700 ${formData.score >= 70 ? 'text-green-500' : formData.score >= 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                  {formData.score}
                </div>
                <div className={`px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest ${
                  formData.score >= 70 ? 'bg-green-100 text-green-700' : formData.score >= 40 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }`}>
                  {formData.score >= 70 ? 'Güvenli' : formData.score >= 40 ? 'Riskli' : 'Kritik'}
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className={`h-5 w-5 ${formData.atRiskPlatforms.length > 0 ? 'text-red-500' : 'text-green-500'}`} />
                    <span className="text-sm font-bold">{formData.atRiskPlatforms.length} platformda sızıntı detayı:</span>
                  </div>
                  <div className="space-y-3">
                    {formData.atRiskPlatforms.length > 0 ? formData.atRiskPlatforms.map(pName => {
                      const breach = KNOWN_BREACHES.find(b => b.name === pName);
                      return (
                        <div key={pName} className="p-3 bg-white rounded-xl border border-red-100 text-xs shadow-sm">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-red-700">{pName} ({breach?.year})</span>
                            <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-full text-[10px] uppercase font-black">Sızıntı</span>
                          </div>
                          <div className="text-slate-600">
                            <span className="font-semibold">Çalınan veriler:</span> {breach?.dataClasses.join(', ')}
                          </div>
                        </div>
                      );
                    }) : (
                      <span className="text-xs text-slate-500 italic">Mükemmel! Seçtiğin platformlarda bilinen bir sızıntı yok.</span>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-400 uppercase tracking-widest mb-2 block">Analiz Özeti</span>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">İnternet Deneyimi:</span>
                      <span className="font-bold text-slate-700">{formData.yearsOnline}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Önceki Silme Talebi:</span>
                      <span className={`font-bold ${formData.hasRequestedDeletion ? 'text-green-600' : 'text-slate-700'}`}>
                        {formData.hasRequestedDeletion ? 'Evet (Bilinçli Kullanıcı)' : 'Hayır'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={handleFinish} className="w-full bg-[#1A56DB] text-white py-6 text-lg rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-200">
                Dashboard'uma Git <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          )}

        </div>
      </div>
      
      <p className="mt-8 text-slate-400 text-sm">🛡️ Verileriniz yerel cihazınızda saklanır, asla sunucularımıza gitmez.</p>
      {toastBadge && <GamificationToast badge={toastBadge} onClose={() => setToastBadge(null)} />}
    </div>
  );
}
