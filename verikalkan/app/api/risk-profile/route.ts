import { GoogleGenerativeAI } from "@google/generative-ai";

import type { OnboardingAnswers } from "@/features/onboarding/types";

export type RiskProfile = {
  highRiskPlatforms: string[];
  topActions: string[];
  estimatedPlatformCount: number;
  summary: string;
};

const FALLBACK_PROFILE: RiskProfile = {
  highRiskPlatforms: [],
  topActions: [
    "Kullandığın kritik hesaplarda (e-posta, banka, e-ticaret) 2 adımlı doğrulamayı (2FA) aç.",
    "Aynı şifreyi tekrar kullanma; parola yöneticisi + güçlü, benzersiz şifreye geç.",
    "Hesap gizlilik/izin ayarlarını gözden geçir; gereksiz uygulama erişimlerini kaldır.",
  ],
  estimatedPlatformCount: 0,
  summary:
    "Risk profilini şu an otomatik oluşturamadım. Yine de yukarıdaki 3 adım, çoğu kullanıcı için en hızlı risk azaltma başlangıcıdır.",
};

function isOnboardingAnswers(x: unknown): x is OnboardingAnswers {
  if (!x || typeof x !== "object") return false;
  const a = x as any;
  return (
    Array.isArray(a.ecommercePlatforms) &&
    Array.isArray(a.socialAccounts) &&
    Array.isArray(a.fintechApps) &&
    (a.internetYears === null || typeof a.internetYears === "string") &&
    (a.deletionRequestLastYear === null ||
      a.deletionRequestLastYear === "Evet" ||
      a.deletionRequestLastYear === "Hayır")
  );
}

function stripCodeFences(text: string) {
  const t = text.trim();
  if (t.startsWith("```")) {
    const withoutStart = t.replace(/^```[a-zA-Z]*\s*/, "");
    return withoutStart.replace(/\s*```$/, "").trim();
  }
  return t;
}

function normalizeRiskProfile(x: any): RiskProfile | null {
  if (!x || typeof x !== "object") return null;

  const highRiskPlatforms = Array.isArray(x.highRiskPlatforms)
    ? x.highRiskPlatforms.map((v: unknown) => String(v)).filter(Boolean)
    : null;
  const topActions = Array.isArray(x.topActions)
    ? x.topActions.map((v: unknown) => String(v)).filter(Boolean)
    : null;
  const estimatedPlatformCount =
    typeof x.estimatedPlatformCount === "number" && Number.isFinite(x.estimatedPlatformCount)
      ? Math.max(0, Math.round(x.estimatedPlatformCount))
      : null;
  const summary = typeof x.summary === "string" ? x.summary.trim() : null;

  if (!highRiskPlatforms || !topActions || estimatedPlatformCount === null || summary === null) {
    return null;
  }

  return {
    highRiskPlatforms: highRiskPlatforms.slice(0, 12),
    topActions: topActions.slice(0, 5),
    estimatedPlatformCount,
    summary,
  };
}

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  const body = (await req.json().catch(() => null)) as unknown;

  if (!isOnboardingAnswers(body)) {
    return Response.json(
      { error: "invalid_body", message: "Onboarding yanıtları geçersiz." },
      { status: 400 },
    );
  }

  if (!apiKey) {
    return Response.json({ ...FALLBACK_PROFILE, estimatedPlatformCount: 0 }, { status: 200 });
  }

  const systemInstruction = [
    "Sen bir kişisel veri güvenliği uzmanısın. Kullanıcının platform kullanım bilgilerine göre:",
    "1. Hangi platformlarda veri riski yüksek olduğunu belirt",
    "2. Hangi 3 aksiyon ile başlaması gerektiğini söyle",
    "3. Toplam kaç platformda aktif olduğunu tahmin et",
    'Yanıtı JSON formatında ver: { "highRiskPlatforms": [], "topActions": [], "estimatedPlatformCount": 0, "summary": "" }',
  ].join("\n");

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction,
    });

    const prompt = [
      "Onboarding yanıtları (JSON):",
      JSON.stringify(body),
      "",
      "Sadece geçerli JSON döndür. Açıklama veya markdown ekleme.",
    ].join("\n");

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const candidate = stripCodeFences(text);

    const parsed = JSON.parse(candidate);
    const normalized = normalizeRiskProfile(parsed);

    if (!normalized) {
      return Response.json(
        { ...FALLBACK_PROFILE, estimatedPlatformCount: 0 },
        { status: 200 },
      );
    }

    return Response.json(normalized, { status: 200 });
  } catch {
    return Response.json({ ...FALLBACK_PROFILE, estimatedPlatformCount: 0 }, { status: 200 });
  }
}

