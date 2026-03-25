import { calculateDigitalHealthScore } from "@/features/score/score-calculator";
import type { HibpBreach } from "@/features/score/types";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { email?: unknown }
    | null;

  const email = typeof body?.email === "string" ? body.email.trim() : "";

  if (!emailRegex.test(email)) {
    return Response.json(
      { error: "invalid_email", message: "Geçerli bir e-posta gir." },
      { status: 400 },
    );
  }

  const hibpApiKey = process.env.HIBP_API_KEY;
  if (!hibpApiKey) {
    return Response.json(
      {
        error: "missing_api_key",
        message:
          "HIBP API anahtarı eksik. Lütfen `.env.local` içinde `HIBP_API_KEY` tanımlayın.",
      },
      { status: 500 },
    );
  }

  const hibpUrl = `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(
    email,
  )}`;

  const res = await fetch(hibpUrl, {
    method: "GET",
    headers: {
      "hibp-api-key": hibpApiKey,
      accept: "application/json",
    },
    cache: "no-store",
  });

  // 404 = "sızıntı yok"
  if (res.status === 404) {
    const breachCount = 0;
    const score = calculateDigitalHealthScore(breachCount);
    return Response.json({ breaches: [], breachCount, score }, { status: 200 });
  }

  // 429 = rate limit
  if (res.status === 429) {
    return Response.json(
      {
        error: "rate_limited",
        message:
          "HIBP istek sınırına ulaştı. Lütfen bir süre sonra tekrar deneyin.",
      },
      { status: 429 },
    );
  }

  if (!res.ok) {
    return Response.json(
      {
        error: "server_error",
        message: "HIBP’den veri alınamadı. Lütfen tekrar deneyin.",
      },
      { status: 500 },
    );
  }

  const raw = (await res.json()) as unknown;

  const mappedBreaches: HibpBreach[] = Array.isArray(raw)
    ? raw.map((b: any) => ({
        name: String(b?.Name ?? "Bilinmeyen sızıntı"),
        breachDate:
          typeof b?.BreachDate === "string" ? b.BreachDate : null,
        dataClasses: Array.isArray(b?.DataClasses)
          ? b.DataClasses.map((x: unknown) => String(x))
          : [],
      }))
    : [];

  const breachCount = mappedBreaches.length;
  const score = calculateDigitalHealthScore(breachCount);

  return Response.json(
    { breaches: mappedBreaches, breachCount, score },
    { status: 200 },
  );
}

