"use client";

import * as React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { loadOnboardingAnswers } from "@/features/onboarding/storage";

export default function DashboardClient() {
  const [hasLoaded, setHasLoaded] = React.useState(false);
  const [answers, setAnswers] = React.useState<ReturnType<
    typeof loadOnboardingAnswers
  >>(null);

  React.useEffect(() => {
    setAnswers(loadOnboardingAnswers());
    setHasLoaded(true);
  }, []);

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
          <div className="space-y-4">
            <Row
              label="E-ticaret"
              value={answers.ecommercePlatforms.join(", ")}
            />
            <Row label="Sosyal medya" value={answers.socialAccounts.join(", ")} />
            <Row label="Fintech/banka" value={answers.fintechApps.join(", ")} />
            <Row label="İnternet süresi" value={answers.internetYears ?? "-"} />
            <Row
              label="Silme talebi (1 yıl)"
              value={answers.deletionRequestLastYear ?? "-"}
            />
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

