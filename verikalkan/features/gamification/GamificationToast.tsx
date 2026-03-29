import { useEffect } from "react";
import PixelBadge from "./PixelBadge";

interface ToastProps {
  badge: { id: string; label: string; icon: string };
  onClose: () => void;
}

export default function GamificationToast({ badge, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      position: "fixed",
      bottom: "24px",
      right: "24px",
      background: "#0d1420",
      border: "1px solid #1a3a2a",
      borderRadius: "12px",
      padding: "16px 20px",
      display: "flex",
      alignItems: "center",
      gap: "16px",
      zIndex: 9999,
      boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
      animation: "slideIn 0.3s ease"
    }}>
      <style>{`@keyframes slideIn { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
      
      <PixelBadge badgeId={badge.id as any} unlocked={true} size={40} />
      
      <div>
        <p style={{ color: "#00ff88", fontSize: "10px", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: "bold", fontFamily: "monospace" }}>YENİ ROZET!</p>
        <p style={{ color: "white", fontWeight: "bold", fontSize: "15px", margin: 0, fontFamily: "monospace" }}>{badge.label}</p>
      </div>
      <button onClick={onClose} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: "18px", marginLeft: "8px" }}>×</button>
    </div>
  );
}
