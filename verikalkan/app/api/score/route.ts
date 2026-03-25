import { calculateDigitalHealthScore } from "@/features/score/score-calculator";
import type { HibpBreach } from "@/features/score/types";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomBreachName() {
  const a = [
    "Data",
    "Cloud",
    "Shop",
    "Social",
    "Media",
    "Pay",
    "Forum",
    "Drive",
    "Mail",
    "App",
  ];
  const b = [
    "Leak",
    "Breach",
    "Incident",
    "Compromise",
    "Exposure",
    "Dump",
    "Spill",
  ];
  return `${a[randomInt(0, a.length - 1)]}${b[randomInt(0, b.length - 1)]}-${randomInt(100, 999)}`;
}

function randomDataClasses(): string[] {
  const pool = [
    "Email addresses",
    "Passwords",
    "Names",
    "Phone numbers",
    "IP addresses",
    "Usernames",
    "Dates of birth",
    "Geographic locations",
  ];
  const count = randomInt(2, 5);
  const picked = new Set<string>();
  while (picked.size < count) {
    picked.add(pool[randomInt(0, pool.length - 1)]);
  }
  return Array.from(picked);
}

function randomDate(): string {
  const year = randomInt(2016, 2024);
  const month = String(randomInt(1, 12)).padStart(2, "0");
  const day = String(randomInt(1, 28)).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildRandomFallback() {
  const breachCount = randomInt(0, 6);
  const breaches: HibpBreach[] = Array.from({ length: breachCount }).map(() => ({
    name: randomBreachName(),
    breachDate: randomDate(),
    dataClasses: randomDataClasses(),
  }));

  const score = randomInt(0, 100);

  return {
    breaches,
    breachCount,
    score,
    isFallback: true as const,
  };
}

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
    return Response.json(buildRandomFallback(), { status: 200 });
  }

  // If API key exists, try real HIBP call (but still keep the page resilient).
  const hibpUrl = `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(
    email,
  )}`;

  try {
    const res = await fetch(hibpUrl, {
      method: "GET",
      headers: {
        "hibp-api-key": hibpApiKey,
        accept: "application/json",
      },
      cache: "no-store",
    });

    if (res.status === 404) {
      const breachCount = 0;
      const score = calculateDigitalHealthScore(breachCount);
      return Response.json(
        { breaches: [], breachCount, score, isFallback: false as const },
        { status: 200 },
      );
    }

    if (res.status === 429) {
      // If rate-limited, return random fallback so the UI still works.
      return Response.json(buildRandomFallback(), { status: 200 });
    }

    if (!res.ok) {
      return Response.json(buildRandomFallback(), { status: 200 });
    }

    const raw = (await res.json()) as unknown;

    const mappedBreaches: HibpBreach[] = Array.isArray(raw)
      ? raw.map((b: any) => ({
          name: String(b?.Name ?? "Bilinmeyen sızıntı"),
          breachDate: typeof b?.BreachDate === "string" ? b.BreachDate : null,
          dataClasses: Array.isArray(b?.DataClasses)
            ? b.DataClasses.map((x: unknown) => String(x))
            : [],
        }))
      : [];

    const breachCount = mappedBreaches.length;
    const score = calculateDigitalHealthScore(breachCount);

    return Response.json(
      { breaches: mappedBreaches, breachCount, score, isFallback: false as const },
      { status: 200 },
    );
  } catch {
    return Response.json(buildRandomFallback(), { status: 200 });
  }
}

