"use client";

import { getScoreMeta } from "./score-calculator";

export function ScoreCard({
  score,
  breachCount,
}: {
  score: number;
  breachCount: number;
}) {
  const meta = getScoreMeta(score);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-sm font-medium text-slate-600">
            Dijital Sağlık Skoru
          </p>
          <h2 className={`mt-2 text-5xl font-extrabold tracking-tight ${meta.colorClass}`}>
            {score}
          </h2>
          <p className="mt-2 text-sm text-slate-600">{meta.description}</p>
        </div>

        <div
          className={`shrink-0 rounded-xl border px-4 py-3 text-right ${meta.ringClass} border-slate-200`}
        >
          <p className="text-xs font-medium text-slate-600">
            Tespit edilen sızıntı
          </p>
          <p className={`text-3xl font-extrabold ${meta.colorClass}`}>
            {breachCount}
          </p>
        </div>
      </div>
    </div>
  );
}

