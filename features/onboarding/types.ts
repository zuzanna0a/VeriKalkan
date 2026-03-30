export type OnboardingAnswers = {
  ecommercePlatforms: string[];
  socialAccounts: string[];
  fintechApps: string[];
  internetYears: "1-3 yıl" | "4-7 yıl" | "8-12 yıl" | "12+ yıl" | null;
  deletionRequestLastYear: "Evet" | "Hayır" | null;
};

export const ONBOARDING_STORAGE_KEY = "verikalkan:onboarding:v1";

