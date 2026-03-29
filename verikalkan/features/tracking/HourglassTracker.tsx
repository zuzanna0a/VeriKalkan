"use client";
import { useEffect, useState } from "react";
import PixelHourglass from "./PixelHourglass";

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
    if (daysLeft === 0) return { color: "#ef4444", label: "Süre Doldu!", message: "30 günlük yasal süre sona erdi. KVKK'ya şikâyet hakkınız doğdu." };
    if (daysLeft <= 5) return { color: "#f59e0b", label: "Kritik!", message: "Son " + daysLeft + " gün! Yanıt gelmezse KVKK'ya şikâyet edebilirsiniz." };
    if (daysLeft <= 10) return { color: "#f59e0b", label: "Yaklaşıyor", message: daysLeft + " gün kaldı. Henüz yanıt gelmediyse takipte kalın." };
    return { color: "#3b82f6", label: "Bekleniyor", message: daysLeft + " gün kaldı. " + companyName + " yanıt süresini kullanıyor." };
  };

  const status = getStatus();

  if (compact) {
    return (
      <div style={{
        background: "#020810",
        borderRadius: "12px",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        border: "1px solid #1a2a3a"
      }}>
        <PixelHourglass daysLeft={daysLeft} totalDays={30} compact={true} />
        
        <div style={{ flex: 1 }}>
          <div style={{ color: "white", fontWeight: "bold", fontSize: "14px", fontFamily: "monospace" }}>{companyName}</div>
          <div style={{ color: "#475569", fontSize: "10px", marginTop: "2px", fontFamily: "monospace", letterSpacing: "1px" }}>KVKK SİLME TALEBİ</div>
          <div style={{ 
            background: "#0d1420", 
            borderRadius: "99px", 
            height: "4px",
            marginTop: "12px",
            overflow: "hidden"
          }}>
            <div style={{ 
              width: progress + "%", 
              height: "100%",
              background: status.color,
              borderRadius: "99px",
              boxShadow: `0 0 8px ${status.color}88`
            }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: "#0d1420",
      borderRadius: "16px",
      padding: "32px 24px",
      maxWidth: "360px",
      margin: "0 auto",
      boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
      fontFamily: "monospace",
      border: "1px solid #1a2a3a"
    }}>
      
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <p style={{ color: "#475569", fontSize: "11px", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "2px" }}>// KVKK TAKİP</p>
        <p style={{ color: "white", fontSize: "16px", fontWeight: "bold", margin: 0 }}>{companyName}</p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
        <PixelHourglass daysLeft={daysLeft} totalDays={30} compact={false} />
      </div>

      <div style={{ 
        background: status.color + "11",
        border: `1px solid ${status.color}33`,
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "24px"
      }}>
        <div style={{ color: status.color, fontSize: "12px", fontWeight: "bold", marginBottom: "4px" }}>
          {status.label}
        </div>
        <div style={{ color: "#94a3b8", fontSize: "11px", lineHeight: "1.5" }}>
          {status.message}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {[
          { day: 10, label: "HATIRLAT" },
          { day: 25, label: "UYARI" },
          { day: 30, label: "FİNAL" }
        ].map(milestone => (
          <div key={milestone.day} style={{ textAlign: "center" }}>
            <div style={{ 
              width: "24px", 
              height: "24px", 
              borderRadius: "50%",
              background: daysPassed >= milestone.day ? status.color : "#020810",
              border: `1px solid ${daysPassed >= milestone.day ? status.color : "#1a2a3a"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 4px",
              fontSize: "9px",
              color: daysPassed >= milestone.day ? "#020810" : "#475569",
              fontWeight: "bold"
            }}>
              {daysPassed >= milestone.day ? "✓" : milestone.day}
            </div>
            <div style={{ color: "#475569", fontSize: "8px" }}>{milestone.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
