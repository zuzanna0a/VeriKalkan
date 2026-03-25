"use client";

import * as React from "react";

import { BreachedList } from "./breached-list";
import { ScoreCard } from "./score-card";
import type { HibpBreach } from "./types";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ApiOkResponse = {
  breaches: HibpBreach[];
  breachCount: number;
  score: number;
};

type ApiErrorResponse = {
  error?: string;
  message?: string;
};

export default function SkorPageClient() {
  const [email, setEmail] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState<ApiOkResponse | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);
    setData(null);

    const trimmed = email.trim();
    if (!emailRegex.test(trimmed)) {
      setErrorMessage("Geçerli bir e-posta gir.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/hibp-breaches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: trimmed }),
      });

      const json = (await res.json().catch(() => ({}))) as
        | ApiOkResponse
        | ApiErrorResponse;

      if (!res.ok) {
        if (res.status === 429) {
          setErrorMessage(
            json?.message ??
              "HIBP istek sınırına ulaştı. Lütfen bir süre sonra tekrar deneyin.",
          );
          return;
        }

        setErrorMessage(
          (json as ApiErrorResponse)?.message ??
            "Bir hata oluştu. Lütfen tekrar deneyin.",
        );
        return;
      }

      const ok = json as ApiOkResponse;
      setData(ok);
    } catch {
      setErrorMessage("Bir hata oluştu. İnternet bağlantınızı kontrol edin.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-10">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
        Dijital Sağlık Skoru
      </h1>
      <p className="mt-2 text-slate-600">
        E-postanı gir, dijital riskini kısa sürede öğren.
      </p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              E-posta
            </label>
            <input
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              type="email"
              autoComplete="email"
              placeholder="ornek@eposta.com"
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1A56DB]/30"
            />
          </div>

          {errorMessage ? (
            <p className="text-sm font-medium text-red-600">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center rounded-md bg-[#1A56DB] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1A56DB]/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Skor hesaplanıyor..." : "Skorumu Öğren"}
          </button>
        </form>
      </div>

      {data ? (
        <div className="mt-8 space-y-6">
          <ScoreCard
            score={data.score}
            breachCount={data.breachCount}
          />

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Sızıntı detayları
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              HIBP kayıtlarına göre listelenmiştir.
            </p>

            <div className="mt-4">
              <BreachedList breaches={data.breaches} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

