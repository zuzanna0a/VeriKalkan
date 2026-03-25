export function calculateDigitalHealthScore(breachCount: number) {
  // Breach count comes from HIBP v3 "breachedaccount" endpoint.
  if (breachCount <= 0) return 85;
  if (breachCount <= 2) return 65;
  if (breachCount <= 5) return 40;
  return 20;
}

export type ScoreSeverity = "low" | "medium" | "high";

export function getScoreSeverity(score: number): ScoreSeverity {
  // Higher score => better / lower risk.
  if (score >= 70) return "low";
  if (score >= 35) return "medium";
  return "high";
}

export function getScoreMeta(score: number) {
  const severity = getScoreSeverity(score);

  switch (severity) {
    case "low":
      return {
        colorClass: "text-green-700",
        ringClass: "ring-green-200/80",
        label: "Düşük risk",
        description:
          "Sızıntı tespit edilmedi ya da çok sınırlı. Hesap güvenliğini güncel tut.",
      };
    case "medium":
      return {
        colorClass: "text-yellow-600",
        ringClass: "ring-yellow-200/80",
        label: "Orta risk",
        description:
          "Bir-iki sızıntı ihtimali görünüyor. Şifreyi ve 2 adımlı doğrulamayı kontrol et.",
      };
    case "high":
    default:
      return {
        colorClass: "text-red-600",
        ringClass: "ring-red-200/80",
        label: "Yüksek risk",
        description:
          "Birden fazla sızıntı tespit edilmiş görünüyor. Hızlı aksiyon al ve farklı şifreler kullan.",
      };
  }
}

