"use client";
import { useEffect, useState } from "react";

interface PixelHourglassProps {
  daysLeft: number;
  totalDays?: number;
  compact?: boolean;
}

export default function PixelHourglass({ daysLeft, totalDays = 30, compact = false }: PixelHourglassProps) {
  const [sandFrame, setSandFrame] = useState(0);
  const progress = Math.min(100, ((totalDays - daysLeft) / totalDays) * 100);
  
  const color = daysLeft <= 3 ? "#ef4444" : daysLeft <= 10 ? "#f59e0b" : "#3b82f6";
  const sandColor = "#fcd34d";
  const sandDark = "#f59e0b";
  const frameColor = color;
  const frameDark = daysLeft <= 3 ? "#991b1b" : daysLeft <= 10 ? "#92400e" : "#1e3a8a";

  useEffect(() => {
    if (daysLeft === 0) return;
    const interval = setInterval(() => {
      setSandFrame(f => (f + 1) % 3);
    }, 400);
    return () => clearInterval(interval);
  }, [daysLeft]);

  const sandParticles = [
    { x: 9, y: 11 + sandFrame },
    { x: 10, y: 12 + ((sandFrame + 1) % 3) },
    { x: 9, y: 13 + ((sandFrame + 2) % 3) },
  ];

  const topSandHeight = Math.max(0, Math.round(7 * (1 - progress / 100)));
  const bottomSandHeight = Math.max(0, Math.round(7 * (progress / 100)));

  const size = compact ? 32 : 64;

  return (
    <div style={{ display: "flex", flexDirection: compact ? "row" : "column", alignItems: "center", gap: compact ? "12px" : "8px" }}>
      <svg
        width={size}
        height={size * 1.5}
        viewBox="0 0 20 30"
        style={{ imageRendering: "pixelated" }}
      >
        {/* Top frame */}
        <rect x="2" y="0" width="16" height="2" fill={frameColor} />
        <rect x="1" y="1" width="18" height="1" fill={color} opacity="0.6" />
        <rect x="2" y="2" width="2" height="1" fill={frameDark} />
        <rect x="16" y="2" width="2" height="1" fill={frameDark} />

        {/* Top glass */}
        <rect x="3" y="2" width="14" height="1" fill={color} opacity="0.2" />
        {Array.from({ length: topSandHeight }).map((_, i) => (
          <rect key={`ts-${i}`} x={3 + (i / 2)} y={3 + i} width={14 - i} height={1} fill={i === 0 ? sandColor : sandDark} opacity={0.9} />
        ))}

        {/* Neck */}
        <rect x="9" y="9" width="2" height="3" fill={frameDark} />
        <rect x="2" y="9" width="2" height="10" fill={color} opacity="0.15" />
        <rect x="16" y="9" width="2" height="10" fill={color} opacity="0.15" />

        {/* Sand particles falling */}
        {daysLeft > 0 && sandParticles.map((p, i) => (
          <rect key={`sp-${i}`} x={p.x} y={Math.min(p.y, 17)} width={1} height={1} fill={sandColor} opacity={0.8 - i * 0.2} />
        ))}

        {/* Bottom sand */}
        {Array.from({ length: bottomSandHeight }).map((_, i) => (
          <rect key={`bs-${i}`} x={3 + (3.5 - i / 2)} y={24 - i} width={14 - (7 - i)} height={1} fill={i === bottomSandHeight - 1 ? sandColor : sandDark} opacity={0.9} />
        ))}

        {/* Bottom frame */}
        <rect x="2" y="25" width="16" height="1" fill={color} opacity="0.3" />
        <rect x="2" y="26" width="16" height="1" fill={frameColor} />
        <rect x="1" y="27" width="18" height="1" fill={color} opacity="0.6" />
        <rect x="2" y="28" width="16" height="2" fill={frameColor} />

        {/* Shine */}
        <rect x="4" y="3" width="2" height="2" fill="white" opacity="0.15" />
      </svg>

      {compact ? (
        <div>
          <div style={{ color, fontFamily: "monospace", fontSize: "22px", fontWeight: "900", lineHeight: 1 }}>
            {daysLeft}
          </div>
          <div style={{ color: "#475569", fontFamily: "monospace", fontSize: "9px", letterSpacing: "1px" }}>
            GÜN KALDI
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <div style={{ color, fontFamily: "monospace", fontSize: "32px", fontWeight: "900", lineHeight: 1, textShadow: `0 0 20px ${color}66` }}>
            {daysLeft}
          </div>
          <div style={{ color: "#475569", fontFamily: "monospace", fontSize: "10px", letterSpacing: "2px", marginTop: "4px" }}>
            GÜN KALDI
          </div>
        </div>
      )}
    </div>
  );
}
