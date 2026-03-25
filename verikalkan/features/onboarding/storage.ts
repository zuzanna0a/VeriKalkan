import { ONBOARDING_STORAGE_KEY, type OnboardingAnswers } from "./types";

export function loadOnboardingAnswers(): OnboardingAnswers | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as OnboardingAnswers;
  } catch {
    return null;
  }
}

export function saveOnboardingAnswers(answers: OnboardingAnswers) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(answers));
}

