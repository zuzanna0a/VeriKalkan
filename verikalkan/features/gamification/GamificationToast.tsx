"use client";
import { useEffect } from "react";

interface ToastProps {
  badge: { label: string; icon: string };
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
      background: "linear-gradient(135deg, #1E3A5F, #1E40AF)",
      border: "1px solid #3B82F6",
      borderRadius: "16px",
      padding: "16px 20px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      zIndex: 9999,
      boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
      animation: "slideIn 0.3s ease"
    }}>
      <style>{`@keyframes slideIn { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
      <span style={{ fontSize: "32px" }}>{badge.icon}</span>
      <div>
        <p style={{ color: "#93C5FD", fontSize: "11px", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "1px" }}>Yeni Rozet!</p>
        <p style={{ color: "white", fontWeight: "bold", fontSize: "15px", margin: 0 }}>{badge.label}</p>
      </div>
      <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer", fontSize: "18px", marginLeft: "8px" }}>×</button>
    </div>
  );
}
