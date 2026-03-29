"use client";
import { useEffect, useState } from "react";

interface HourglassTrackerProps {
  startDate: string;
  companyName: string;
  userEmail: string;
  trackingId: string;
  compact?: boolean;
}

export default function HourglassTracker({ startDate, companyName, userEmail, trackingId, compact }: HourglassTrackerProps) {
  const totalDays = 30;
  const start = new Date(startDate);
  const now = new Date();
  const daysPassed = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const daysLeft = Math.max(0, totalDays - daysPassed);
  const progress = Math.min(100, (daysPassed / totalDays) * 100);

  const getStatus = () => {
    if (daysLeft === 0) return { color: "#DC2626", label: "Süre Doldu!", message: "30 günlük yasal süre sona erdi. KVKK'ya şikâyet hakkınız doğdu." };
    if (daysLeft <= 5) return { color: "#EA580C", label: "Kritik!", message: "Son " + daysLeft + " gün! Yanıt gelmezse KVKK'ya şikâyet edebilirsiniz." };
    if (daysLeft <= 10) return { color: "#D97706", label: "Yaklaşıyor", message: daysLeft + " gün kaldı. Henüz yanıt gelmediyse takipte kalın." };
    return { color: "#1E3A5F", label: "Bekleniyor", message: daysLeft + " gün kaldı. " + companyName + " yanıt süresini kullanıyor." };
  };

  const status = getStatus();

  if (compact) {
    return (
      <div style={{
        background: "linear-gradient(135deg, #0F172A, #1E3A5F)",
        borderRadius: "16px",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        border: "1px solid #1E40AF44"
      }}>
        {/* Mini hourglass icon */}
        <div style={{ fontSize: "32px" }}>⏳</div>
        
        {/* Info */}
        <div style={{ flex: 1 }}>
          <div style={{ color: "white", fontWeight: "bold", fontSize: "15px" }}>{companyName}</div>
          <div style={{ color: "#94A3B8", fontSize: "12px", marginTop: "2px" }}>KVKK Silme Talebi</div>
          <div style={{ 
            background: "#1E293B", 
            borderRadius: "99px", 
            height: "4px",
            marginTop: "8px",
            overflow: "hidden"
          }}>
            <div style={{ 
              width: progress + "%", 
              height: "100%",
              background: "linear-gradient(90deg, #F59E0B, " + status.color + ")",
              borderRadius: "99px"
            }} />
          </div>
        </div>

        {/* Days */}
        <div style={{ textAlign: "center", minWidth: "60px" }}>
          <div style={{ 
            fontSize: "36px", 
            fontWeight: "900", 
            color: status.color,
            lineHeight: 1,
            textShadow: "0 0 15px " + status.color + "66"
          }}>
            {daysLeft}
          </div>
          <div style={{ color: "#64748B", fontSize: "10px", marginTop: "2px" }}>GÜN KALDI</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #0F172A 100%)",
      borderRadius: "20px",
      padding: "32px 24px",
      maxWidth: "360px",
      margin: "0 auto",
      boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
      fontFamily: "Arial, sans-serif"
    }}>
      
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <p style={{ color: "#94A3B8", fontSize: "12px", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "2px" }}>KVKK TAKİP</p>
        <p style={{ color: "white", fontSize: "16px", fontWeight: "bold", margin: 0 }}>{companyName}</p>
      </div>

      {/* Hourglass SVG */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
        <svg width="120" height="180" viewBox="0 0 120 180">
          <defs>
            <clipPath id="topClip">
              <polygon points="15,10 105,10 75,90 45,90" />
            </clipPath>
            <clipPath id="bottomClip">
              <polygon points="45,90 75,90 105,170 15,170" />
            </clipPath>
            <linearGradient id="sandGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1E40AF" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Glass frame */}
          <polygon points="15,10 105,10 75,90 45,90" fill="url(#glassGrad)" stroke="#3B82F6" strokeWidth="2" strokeOpacity="0.6" />
          <polygon points="45,90 75,90 105,170 15,170" fill="url(#glassGrad)" stroke="#3B82F6" strokeWidth="2" strokeOpacity="0.6" />
          
          {/* Top frame lines */}
          <line x1="15" y1="10" x2="105" y2="10" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" />
          <line x1="15" y1="170" x2="105" y2="170" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" />
          <line x1="43" y1="90" x2="77" y2="90" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />

          {/* Top sand (remaining) */}
          {daysLeft > 0 && (
            <g clipPath="url(#topClip)">
              <rect
                x="10"
                y={10 + (80 * progress / 100)}
                width="100"
                height={80 - (80 * progress / 100)}
                fill="url(#sandGrad)"
                opacity="0.9"
              />
            </g>
          )}

          {/* Bottom sand (passed) */}
          <g clipPath="url(#bottomClip)">
            <rect
              x="10"
              y={170 - (80 * progress / 100)}
              width="100"
              height={80 * progress / 100}
              fill="url(#sandGrad)"
              opacity="0.7"
            />
          </g>

          {/* Falling sand particles */}
          {daysLeft > 0 && (
            <>
              <circle cx="60" cy="92" r="1.5" fill="#F59E0B" opacity="0.9">
                <animate attributeName="cy" from="92" to="168" dur="1.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.9" to="0" dur="1.2s" repeatCount="indefinite" />
              </circle>
              <circle cx="58" cy="92" r="1" fill="#FBBF24" opacity="0.7">
                <animate attributeName="cy" from="92" to="168" dur="1.8s" repeatCount="indefinite" begin="0.4s" />
                <animate attributeName="opacity" from="0.7" to="0" dur="1.8s" repeatCount="indefinite" begin="0.4s" />
              </circle>
              <circle cx="62" cy="92" r="1" fill="#F59E0B" opacity="0.6">
                <animate attributeName="cy" from="92" to="168" dur="2.1s" repeatCount="indefinite" begin="0.8s" />
                <animate attributeName="opacity" from="0.6" to="0" dur="2.1s" repeatCount="indefinite" begin="0.8s" />
              </circle>
            </>
          )}

          {/* Shine effect */}
          <polygon points="20,15 40,15 25,80" fill="white" opacity="0.05" />
        </svg>
      </div>

      {/* Days counter */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <div style={{
          background: status.color + "15",
          border: "2px solid " + status.color,
          borderRadius: "16px",
          padding: "16px 24px",
          display: "inline-block",
          minWidth: "160px"
        }}>
          <div style={{
            fontSize: "72px",
            fontWeight: "900",
            color: status.color,
            lineHeight: 1,
            textShadow: "0 0 30px " + status.color + "88",
            fontVariantNumeric: "tabular-nums"
          }}>
            {daysLeft}
          </div>
          <div style={{
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
            marginTop: "4px",
            letterSpacing: "1px"
          }}>
            GÜN KALDI
          </div>
          <div style={{
            color: "#64748B",
            fontSize: "11px",
            marginTop: "4px"
          }}>
            {daysPassed} / 30 gün geçti
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ 
          background: "#1E293B", 
          borderRadius: "99px", 
          height: "6px",
          overflow: "hidden"
        }}>
          <div style={{ 
            width: progress + "%", 
            height: "100%", 
            background: "linear-gradient(90deg, #F59E0B, " + status.color + ")",
            borderRadius: "99px",
            transition: "width 1s ease"
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
          <span style={{ color: "#64748B", fontSize: "11px" }}>Gün 0</span>
          <span style={{ color: "#64748B", fontSize: "11px" }}>Gün 30</span>
        </div>
      </div>

      {/* Status badge */}
      <div style={{ 
        background: status.color + "22",
        border: "1px solid " + status.color + "44",
        borderRadius: "12px",
        padding: "12px 16px",
        marginBottom: "16px"
      }}>
        <div style={{ color: status.color, fontSize: "12px", fontWeight: "bold", marginBottom: "4px" }}>
          {status.label}
        </div>
        <div style={{ color: "#CBD5E1", fontSize: "12px", lineHeight: "1.5" }}>
          {status.message}
        </div>
      </div>

      {/* Milestones */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {[
          { day: 10, label: "Hatırlatma" },
          { day: 25, label: "Uyarı" },
          { day: 30, label: "Son Gün" }
        ].map(milestone => (
          <div key={milestone.day} style={{ textAlign: "center" }}>
            <div style={{ 
              width: "32px", 
              height: "32px", 
              borderRadius: "50%",
              background: daysPassed >= milestone.day ? status.color : "#1E293B",
              border: "2px solid " + (daysPassed >= milestone.day ? status.color : "#334155"),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 4px",
              fontSize: "10px",
              color: daysPassed >= milestone.day ? "white" : "#64748B",
              fontWeight: "bold"
            }}>
              {daysPassed >= milestone.day ? "✓" : milestone.day}
            </div>
            <div style={{ color: "#64748B", fontSize: "10px" }}>{milestone.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
