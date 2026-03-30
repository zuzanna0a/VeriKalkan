/** Onboarding data shape written to localStorage by OnboardingWizard. */
export type OnboardingData = {
  internetYears: "1-3 yıl" | "4-7 yıl" | "8-12 yıl" | "12+ yıl" | null;
  [key: string]: unknown;
};

export const KNOWN_BREACHES = [
  // Global
  { name: "Adobe",        year: 2013, dataClasses: ["E-posta", "Şifre", "Kullanıcı adı"] },
  { name: "LinkedIn",     year: 2021, dataClasses: ["E-posta", "Telefon", "Konum"] },
  { name: "Twitter",      year: 2022, dataClasses: ["E-posta", "Telefon"] },
  { name: "Facebook",     year: 2021, dataClasses: ["E-posta", "Telefon", "Doğum tarihi", "Konum"] },
  { name: "Dropbox",      year: 2012, dataClasses: ["E-posta", "Şifre"] },
  { name: "MySpace",      year: 2016, dataClasses: ["E-posta", "Şifre", "Kullanıcı adı"] },
  { name: "Canva",        year: 2019, dataClasses: ["E-posta", "Ad Soyad", "Şifre"] },
  { name: "Twitch",       year: 2021, dataClasses: ["E-posta", "Şifre", "Ödeme bilgisi"] },
  { name: "Uber",         year: 2022, dataClasses: ["E-posta", "Telefon", "Konum"] },
  { name: "LastPass",     year: 2022, dataClasses: ["E-posta", "Şifre kasası"] },
  { name: "Duolingo",     year: 2023, dataClasses: ["E-posta", "Kullanıcı adı", "Dil bilgisi"] },
  { name: "23andMe",      year: 2023, dataClasses: ["E-posta", "Genetik veri", "Konum"] },
  { name: "Deezer",       year: 2022, dataClasses: ["E-posta", "Ad Soyad", "Doğum tarihi"] },
  // Türkiye
  { name: "Trendyol",       year: 2020, dataClasses: ["E-posta", "Telefon", "Adres"] },
  { name: "Hepsiburada",    year: 2021, dataClasses: ["E-posta", "Şifre", "Telefon"] },
  { name: "Yemeksepeti",    year: 2021, dataClasses: ["E-posta", "Telefon", "Adres", "Sipariş geçmişi"] },
  { name: "Getir",          year: 2022, dataClasses: ["E-posta", "Telefon", "Konum", "Ödeme bilgisi"] },
  { name: "Sahibinden",     year: 2022, dataClasses: ["E-posta", "Telefon", "İlan bilgisi"] },
  { name: "Pegasus",        year: 2023, dataClasses: ["E-posta", "Ad Soyad", "Pasaport no", "Uçuş bilgisi"] },
  { name: "THY (Thy Bonus)",year: 2023, dataClasses: ["E-posta", "Ad Soyad", "Mil bilgisi", "Telefon"] },
  { name: "Boyner",         year: 2022, dataClasses: ["E-posta", "Şifre", "Adres", "Ödeme bilgisi"] },
  { name: "BiTaksi",        year: 2021, dataClasses: ["E-posta", "Telefon", "Konum", "Seyahat geçmişi"] },
  { name: "GittiGidiyor",   year: 2020, dataClasses: ["E-posta", "Şifre", "Telefon", "Adres"] },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Deterministic seed: weighed by character position so that even a single
 * character difference (a@g.com vs b@g.com) produces a distinct seed.
 */
function emailSeed(email: string): number {
  let seed = 0;
  for (let i = 0; i < email.length; i++) {
    seed = (seed * 31 + email.charCodeAt(i) * (i + 1)) >>> 0;
  }
  return seed;
}

/** LCG Fisher-Yates shuffle — fully deterministic for a given seed. */
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  let s = seed;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Map the onboarding "internet years" answer to the earliest calendar year
 * the user could realistically have been online.
 * Reference point: current year 2026.
 */
function earliestOnlineYear(internetYears: OnboardingData["internetYears"]): number {
  const now = 2026;
  switch (internetYears) {
    case "1-3 yıl":  return now - 3;   // 2023
    case "4-7 yıl":  return now - 7;   // 2019
    case "8-12 yıl": return now - 12;  // 2014
    case "12+ yıl":  return now - 20;  // 2006
    default:          return 0;         // no data → no filtering
  }
}

/**
 * Returns true if the email looks like a realistic address.
 * Rejects: too short, or the local-part is made of a single repeated character.
 */
function isRealisticEmail(email: string): boolean {
  if (email.length < 6) return false;
  const local = email.split("@")[0] ?? "";
  if (local.length === 0) return false;
  // Reject "aaaaaa", "111111", etc.
  const allSame = local.split("").every((c) => c === local[0]);
  if (allSame && local.length >= 4) return false;
  return true;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function checkEmailBreaches(
  email: string,
  onboardingData?: OnboardingData | null,
) {
  // Guard: unrealistic email → no breaches
  if (!isRealisticEmail(email)) return [];

  const seed = emailSeed(email);
  const onlineFrom = earliestOnlineYear(onboardingData?.internetYears ?? null);

  // Filter: only keep breaches that happened after the user was first online
  let pool = KNOWN_BREACHES.filter((b) => {
    if (onlineFrom === 0) return true;         // no filter without data
    return b.year >= onlineFrom;
  });

  // Adobe special rule: only include for "older" emails, i.e. users who have
  // been online since at least 2013. Emails with seeds that look "fresh"
  // (seed modulo 3 === 0) also skip Adobe to add extra variance.
  pool = pool.filter((b) => {
    if (b.name !== "Adobe") return true;
    if (onlineFrom > 2013) return false;       // user wasn't online in 2013
    if (seed % 3 === 0) return false;          // probabilistic exclusion
    return true;
  });

  // 0–5 breaches, deterministically chosen from the filtered pool
  const breachCount = pool.length > 0 ? seed % Math.min(6, pool.length + 1) : 0;
  const shuffled = seededShuffle(pool, seed);

  return shuffled.slice(0, breachCount).map((b) => ({
    name: b.name,
    breachDate: `${b.year}-01-01`,
    dataClasses: b.dataClasses,
  }));
}
