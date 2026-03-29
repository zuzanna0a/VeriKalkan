"use client";
import { useState, useRef, useEffect } from "react";
import PixelCat from "./PixelCat";
import { useTheme } from "@/context/ThemeContext";

interface Message {
  role: "user" | "bot";
  content: string;
}

export default function SayeBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Merhaba! Ben Saye. Türkiye'deki KVKK hakların ve dijital güvenliğin konusunda sana rehberlik etmek için buradayım. Merak ettiğin her şeyi sorabilirsin!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [catState, setCatState] = useState<"idle" | "thinking" | "happy">("idle");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const T = theme === "dark" ? {
    bg: "#0d1420",
    border: "#1a2a3a",
    input: "#020810",
    text: "#e2e8f0",
    muted: "#475569",
    primary: "#00ff88",
    primaryText: "#020810",
    bubble: "#020810",
    userBubble: "#1a2a3a",
  } : {
    bg: "#ffffff",
    border: "#e2e8f0",
    input: "#f8fafc",
    text: "#0f172a",
    muted: "#94a3b8",
    primary: "#0ea5e9",
    primaryText: "#ffffff",
    bubble: "#f1f5f9",
    userBubble: "#0ea5e915",
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);
    setCatState("thinking");

    try {
      const res = await fetch("/api/kalkanbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history: messages })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "bot", content: data.reply }]);
      setCatState("happy");
      setTimeout(() => setCatState("idle"), 2000);
    } catch {
      setMessages(prev => [...prev, { role: "bot", content: "Bir hata oluştu, lütfen tekrar deneyin." }]);
      setCatState("idle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ position: "fixed", bottom: "32px", right: "32px", zIndex: 1000 }}>
        {open && (
          <div style={{
            position: "absolute",
            bottom: "80px",
            right: 0,
            width: "360px",
            background: T.bg,
            border: `1px solid ${T.border}`,
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
            display: "flex",
            flexDirection: "column",
            height: "500px"
          }}>
            <div style={{
              background: theme === "dark" ? "#020810" : "#f8fafc",
              borderBottom: `1px solid ${T.border}`,
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}>
              <div style={{ animation: "float 2s ease-in-out infinite" }}>
                <PixelCat size={40} state={catState} />
              </div>
              <div>
                <div style={{ color: T.primary, fontFamily: "monospace", fontSize: "14px", fontWeight: "bold", letterSpacing: "2px" }}>
                  SAYE
                </div>
                <div style={{ color: T.muted, fontFamily: "monospace", fontSize: "10px", letterSpacing: "1px" }}>
                  {loading ? "DÜŞÜNÜYOR..." : "AKILLI ASİSTAN"}
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{ marginLeft: "auto", background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: "20px" }}
              >
                ×
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {messages.map((msg, i) => (
                <div key={i} style={{
                  display: "flex",
                  gap: "10px",
                  flexDirection: msg.role === "user" ? "row-reverse" : "row",
                  alignItems: "flex-start"
                }}>
                  {msg.role === "bot" && <PixelCat size={28} state="idle" />}
                  <div style={{
                    background: msg.role === "user" ? T.userBubble : T.bubble,
                    border: `1px solid ${T.border}`,
                    borderRadius: "12px",
                    padding: "10px 14px",
                    maxWidth: "85%",
                    color: T.text,
                    fontFamily: "monospace",
                    fontSize: "12px",
                    lineHeight: "1.6"
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <PixelCat size={28} state="thinking" />
                  <div style={{ color: T.muted, fontFamily: "monospace", fontSize: "12px" }}>
                    <span style={{ animation: "blink 1s infinite" }}>▋</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div style={{ borderTop: `1px solid ${T.border}`, padding: "12px", display: "flex", gap: "8px" }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Saye'ye sorun..."
                style={{
                  flex: 1,
                  background: T.input,
                  border: `1px solid ${T.border}`,
                  borderRadius: "8px",
                  padding: "10px 14px",
                  color: T.text,
                  fontFamily: "monospace",
                  fontSize: "12px",
                  outline: "none"
                }}
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                style={{
                  background: T.primary,
                  color: T.primaryText,
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 16px",
                  fontFamily: "monospace",
                  fontSize: "14px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                →
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setOpen(!open)}
          style={{
            background: theme === "dark" ? "#0d1420" : "#ffffff",
            border: `3px solid ${T.primary}`,
            borderRadius: "50%",
            width: "64px",
            height: "64px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 30px ${T.primary}44`,
            transition: "all 0.3s"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = `0 0 40px ${T.primary}66`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = `0 0 30px ${T.primary}44`;
          }}
        >
          <PixelCat size={40} state={open ? "happy" : "idle"} />
        </button>
      </div>
    </>
  );
}
