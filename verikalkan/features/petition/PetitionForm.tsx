"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { COMPANIES, Company } from "./companies";
import { usePetitionContext } from "./PetitionContext";
import { CheckCircle2 } from "lucide-react";

type RightType =
  | "Verilerimi Sil (KVKK Md.7)"
  | "Verilerim Hakkında Bilgi Ver (KVKK Md.11)"
  | "Verilerimi Düzelt (KVKK Md.11)";

interface FormData {
  companyName: string;
  dpoEmail: string;
  isOther: boolean;
  manualDpoEmail: string;
  firstName: string;
  lastName: string;
  email: string;
  tcLast4: string;
  rightType: RightType | "";
}

const RIGHT_TYPES: RightType[] = [
  "Verilerimi Sil (KVKK Md.7)",
  "Verilerim Hakkında Bilgi Ver (KVKK Md.11)",
  "Verilerimi Düzelt (KVKK Md.11)",
];

const STEPS = ["Şirket Seç", "Bilgilerini Gir", "Hak Türü"];

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      {STEPS.map((label, i) => {
        const stepNum = i + 1;
        const isCompleted = stepNum < current;
        const isCurrent = stepNum === current;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: "bold",
                  fontFamily: "monospace",
                  background: isCompleted || isCurrent ? "var(--vk-primary)" : "var(--vk-bg-input)",
                  color: isCompleted || isCurrent ? "var(--vk-bg)" : "var(--vk-text-muted)",
                  transition: "all 0.3s"
                }}
              >
                {isCompleted ? "✓" : stepNum}
              </div>
              <span style={{ fontSize: "9px", fontFamily: "monospace", color: isCurrent ? "var(--vk-primary)" : "var(--vk-text-muted)", letterSpacing: "1px", textTransform: "uppercase" }}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ width: "40px", height: "1px", background: isCompleted ? "rgba(var(--vk-primary-rgb), 0.3)" : "var(--vk-border)", margin: "0 8px 18px" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function PetitionForm() {
  const router = useRouter();
  const { setFormData } = usePetitionContext();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [form, setForm] = useState<FormData>({
    companyName: "", dpoEmail: "", isOther: false, manualDpoEmail: "",
    firstName: "", lastName: "", email: "", tcLast4: "", rightType: "",
  });

  const searchParams = useSearchParams();

  useEffect(() => {
    const rawUser = localStorage.getItem("vk-user");
    if (rawUser) {
      try {
        const userData = JSON.parse(rawUser);
        setForm(prev => ({ ...prev, firstName: userData.firstName || prev.firstName, lastName: userData.lastName || prev.lastName, email: userData.email || prev.email }));
      } catch {}
    }

    const companyParam = searchParams.get("company");
    if (companyParam) {
      const found = COMPANIES.find((c: Company) => c.name.toLowerCase() === companyParam.toLowerCase());
      if (found) {
        setForm(prev => ({ ...prev, companyName: found.name, dpoEmail: found.dpoEmail, isOther: false }));
      } else {
        setForm(prev => ({ ...prev, companyName: companyParam, isOther: true, manualDpoEmail: "" }));
      }
    }
  }, [searchParams]);

  function setField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleCompanyChange(value: string) {
    if (value === "__other__") {
      setForm((prev) => ({ ...prev, companyName: "Diğer", dpoEmail: "", isOther: true, manualDpoEmail: "" }));
    } else {
      const found = COMPANIES.find((c: Company) => c.name === value);
      setForm((prev) => ({ ...prev, companyName: value, dpoEmail: found?.dpoEmail ?? "", isOther: false, manualDpoEmail: "" }));
    }
    setErrors((prev) => ({ ...prev, companyName: undefined, manualDpoEmail: undefined }));
  }

  const labelStyle = { color: "var(--vk-text-muted)", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase" as const, fontFamily: "monospace", marginBottom: "8px", display: "block" };
  const inputStyle = { width: "100%", background: "var(--vk-bg-input)", border: "1px solid var(--vk-border)", borderRadius: "8px", padding: "12px 16px", color: "var(--vk-text)", fontFamily: "monospace", outline: "none" };
  const cardStyle = { background: "var(--vk-bg-card)", border: "1px solid var(--vk-border)", borderRadius: "12px", padding: "24px" };
  const primaryButtonStyle = { background: "var(--vk-primary)", color: "var(--vk-bg)", fontFamily: "monospace", fontWeight: "bold", fontSize: "12px", letterSpacing: "2px", padding: "14px 24px", border: "none", borderRadius: "6px", cursor: "pointer" };
  const secondaryButtonStyle = { background: "transparent", border: "1px solid var(--vk-border)", color: "var(--vk-text-muted)", fontFamily: "monospace", fontSize: "12px", letterSpacing: "1px", padding: "14px 24px", borderRadius: "6px", cursor: "pointer" };

  return (
    <div className="max-w-lg mx-auto w-full">
      <div style={cardStyle}>
        <StepIndicator current={step} />

        {step === 1 && (
          <div className="space-y-6">
            <label style={labelStyle}>// ŞİRKET SEÇİMİ</label>
            <div className="space-y-4">
              <select 
                style={inputStyle}
                value={form.isOther ? "__other__" : form.companyName}
                onChange={(e) => handleCompanyChange(e.target.value)}
              >
                <option value="" disabled>Şirket seçin...</option>
                {COMPANIES.map((c: Company) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
                <option value="__other__">Diğer</option>
              </select>
              
              {form.isOther && (
                <div style={{ background: "var(--vk-bg-input)", padding: "16px", borderRadius: "8px", border: "1px solid var(--vk-border)" }}>
                  <label style={labelStyle}>// DPO E-POSTA</label>
                  <input 
                    style={inputStyle} 
                    type="email" 
                    placeholder="kvkk@sirket.com" 
                    value={form.manualDpoEmail} 
                    onChange={(e) => setField("manualDpoEmail", e.target.value)} 
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <label style={labelStyle}>// KİŞİSEL BİLGİLER</label>
            <div className="grid grid-cols-2 gap-4">
              <input style={inputStyle} placeholder="AD" value={form.firstName} onChange={(e) => setField("firstName", e.target.value)} />
              <input style={inputStyle} placeholder="SOYAD" value={form.lastName} onChange={(e) => setField("lastName", e.target.value)} />
            </div>
            <input style={inputStyle} type="email" placeholder="E-POSTA" value={form.email} onChange={(e) => setField("email", e.target.value)} />
            <div className="space-y-1">
              <label style={{...labelStyle, fontSize: "9px", marginBottom: "4px"}}>// TC NO SON 4 (İSTEĞE BAĞLI)</label>
              <input style={inputStyle} type="text" maxLength={4} placeholder="1234" value={form.tcLast4} onChange={(e) => setField("tcLast4", e.target.value.replace(/\D/g, ""))} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <label style={labelStyle}>// HAK TÜRÜ</label>
            <div className="space-y-2">
              {RIGHT_TYPES.map((option) => (
                <button
                  key={option}
                  onClick={() => setField("rightType", option)}
                  style={{
                    width: "100%", padding: "14px", textAlign: "left", borderRadius: "8px", fontFamily: "monospace", fontSize: "12px",
                    border: `1px solid ${form.rightType === option ? "var(--vk-primary)" : "var(--vk-border)"}`,
                    background: form.rightType === option ? "rgba(var(--vk-primary-rgb), 0.1)" : "var(--vk-bg-input)",
                    color: form.rightType === option ? "var(--vk-primary)" : "var(--vk-text-muted)",
                    transition: "all 0.2s"
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-10">
          {step > 1 && <button onClick={() => setStep(s => s - 1)} style={{...secondaryButtonStyle, flex: 1}}>GERİ</button>}
          {step < 3 ? (
            <button onClick={() => {
              if (step === 1 && (!form.companyName || (form.isOther && !isValidEmail(form.manualDpoEmail)))) return;
              if (step === 2 && (!form.firstName || !form.lastName || !isValidEmail(form.email))) return;
              setStep(s => s + 1);
            }} style={{...primaryButtonStyle, flex: 2}}>İLERİ →</button>
          ) : (
            <button onClick={() => {
              if (!form.rightType) return;
              const payload = { companyName: form.companyName, dpoEmail: form.isOther ? form.manualDpoEmail : form.dpoEmail, firstName: form.firstName, lastName: form.lastName, email: form.email, tcLast4: form.tcLast4, rightType: form.rightType };
              setFormData(payload);
              router.push("/dilekce/onizleme");
            }} style={{...primaryButtonStyle, flex: 2}}>DİLEKÇEYİ OLUŞTUR</button>
          )}
        </div>
      </div>
    </div>
  );
}
