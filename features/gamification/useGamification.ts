"use client";

export const BADGES = [
  { id: "dedektif", label: "Dijital Dedektif", icon: "🔍", threshold: 25 },
  { id: "kalkan", label: "Veri Kalkanı", icon: "🛡️", threshold: 75 },
  { id: "savasci", label: "KVKK Savaşçısı", icon: "⚔️", threshold: 150 },
  { id: "usta", label: "Veri Ustası", icon: "🏆", threshold: 250 },
];

export interface GamificationState {
  score: number;
  badges: string[];
  actions: { action: string; date: string }[];
}

export function getGamification(): GamificationState {
  if (typeof window === "undefined") return { score: 0, badges: [], actions: [] };
  try {
    return JSON.parse(localStorage.getItem("vk-gamification") || '{"score":0,"badges":[],"actions":[]}');
  } catch {
    return { score: 0, badges: [], actions: [] };
  }
}

export function addPoints(points: number, action: string): { newBadges: typeof BADGES[0][] } {
  if (typeof window === "undefined") return { newBadges: [] };
  const state = getGamification();
  const oldScore = state.score;
  state.score += points;
  state.actions.push({ action, date: new Date().toISOString() });

  const newBadges = BADGES.filter(b =>
    oldScore < b.threshold && state.score >= b.threshold && !state.badges.includes(b.id)
  );
  newBadges.forEach(b => state.badges.push(b.id));

  localStorage.setItem("vk-gamification", JSON.stringify(state));
  return { newBadges };
}
