export function calculateDigitalHealthScore(breachCount: number): number {
  if (breachCount <= 0) return 85;
  if (breachCount <= 2) return 65;
  if (breachCount <= 5) return 40;
  return 20;
}

export type ScoreSeverity = "low" | "medium" | "high";

export function getScoreSeverity(score: number): ScoreSeverity {
  if (score >= 70) return "low";
  if (score >= 35) return "medium";
  return "high";
}

export function getScoreMeta(score: number) {
  const severity = getScoreSeverity(score);
  switch (severity) {
    case "low":
      return { colorClass: "text-green-700", label: "Düşük risk", description: "Sızıntı tespit edilmedi." };
    case "medium":
      return { colorClass: "text-yellow-600", label: "Orta risk", description: "Birkaç sızıntı tespit edildi." };
    default:
      return { colorClass: "text-red-600", label: "Yüksek risk", description: "Birden fazla sızıntı tespit edildi." };
  }
}
