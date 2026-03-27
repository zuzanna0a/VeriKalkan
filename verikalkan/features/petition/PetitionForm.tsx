"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { COMPANIES, Company } from "./companies";
import { usePetitionContext } from "./PetitionContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Constants ────────────────────────────────────────────────────────────────

const RIGHT_TYPES: RightType[] = [
  "Verilerimi Sil (KVKK Md.7)",
  "Verilerim Hakkında Bilgi Ver (KVKK Md.11)",
  "Verilerimi Düzelt (KVKK Md.11)",
];

const STEPS = ["Şirket Seç", "Bilgilerini Gir", "Hak Türü"];

// ─── Helper ───────────────────────────────────────────────────────────────────

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((label, i) => {
        const stepNum = i + 1;
        const isCompleted = stepNum < current;
        const isCurrent = stepNum === current;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={[
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300",
                  isCompleted
                    ? "bg-[#1E3A5F] text-white"
                    : isCurrent
                    ? "bg-blue-600 text-white ring-4 ring-blue-200"
                    : "bg-slate-100 text-slate-400 border border-slate-200",
                ].join(" ")}
              >
                {isCompleted ? (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span
                className={[
                  "text-xs font-medium whitespace-nowrap",
                  isCurrent ? "text-blue-600" : "text-slate-400",
                ].join(" ")}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={[
                  "mb-5 h-0.5 w-16 mx-1 transition-all duration-300",
                  isCompleted ? "bg-[#1E3A5F]" : "bg-slate-200",
                ].join(" ")}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PetitionForm() {
  const router = useRouter();
  const { setFormData } = usePetitionContext();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );

  const [form, setForm] = useState<FormData>({
    companyName: "",
    dpoEmail: "",
    isOther: false,
    manualDpoEmail: "",
    firstName: "",
    lastName: "",
    email: "",
    tcLast4: "",
    rightType: "",
  });

  // ── Field helpers ──────────────────────────────────────────────────────────

  function setField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleCompanyChange(value: string) {
    if (value === "__other__") {
      setForm((prev) => ({
        ...prev,
        companyName: "Diğer",
        dpoEmail: "",
        isOther: true,
        manualDpoEmail: "",
      }));
    } else {
      const found = COMPANIES.find((c: Company) => c.name === value);
      setForm((prev) => ({
        ...prev,
        companyName: value,
        dpoEmail: found?.dpoEmail ?? "",
        isOther: false,
        manualDpoEmail: "",
      }));
    }
    setErrors((prev) => ({
      ...prev,
      companyName: undefined,
      manualDpoEmail: undefined,
    }));
  }

  // ── Validation ─────────────────────────────────────────────────────────────

  function validateStep1(): boolean {
    const errs: typeof errors = {};
    if (!form.companyName) errs.companyName = "Lütfen bir şirket seçin.";
    if (form.isOther && !form.manualDpoEmail)
      errs.manualDpoEmail = "DPO e-posta adresi gereklidir.";
    if (form.isOther && form.manualDpoEmail && !isValidEmail(form.manualDpoEmail))
      errs.manualDpoEmail = "Geçerli bir e-posta adresi girin.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function validateStep2(): boolean {
    const errs: typeof errors = {};
    if (!form.firstName.trim()) errs.firstName = "Ad gereklidir.";
    if (!form.lastName.trim()) errs.lastName = "Soyad gereklidir.";
    if (!form.email.trim()) errs.email = "E-posta gereklidir.";
    else if (!isValidEmail(form.email)) errs.email = "Geçerli bir e-posta adresi girin.";
    if (form.tcLast4 && !/^\d{4}$/.test(form.tcLast4))
      errs.tcLast4 = "Son 4 hane rakamlardan oluşmalıdır.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function validateStep3(): boolean {
    const errs: typeof errors = {};
    if (!form.rightType) errs.rightType = "Lütfen bir hak türü seçin.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  function handleNext() {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((s) => s + 1);
  }

  function handleBack() {
    setStep((s) => s - 1);
    setErrors({});
  }

  function handleSubmit() {
    if (!validateStep3()) return;

    const payload = {
      companyName: form.companyName,
      dpoEmail: form.isOther ? form.manualDpoEmail : form.dpoEmail,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      tcLast4: form.tcLast4,
      rightType: form.rightType,
    };

    setFormData(payload);
    router.push("/dilekce/onizleme");
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-start justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-6 sm:p-8">
          <StepIndicator current={step} />

          {/* ── Step 1 ──────────────────────────────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Şirket Seç
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Dilekçenizi hangi şirkete göndermek istiyorsunuz?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-select">Şirket</Label>
                <Select
                  value={
                    form.isOther
                      ? "__other__"
                      : form.companyName || undefined
                  }
                  onValueChange={handleCompanyChange}
                >
                  <SelectTrigger
                    id="company-select"
                    className={errors.companyName ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Şirket seçin..." />
                  </SelectTrigger>
                  <SelectContent 
                    className="z-[100] bg-white shadow-md border border-slate-200"
                    position="popper"
                    side="bottom"
                    sideOffset={4}
                  >
                    {COMPANIES.map((c: Company) => (
                      <SelectItem key={c.name} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="__other__">Diğer</SelectItem>
                  </SelectContent>
                </Select>
                {errors.companyName && (
                  <p className="text-xs text-red-500">{errors.companyName}</p>
                )}
              </div>

              {/* Manual DPO email (only for "Diğer") */}
              {form.isOther && (
                <div className="space-y-2 rounded-lg bg-slate-50 p-4 border border-slate-200">
                  <Label htmlFor="manual-dpo">
                    Şirketin DPO / Veri Koruma Sorumlusu E-postası
                  </Label>
                  <Input
                    id="manual-dpo"
                    type="email"
                    placeholder="kvkk@sirket.com"
                    value={form.manualDpoEmail}
                    onChange={(e) =>
                      setField("manualDpoEmail", e.target.value)
                    }
                    className={errors.manualDpoEmail ? "border-red-500" : ""}
                  />
                  {errors.manualDpoEmail && (
                    <p className="text-xs text-red-500">
                      {errors.manualDpoEmail}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── Step 2 ──────────────────────────────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Bilgilerini Gir
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Dilekçeye eklenecek kişisel bilgileriniz.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Ad */}
                <div className="space-y-2">
                  <Label htmlFor="first-name">
                    Ad <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="first-name"
                    placeholder="Ayşe"
                    value={form.firstName}
                    onChange={(e) => setField("firstName", e.target.value)}
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-500">{errors.firstName}</p>
                  )}
                </div>

                {/* Soyad */}
                <div className="space-y-2">
                  <Label htmlFor="last-name">
                    Soyad <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="last-name"
                    placeholder="Yılmaz"
                    value={form.lastName}
                    onChange={(e) => setField("lastName", e.target.value)}
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-500">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* E-posta */}
              <div className="space-y-2">
                <Label htmlFor="user-email">
                  E-posta <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="user-email"
                  type="email"
                  placeholder="ayse@example.com"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* TC Kimlik No son 4 hane */}
              <div className="space-y-2">
                <Label htmlFor="tc-last4">
                  TC Kimlik No son 4 hane{" "}
                  <span className="text-slate-400 font-normal">
                    (isteğe bağlı)
                  </span>
                </Label>
                <Input
                  id="tc-last4"
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="1234"
                  value={form.tcLast4}
                  onChange={(e) =>
                    setField("tcLast4", e.target.value.replace(/\D/g, ""))
                  }
                  className={errors.tcLast4 ? "border-red-500" : ""}
                />
                {errors.tcLast4 && (
                  <p className="text-xs text-red-500">{errors.tcLast4}</p>
                )}
                <p className="text-xs text-slate-400">
                  Kimlik doğrulama için eklenir, güvenli şekilde işlenir.
                </p>
              </div>
            </div>
          )}

          {/* ── Step 3 ──────────────────────────────────────────────────────── */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Hak Türünü Seç
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  KVKK kapsamında hangi hakkınızı kullanmak istiyorsunuz?
                </p>
              </div>

              <div className="space-y-3">
                {RIGHT_TYPES.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="rightType"
                      value={option}
                      checked={form.rightType === option}
                      onChange={(e) =>
                        setField("rightType", e.target.value as RightType)
                      }
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>

              {errors.rightType && (
                <p className="text-xs text-red-500">{errors.rightType}</p>
              )}

              {/* Summary card */}
              {form.companyName && (
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-1 text-sm">
                  <p className="font-semibold text-slate-700 mb-2">
                    Dilekçe Özeti
                  </p>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Şirket</span>
                    <span className="font-medium text-slate-800">
                      {form.companyName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ad Soyad</span>
                    <span className="font-medium text-slate-800">
                      {form.firstName} {form.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">E-posta</span>
                    <span className="font-medium text-slate-800 truncate max-w-[180px]">
                      {form.email}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Footer buttons ───────────────────────────────────────────────── */}
          <div className="mt-8 flex items-center justify-between gap-3">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="flex-1"
              >
                ← Geri
              </Button>
            ) : (
              <div className="flex-1" />
            )}

            {step < 3 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="flex-1 bg-[#1E3A5F] hover:bg-[#16304f] text-white"
              >
                İleri →
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                Dilekçeyi Oluştur
              </Button>
            )}
          </div>
        </div>

        {/* Legal note */}
        <p className="mt-4 text-center text-xs text-slate-400">
          Bu dilekçe, 6698 sayılı KVKK kapsamında kişisel veri haklarınızı
          kullanmanız için oluşturulacaktır.
        </p>
      </div>
    </div>
  );
}
