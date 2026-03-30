"use client";

interface PixelBadgeProps {
  badgeId: "dedektif" | "kalkan" | "savasci" | "usta";
  unlocked: boolean;
  size?: number;
}

export default function PixelBadge({ badgeId, unlocked, size = 48 }: PixelBadgeProps) {
  const badges = {
    dedektif: {
      label: "Dijital Dedektif",
      threshold: 25,
      colors: { primary: "#00ff88", secondary: "#00cc66", dark: "#009944", glow: "#00ff8844" },
      pixels: [
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 0],
        [0, 1, 2, 0, 0, 2, 2, 0, 0, 2, 1, 0],
        [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
        [0, 1, 2, 2, 0, 2, 2, 0, 2, 2, 1, 0],
        [0, 1, 2, 2, 2, 0, 0, 2, 2, 2, 1, 0],
        [0, 0, 1, 1, 2, 2, 2, 2, 1, 1, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0],
      ]
    },
    kalkan: {
      label: "Veri Kalkanı",
      threshold: 75,
      colors: { primary: "#3b82f6", secondary: "#60a5fa", dark: "#1d4ed8", glow: "#3b82f644" },
      pixels: [
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
        [1, 2, 2, 3, 3, 3, 3, 3, 3, 2, 2, 1],
        [1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 1],
        [1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 1],
        [1, 2, 2, 3, 3, 3, 3, 3, 3, 2, 2, 1],
        [0, 1, 2, 2, 3, 3, 3, 3, 2, 2, 1, 0],
        [0, 0, 1, 2, 2, 3, 3, 2, 2, 1, 0, 0],
        [0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0],
        [0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
      ]
    },
    savasci: {
      label: "KVKK Savaşçısı",
      threshold: 150,
      colors: { primary: "#f59e0b", secondary: "#fcd34d", dark: "#b45309", glow: "#f59e0b44" },
      pixels: [
        [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0],
        [0, 0, 1, 2, 2, 3, 3, 2, 2, 1, 0, 0],
        [3, 1, 2, 2, 3, 3, 3, 3, 2, 2, 1, 3],
        [1, 2, 2, 3, 3, 3, 3, 3, 3, 2, 2, 1],
        [1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 1],
        [1, 2, 2, 3, 3, 3, 3, 3, 3, 2, 2, 1],
        [0, 1, 2, 2, 3, 3, 3, 3, 2, 2, 1, 0],
        [0, 0, 1, 2, 2, 3, 3, 2, 2, 1, 0, 0],
        [0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0],
        [0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0, 0],
      ]
    },
    usta: {
      label: "Veri Ustası",
      threshold: 250,
      colors: { primary: "#fcd34d", secondary: "#fde68a", dark: "#92400e", glow: "#fcd34d44" },
      pixels: [
        [0, 0, 0, 1, 1, 2, 2, 1, 1, 0, 0, 0],
        [0, 0, 1, 2, 2, 3, 3, 2, 2, 1, 0, 0],
        [0, 1, 2, 3, 3, 3, 3, 3, 3, 2, 1, 0],
        [0, 1, 2, 3, 3, 3, 3, 3, 3, 2, 1, 0],
        [1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 1],
        [1, 2, 2, 3, 3, 3, 3, 3, 3, 2, 2, 1],
        [1, 1, 2, 2, 3, 3, 3, 3, 2, 2, 1, 1],
        [0, 0, 1, 1, 1, 2, 2, 1, 1, 1, 0, 0],
        [0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0],
        [0, 0, 1, 1, 2, 2, 2, 2, 1, 1, 0, 0],
        [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
      ]
    }
  };

  const badge = badges[badgeId];
  const pixelSize = size / 12;

  const getColor = (val: number, colors: typeof badge.colors, unlocked: boolean) => {
    if (!unlocked) {
      return val === 0 ? "transparent" : "#1a2a3a";
    }
    if (val === 0) return "transparent";
    if (val === 1) return colors.dark;
    if (val === 2) return colors.primary;
    if (val === 3) return colors.secondary;
    return "transparent";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
      <div style={{
        position: "relative",
        filter: unlocked ? `drop-shadow(0 0 8px ${badge.colors.primary})` : "none",
        transition: "filter 0.3s ease"
      }}>
        <svg width={size} height={size * 11 / 12} viewBox={`0 0 ${12 * pixelSize} ${11 * pixelSize}`} style={{ imageRendering: "pixelated" }}>
          {badge.pixels.map((row, y) =>
            row.map((val, x) =>
              val !== 0 ? (
                <rect
                  key={`${x}-${y}`}
                  x={x * pixelSize}
                  y={y * pixelSize}
                  width={pixelSize}
                  height={pixelSize}
                  fill={getColor(val, badge.colors, unlocked)}
                />
              ) : null
            )
          )}
        </svg>
      </div>
      <div style={{
        fontFamily: "monospace",
        fontSize: "10px",
        color: unlocked ? badge.colors.primary : "#1e293b",
        letterSpacing: "1px",
        textAlign: "center",
        fontWeight: "bold"
      }}>
        {badge.label}
      </div>
      <div style={{
        fontFamily: "monospace",
        fontSize: "9px",
        color: unlocked ? "#475569" : "#1e293b",
        letterSpacing: "0.5px",
        display: "flex",
        alignItems: "center",
        gap: "4px"
      }}>
        {unlocked ? <><PixelIcon variant="check" size={10} color="#00ff88" /> KAZANILDI</> : `${badge.threshold} PUAN`}
      </div>
    </div>
  );
}

import PixelIcon from "@/features/ui/PixelIcon";
