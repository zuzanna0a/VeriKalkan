"use client";

import type { HibpBreach } from "./types";

export function BreachedList({ breaches }: { breaches: HibpBreach[] }) {
  if (breaches.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">
          HIBP’e göre sızıntı bulunamadı.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {breaches.map((breach, idx) => (
        <div
          key={`${breach.name}-${idx}`}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                {breach.name}
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Tarih:{" "}
                <span className="font-medium">
                  {breach.breachDate ?? "Bilgi yok"}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-3">
            <p className="text-xs font-medium text-slate-600">
              Etkilenen veri türleri
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {breach.dataClasses.map((dc, dcIdx) => (
                <span
                  key={`${dc}-${dcIdx}`}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700"
                >
                  {dc}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

