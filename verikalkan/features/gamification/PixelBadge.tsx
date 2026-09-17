export default function PixelBadge({ badgeId, unlocked, size = 48 }: { badgeId: string, unlocked: boolean, size?: number }) {
  const badges: Record<string, { label: string, icon: string }> = {
    dedektif: { label: "Dijital Dedektif", icon: "🔍" },
    kalkan: { label: "Veri Kalkanı", icon: "🛡️" },
    savasci: { label: "KVKK Savaşçısı", icon: "⚔️" },
    usta: { label: "Veri Ustası", icon: "🏆" },
  };
  const badge = badges[badgeId] || { label: badgeId, icon: "⭐" };
  return (
    <div style={{ opacity: unlocked ? 1 : 0.3, textAlign: "center" }}>
      <div style={{ fontSize: size * 0.6 }}>{badge.icon}</div>
      <div style={{ fontSize: "10px", fontFamily: "monospace" }}>{badge.label}</div>
    </div>
  );
}
