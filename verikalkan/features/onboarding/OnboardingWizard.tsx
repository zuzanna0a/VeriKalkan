"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import {
  loadOnboardingAnswers,
  saveOnboardingAnswers,
} from "./storage";
import type { OnboardingAnswers } from "./types";

const stepsTotal = 5;

const ecommerceOptions = [
  "Trendyol",
  "Hepsiburada",
  "Getir",
  "Yemeksepeti",
  "Sahibinden",
  "Amazon TR",
  "Diğer",
] as const;

const socialOptions = [
  "Instagram",
  "Twitter/X",
  "LinkedIn",
  "TikTok",
  "Facebook",
  "Yok",
] as const;

const fintechOptions = [
  "Papara",
  "Moneyou",
  "İninal",
  "Klasik banka",
  "Yok",
] as const;

const internetYearsOptions = [
  "1-3 yıl",
  "4-7 yıl",
  "8-12 yıl",
  "12+ yıl",
] as const;

function toggleMulti(
  prev: string[],
  value: string,
  opts?: { exclusiveValue?: string },
) {
  const exclusive = opts?.exclusiveValue;
  const has = prev.includes(value);

  if (exclusive && value === exclusive) {
    return has ? [] : [exclusive];
  }

  const next = has ? prev.filter((v) => v !== value) : [...prev, value];

  if (exclusive) return next.filter((v) => v !== exclusive);
  return next;
}

function canProceed(step: number, a: OnboardingAnswers) {
  if (step === 1) return a.ecommercePlatforms.length > 0;
  if (step === 2) return a.socialAccounts.length > 0;
  if (step === 3) return a.fintechApps.length > 0;
  if (step === 4) return a.internetYears !== null;
  if (step === 5) return a.deletionRequestLastYear !== null;
  return false;
}

export default function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const [answers, setAnswers] = React.useState<OnboardingAnswers>({
    ecommercePlatforms: [],
    socialAccounts: [],
    fintechApps: [],
    internetYears: null,
    deletionRequestLastYear: null,
  });

  React.useEffect(() => {
    const existing = loadOnboardingAnswers();
    if (existing) setAnswers(existing);
  }, []);

  function onNext() {
    setErrorMessage(null);
    if (!canProceed(step, answers)) {
      setErrorMessage("Devam etmek için bu soruyu yanıtla.");
      return;
    }
    setStep((s) => Math.min(stepsTotal, s + 1));
  }

  function onBack() {
    setErrorMessage(null);
    setStep((s) => Math.max(1, s - 1));
  }

  function onFinish() {
    setErrorMessage(null);
    if (!canProceed(step, answers)) {
      setErrorMessage("Devam etmek için bu soruyu yanıtla.");
      return;
    }
    saveOnboardingAnswers(answers);
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-10">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Onboarding
          </h1>
          <p className="mt-2 text-slate-600">
            30 saniyede risk profilini kişiselleştirelim.
          </p>
        </div>
        <div className="text-sm font-medium text-slate-600">
          Adım {step}/{stepsTotal}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {step === 1 ? (
          <StepMultiSelect
            title="Hangi e-ticaret platformlarını kullanıyorsun?"
            description="Birden fazla seçim yapabilirsin."
            options={[...ecommerceOptions]}
            value={answers.ecommercePlatforms}
            onChange={(next) =>
              setAnswers((a) => ({ ...a, ecommercePlatforms: next }))
            }
          />
        ) : null}

        {step === 2 ? (
          <StepMultiSelect
            title="Sosyal medya hesapların?"
            description="Birden fazla seçim yapabilirsin."
            options={[...socialOptions]}
            value={answers.socialAccounts}
            onChange={(next) => setAnswers((a) => ({ ...a, socialAccounts: next }))}
            exclusiveValue="Yok"
          />
        ) : null}

        {step === 3 ? (
          <StepMultiSelect
            title="Fintech/bankacılık uygulamaları?"
            description="Birden fazla seçim yapabilirsin."
            options={[...fintechOptions]}
            value={answers.fintechApps}
            onChange={(next) => setAnswers((a) => ({ ...a, fintechApps: next }))}
            exclusiveValue="Yok"
          />
        ) : null}

        {step === 4 ? (
          <StepSingleSelect
            title="Kaç yıldır aktif internet kullanıcısısın?"
            options={[...internetYearsOptions]}
            value={answers.internetYears}
            onChange={(next) =>
              setAnswers((a) => ({ ...a, internetYears: next }))
            }
          />
        ) : null}

        {step === 5 ? (
          <StepSingleSelect
            title="Son 1 yılda herhangi bir yerden veri silme talebinde bulundun mu?"
            options={["Evet", "Hayır"]}
            value={answers.deletionRequestLastYear}
            onChange={(next) =>
              setAnswers((a) => ({
                ...a,
                deletionRequestLastYear: next as "Evet" | "Hayır",
              }))
            }
          />
        ) : null}

        {errorMessage ? (
          <p className="mt-5 text-sm font-medium text-red-600">{errorMessage}</p>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={step === 1}
          >
            Geri
          </Button>

          {step < stepsTotal ? (
            <Button
              type="button"
              onClick={onNext}
              className="bg-[#1A56DB] text-white hover:bg-[#1A56DB]/90"
            >
              Devam Et
            </Button>
          ) : (
            <Button
              type="button"
              onClick={onFinish}
              className="bg-[#1A56DB] text-white hover:bg-[#1A56DB]/90"
            >
              Bitir ve Devam Et
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepMultiSelect(props: {
  title: string;
  description?: string;
  options: string[];
  value: string[];
  exclusiveValue?: string;
  onChange: (next: string[]) => void;
}) {
  const { title, description, options, value, onChange, exclusiveValue } = props;

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      {description ? (
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-3">
        {options.map((opt) => {
          const selected = value.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() =>
                onChange(toggleMulti(value, opt, { exclusiveValue }))
              }
              className={[
                "rounded-full border px-4 py-2 text-sm font-medium transition",
                selected
                  ? "border-[#1A56DB] bg-[#1A56DB] text-white"
                  : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
              ].join(" ")}
              aria-pressed={selected}
            >
              {opt}
            </button>
          );
        })}
      </div>

      <p className="mt-5 text-xs text-slate-500">
        Not: Yanıtların cihazında saklanır (localStorage).
      </p>
    </div>
  );
}

function StepSingleSelect<T extends string>(props: {
  title: string;
  options: readonly T[] | T[];
  value: T | null;
  onChange: (next: T) => void;
}) {
  const { title, options, value, onChange } = props;
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>

      <div className="mt-5 grid gap-3">
        {options.map((opt) => {
          const selected = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={[
                "flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium transition",
                selected
                  ? "border-[#1A56DB] bg-[#1A56DB] text-white"
                  : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
              ].join(" ")}
              aria-pressed={selected}
            >
              <span>{opt}</span>
              <span
                className={[
                  "h-4 w-4 rounded-full border",
                  selected ? "border-white bg-white" : "border-slate-300",
                ].join(" ")}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>

      <p className="mt-5 text-xs text-slate-500">
        Not: Yanıtların cihazında saklanır (localStorage).
      </p>
    </div>
  );
}

