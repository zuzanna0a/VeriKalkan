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

  const hibpUrl = `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(
    email,
  )}?truncateResponse=false`;

  try {
    const res = await fetch(hibpUrl, {
      method: "GET",
      headers: {
        "User-Agent": "VeriKalkan-App",
        accept: "application/json",
      },
      cache: "no-store",
    });

    if (res.status === 404) {
      const breachCount = 0;
      const score = calculateDigitalHealthScore(breachCount);
      return Response.json({ breaches: [], breachCount, score }, { status: 200 });
    }

    if (res.status === 429) {
      return Response.json(
        { error: "rate_limited", message: "Çok fazla istek gönderildi, lütfen bekleyin" },
        { status: 429 },
      );
    }

    if (res.status === 500) {
      return Response.json(
        { error: "service_unavailable", message: "Servis şu an kullanılamıyor" },
        { status: 500 },
      );
    }

    if (!res.ok) {
      // Keep behavior resilient: treat unknown errors as service unavailable.
      return Response.json(
        { error: "server_error", message: "Servis şu an kullanılamıyor" },
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
  } catch {
    return Response.json(
      { error: "service_unavailable", message: "Servis şu an kullanılamıyor" },
      { status: 500 },
    );
  }
}

