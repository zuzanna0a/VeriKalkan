"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { loadOnboardingAnswers } from "@/features/onboarding/storage";
import type { OnboardingAnswers } from "@/features/onboarding/types";

type RiskProfile = {
  highRiskPlatforms: string[];
  topActions: string[];
  estimatedPlatformCount: number;
  summary: string;
};

const FALLBACK_RISK_TEXT =
  "Risk profilini şu an otomatik oluşturamadım. Yine de 2FA açmak, benzersiz güçlü şifreler kullanmak ve gereksiz uygulama izinlerini kaldırmak en hızlı başlangıçtır.";

export default function DashboardClient() {
  const router = useRouter();
  const [hasLoaded, setHasLoaded] = React.useState(false);
  const [answers, setAnswers] = React.useState<ReturnType<
    typeof loadOnboardingAnswers
  >>(null);

  const [riskLoading, setRiskLoading] = React.useState(false);
  const [riskProfile, setRiskProfile] = React.useState<RiskProfile | null>(null);
  const [riskFallbackMessage, setRiskFallbackMessage] = React.useState<
    string | null
  >(null);

  React.useEffect(() => {
    const loaded = loadOnboardingAnswers();
    if (!loaded) {
      // localStorage boşsa onboarding'e yönlendir
      router.replace("/onboarding");
      return;
    }
    setAnswers(loaded);
    setHasLoaded(true);
  }, [router]);

  React.useEffect(() => {
    if (!hasLoaded || !answers) return;

    let cancelled = false;
    const controller = new AbortController();

    async function run(a: OnboardingAnswers) {
      setRiskLoading(true);
      setRiskFallbackMessage(null);
      try {
        console.log("İstek gönderiliyor...", a);
        const res = await fetch("/api/risk-profile", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(a),
          signal: controller.signal,
        });

        const data = (await res.json().catch(() => null)) as unknown;
        const ok =
          !!data &&
          typeof data === "object" &&
          Array.isArray((data as any).highRiskPlatforms) &&
          Array.isArray((data as any).topActions) &&
          typeof (data as any).estimatedPlatformCount === "number" &&
          typeof (data as any).summary === "string";

        if (!cancelled) {
          if (ok) setRiskProfile(data as RiskProfile);
          else setRiskFallbackMessage(FALLBACK_RISK_TEXT);
        }
      } catch {
        if (!cancelled) setRiskFallbackMessage(FALLBACK_RISK_TEXT);
      } finally {
        if (!cancelled) setRiskLoading(false);
      }
    }

    run(answers as OnboardingAnswers);

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [answers, hasLoaded]);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-10">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
        Dashboard
      </h1>
      <p className="mt-2 text-slate-600">
        Onboarding yanıtların burada saklanır. Sonraki adımda risk profili
        üretilecek.
      </p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {!hasLoaded ? (
          <p className="text-sm text-slate-600">Yükleniyor...</p>
        ) : answers ? (
          <div className="space-y-8">
            <div className="space-y-4">
              <Row
                label="E-ticaret"
                value={answers.ecommercePlatforms.join(", ")}
              />
              <Row
                label="Sosyal medya"
                value={answers.socialAccounts.join(", ")}
              />
              <Row label="Fintech/banka" value={answers.fintechApps.join(", ")} />
              <Row label="İnternet süresi" value={answers.internetYears ?? "-"} />
              <Row
                label="Silme talebi (1 yıl)"
                value={answers.deletionRequestLastYear ?? "-"}
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <div className="text-sm font-semibold text-slate-900">
                  AI Risk Profili
                </div>
                <div className="text-xs text-slate-600">
                  {riskLoading ? "Üretiliyor..." : "Hazır"}
                </div>
              </div>

              {riskLoading ? (
                <p className="mt-3 text-sm text-slate-700">
                  Yanıtların analiz ediliyor...
                </p>
              ) : riskProfile ? (
                <div className="mt-4 space-y-4">
                  <div className="text-sm text-slate-800">
                    {riskProfile.summary}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Yüksek riskli platformlar
                      </div>
                      {riskProfile.highRiskPlatforms.length ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {riskProfile.highRiskPlatforms.map((p) => (
                            <span
                              key={p}
                              className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-800 ring-1 ring-slate-200"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-2 text-sm text-slate-700">
                          Belirgin bir yüksek risk platformu çıkmadı.
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Tahmini aktif platform sayısı
                      </div>
                      <div className="mt-2 text-2xl font-extrabold text-slate-900">
                        {riskProfile.estimatedPlatformCount}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                      İlk 3 aksiyon
                    </div>
                    <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-slate-800">
                      {riskProfile.topActions.slice(0, 3).map((a, idx) => (
                        <li key={`${idx}-${a}`}>{a}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-700">
                  {riskFallbackMessage ?? FALLBACK_RISK_TEXT}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              Henüz onboarding tamamlanmadı.
            </p>
            <Button
              asChild
              className="bg-[#1A56DB] text-white hover:bg-[#1A56DB]/90"
            >
              <Link href="/onboarding">Onboarding’i Başlat</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function Row(props: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
      <div className="text-sm font-semibold text-slate-900">{props.label}</div>
      <div className="text-sm text-slate-700">{props.value}</div>
    </div>
  );
}

