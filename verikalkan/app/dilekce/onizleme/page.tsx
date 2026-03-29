"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePetitionContext } from "@/features/petition/PetitionContext";
import { Loader2, Copy, Download, Mail, CheckCircle2, X, AlertCircle } from "lucide-react";
import PixelIcon from "@/features/ui/PixelIcon";
import jsPDF from "jspdf";
import SignaturePadComponent, { SignaturePadRef } from "@/features/petition/SignaturePad";
import { addPoints, getGamification } from "@/features/gamification/useGamification";
import GamificationToast from "@/features/gamification/GamificationToast";
import DarkLayout from "@/components/DarkLayout";
import { useTheme } from "@/context/ThemeContext";

import { KVKK_EMAILS } from "@/features/petition/kvkkEmails";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  companyName: string;
  userEmail: string;
  kvkkEmail: string;
  rightType: string;
  loading: boolean;
}

function ConfirmationModal({ isOpen, onClose, onConfirm, companyName, userEmail, kvkkEmail, rightType, loading }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div style={{ background: "var(--vk-bg-card)", border: "1px solid var(--vk-border)", borderRadius: "16px", padding: "32px", maxWidth: "500px", width: "100%", position: "relative" }}>
        <button onClick={onClose} className="absolute top-4 right-4 text-vk-text-muted hover:text-vk-text transition-colors">
          <X className="h-5 w-5" />
        </button>
        
        <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "var(--vk-text)", marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
          <PixelIcon variant="alert" size={24} color="var(--vk-primary)" /> Dilekçeniz Gönderilmeye Hazır
        </h3>

        <div className="space-y-4 mb-8">
          <p style={{ color: "var(--vk-text-muted)", fontSize: "14px" }}>Aşağıdaki bilgilerle dilekçeniz <strong>{companyName}</strong>'na iletilecektir:</p>
          
          <div style={{ background: "var(--vk-bg-input)", borderRadius: "8px", padding: "16px", border: "1px solid var(--vk-border)", fontSize: "13px", fontFamily: "monospace" }}>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-vk-text-muted">Gönderen:</span>
              <span className="col-span-2 text-vk-text truncate">{userEmail}</span>
              
              <span className="text-vk-text-muted">Alıcı:</span>
              <span className="col-span-2 text-vk-text truncate">{kvkkEmail}</span>
              
              <span className="text-vk-text-muted">Konu:</span>
              <span className="col-span-2 text-vk-text italic">KVKK Kapsamında {rightType} Talebi</span>
              
              <span className="text-vk-text-muted">Format:</span>
              <span className="col-span-2 text-vk-text text-[11px]">PDF eki ile resmi e-posta</span>
            </div>
          </div>

          <div style={{ background: "rgba(var(--vk-primary-rgb), 0.05)", border: "1px solid rgba(var(--vk-primary-rgb), 0.2)", borderRadius: "8px", padding: "12px", display: "flex", gap: "12px" }}>
            <AlertCircle className="h-5 w-5 text-vk-primary flex-shrink-0 mt-0.5" />
            <p style={{ fontSize: "12px", color: "var(--vk-text-muted)", lineHeight: "1.5" }}>
              Şirket, talebinizi yasal olarak <strong>30 gün</strong> içinde yanıtlamak zorundadır. 30 gün sonra yanıt gelmezse VeriKalkan sizi otomatik olarak hatırlatacaktır.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <button onClick={onClose} disabled={loading} style={{ background: "transparent", border: "1px solid var(--vk-border)", color: "var(--vk-text-muted)", fontFamily: "monospace", fontSize: "12px", letterSpacing: "1px", padding: "12px 24px", borderRadius: "6px", cursor: "pointer", flex: 1 }}>
              İPTAL
            </button>
            <button onClick={onConfirm} disabled={loading} style={{ background: "var(--vk-primary)", color: "var(--vk-bg)", fontFamily: "monospace", fontWeight: "bold", fontSize: "12px", letterSpacing: "2px", padding: "12px 24px", border: "none", borderRadius: "6px", cursor: "pointer", flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "MAIL UYGULAMASINDA AÇ"}
            </button>
          </div>
          <p style={{ fontSize: "10px", color: "var(--vk-text-muted)", textAlign: "center", fontStyle: "italic", marginTop: "8px" }}>
            Varsayılan mail uygulamanız açılacak, dilekçeniz otomatik doldurulmuş olacaktır. Gönder butonuna basmanız yeterlidir.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PetitionPreviewPage() {
  const router = useRouter();
  const { formData, generatedPetition, setGeneratedPetition } = usePetitionContext();

  const [petitionText, setPetitionText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [copying, setCopying] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [trackingStarted, setTrackingStarted] = useState(false);
  const [toastBadge, setToastBadge] = useState<any>(null);
  const [emailStatus, setEmailStatus] = useState<"idle" | "success" | "mailto">("idle");

  const [hasFetched, setHasFetched] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const signatureRef = useRef<SignaturePadRef>(null);
  const [isSignatureConfirmed, setIsSignatureConfirmed] = useState(false);
  const [confirmedSignatureUrl, setConfirmedSignatureUrl] = useState<string | null>(null);
  const { theme } = useTheme();

  const handleConfirmSignature = () => {
    if (signatureRef.current?.isEmpty()) { alert("Lütfen önce imzanızı atın."); return; }
    const signatureData = signatureRef.current!.toDataURL();
    setConfirmedSignatureUrl(signatureData);
    setIsSignatureConfirmed(true);
  };

  const handleClearSignature = () => {
    signatureRef.current?.clear();
    setIsSignatureConfirmed(false);
    setConfirmedSignatureUrl(null);
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (!formData) { router.push("/dilekce"); return; }
    if (!formData.companyName) { setError("Hata: Şirket adı eksik."); setIsLoading(false); return; }

    if (generatedPetition) {
      setPetitionText(generatedPetition);
      setIsLoading(false);
      return;
    }

    if (hasFetched) return;

    const generate = async () => {
      setHasFetched(true);
      setIsLoading(true);
      setError("");
      try {
        const capitalize = (s: string) => s ? s.trim().charAt(0).toUpperCase() + s.trim().slice(1).toLowerCase() : "";
        const fName = capitalize(formData.firstName || "");
        const lName = capitalize(formData.lastName || "");

        const res = await fetch("/api/generate-petition", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            companyName: formData.companyName, 
            userName: `${fName} ${lName}`.trim(), 
            userEmail: formData.email, 
            rightType: formData.rightType, 
            tcLast4: formData.tcLast4,
            language: formData.language || "tr"
          }),
        });

        if (res.status === 429) { setError("Kota aşıldı. Bekleyin."); setCountdown(60); setHasFetched(false); return; }
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Hata oluştu.");

        // AI'nın ekleyebileceği imza/saygılarımla kısımlarını daha agresif temizle
        const cleanText = data.petitionText
          .replace(/Saygılarımla,?.*/gim, "")
          .replace(/Sincerely,?.*/gim, "")
          .replace(/Kind regards,?.*/gim, "")
          .replace(/İmza ?:?.*/gim, "")
          .replace(/Signature ?:?.*/gim, "")
          .replace(/İmzalayan ?:?.*/gim, "")
          .replace(/Signed by ?:?.*/gim, "")
          .replace(/_{3,}/g, "")
          .trim();

        const today = new Date().toLocaleDateString(formData.language === "en" ? "en-US" : "tr-TR", { day: "numeric", month: "long", year: "numeric" });
        
        // Metnin sonuna sadece temel bilgileri ekle, PDF'de imza resmi ekleneceği için "İMZA:" yazmıyoruz
        const closing = formData.language === "en" ? "Best regards," : "Saygılarımla,";
        const datePrefix = formData.language === "en" ? "Date:" : "Tarih:";
        
        const fullText = cleanText + "\n\n" + closing + "\n" + fName + " " + lName + "\n" + formData.email + "\n" + datePrefix + " " + today;

        setPetitionText(fullText);
        setGeneratedPetition(fullText);

        const state = getGamification();
        const petitionCount = state.actions?.filter((a:any) => a.action === "dilekce").length || 0;
        const pts = petitionCount === 0 ? 15 : 10;
        const { newBadges } = addPoints(pts, "dilekce");
        if (newBadges.length > 0) setToastBadge(newBadges[0]);
      } catch (err: any) {
        setError(err.message || "Bilinmeyen hata.");
        setHasFetched(false);
      } finally { setIsLoading(false); }
    };
    generate();
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(petitionText);
      setCopying(true);
      setTimeout(() => setCopying(false), 2000);
    } catch {}
  };

  const generatePdfBase64 = async (): Promise<string | null> => {
    try {
      const fontUrl = "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf";
      const fontResponse = await fetch(fontUrl);
      const fontBuffer = await fontResponse.arrayBuffer();
      let binary = '';
      const bytes = new Uint8Array(fontBuffer);
      for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
      const base64Font = window.btoa(binary);

      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const margin = 20;
      doc.addFileToVFS("Roboto-Regular.ttf", base64Font);
      doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
      doc.setFont("Roboto", "normal");
      
      let y = margin + 10;
      doc.setFontSize(10);
      const paragraphs = petitionText.split("\n");
      paragraphs.forEach((paragraph) => {
        if (paragraph.trim() === "") { y += 4; return; }
        const lines = doc.splitTextToSize(paragraph, 170);
        lines.forEach((line: string) => {
          if (y > 270) { doc.addPage(); y = margin; }
          doc.text(line, margin, y);
          y += 5.5;
        });
        y += 2;
      });

      // PDF'de imza görselinden önce "İmza:" metni ekle
      if (confirmedSignatureUrl) {
        if (y > 250) { doc.addPage(); y = margin; }
        doc.setFontSize(10);
        doc.text("İmza:", margin, y + 2);
        doc.addImage(confirmedSignatureUrl, "PNG", margin, y + 4, 60, 25);
      }
      return doc.output("datauristring").split(",")[1];
    } catch { return null; }
  };

  const handleDownloadPDF = async () => {
    if (!isSignatureConfirmed) { alert("Lütfen imzanızı onaylayın"); return; }
    const pdfBase64 = await generatePdfBase64();
    if (pdfBase64) {
      const link = document.createElement("a");
      link.href = "data:application/pdf;base64," + pdfBase64;
      link.download = "KVKK-Dilekce.pdf";
      link.click();
    }
  };

  const currentKvkkEmail = KVKK_EMAILS[formData?.companyName || ""] || formData?.dpoEmail || "";

  const handleSendEmailRequest = () => {
    if (!isSignatureConfirmed) { alert("Lütfen imzanızı onaylayın"); return; }
    if (!currentKvkkEmail) {
      alert("Bu şirketin KVKK iletişim adresi sistemimizde henüz kayıtlı değil. Şirketin web sitesindeki gizlilik politikası sayfasından iletişim adresini bulabilirsiniz.");
      return;
    }
    setShowConfirmModal(true);
  };


  const handleSendEmailFinal = () => {
    const dpoEmail = currentKvkkEmail;
    const userName = `${formData?.firstName} ${formData?.lastName}`;
    const rightType = formData?.rightType || "Veri Silme";
    
    const subject = encodeURIComponent(
      `KVKK Kapsamında ${rightType} Talebi - ${userName}`
    );
    const body = encodeURIComponent(petitionText);
    const mailtoUrl = `mailto:${dpoEmail}?subject=${subject}&body=${body}`;
    
    window.open(mailtoUrl, "_blank");
    setEmailStatus("mailto");
    setEmailSuccess(true);
    setShowConfirmModal(false);
  };

  const handleStartTracking = async () => {
    const res = await fetch("/api/start-tracking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        userEmail: formData!.email, 
        userName: `${formData!.firstName} ${formData!.lastName}`, 
        companyName: formData!.companyName, 
        dpoEmail: currentKvkkEmail, 
        rightType: formData!.rightType 
      })
    });
    if (res.ok) {
      setTrackingStarted(true);
      addPoints(12, "takip");
    }
  };

  const cardStyle = { background: "var(--vk-bg-card)", border: "1px solid var(--vk-border)", borderRadius: "12px", padding: "24px" };
  const labelStyle = { color: "var(--vk-text-muted)", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase" as const, fontFamily: "monospace", marginBottom: "12px", display: "block" };
  const primaryButtonStyle = { background: "var(--vk-primary)", color: "var(--vk-bg)", fontFamily: "monospace", fontWeight: "bold", fontSize: "12px", letterSpacing: "2px", padding: "12px 24px", border: "none", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" };
  const secondaryButtonStyle = { background: "transparent", border: "1px solid var(--vk-border)", color: "var(--vk-text-muted)", fontFamily: "monospace", fontSize: "12px", letterSpacing: "1px", padding: "12px 24px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" };

  if (!formData) return null;

  return (
    <DarkLayout title="Dilekçe Önizleme">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <div style={cardStyle} className="relative">
              <label style={labelStyle}>// DİLEKÇE METNİ</label>
              {isLoading ? (
                <div className="flex flex-col items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-vk-primary mb-4" />
                  <p className="font-mono text-[10px] text-vk-text-muted">GENERATING VIA GROQ AI...</p>
                </div>
              ) : (
                <textarea
                  style={{ width: "100%", minHeight: "500px", background: "var(--vk-bg-input)", border: "1px solid var(--vk-border)", borderRadius: "8px", padding: "24px", color: "var(--vk-text)", fontFamily: "monospace", fontSize: "13px", lineHeight: "1.6", outline: "none", resize: "vertical" }}
                  value={petitionText}
                  onChange={(e) => setPetitionText(e.target.value)}
                />
              )}
            </div>

            <div style={cardStyle}>
              <div className="flex justify-between items-center mb-4">
                <label style={{...labelStyle, marginBottom: 0}}>// İMZA ALANI</label>
                <button onClick={handleClearSignature} style={{ color: "#ef4444", fontSize: "10px", background: "none", border: "none", cursor: "pointer", fontFamily: "monospace" }}>TEMİZLE</button>
              </div>
              
              {!isSignatureConfirmed ? (
                <div className="space-y-4">
                  <div style={{ background: "var(--vk-bg-input)", borderRadius: "8px", border: "1px solid var(--vk-border)" }}>
                    <SignaturePadComponent ref={signatureRef} />
                  </div>
                  <button onClick={handleConfirmSignature} style={{...primaryButtonStyle, width: "100%"}}>İMZAYI ONAYLA</button>
                </div>
              ) : (
                <div style={{ background: "var(--vk-bg-input)", padding: "24px", borderRadius: "8px", border: "1px solid rgba(var(--vk-primary-rgb), 0.3)", textAlign: "center" }}>
                  <img src={confirmedSignatureUrl!} alt="Signature" style={{ maxHeight: "80px", margin: "0 auto", opacity: 0.8, filter: theme === "dark" ? "invert(1)" : "none" }} />
                  <p style={{ color: "var(--vk-primary)", fontSize: "11px", marginTop: "12px", fontFamily: "monospace", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}><PixelIcon variant="check" size={14} color="currentColor" /> İMZA DOĞRULANDI</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div style={{...cardStyle, position: "sticky", top: "80px"}}>
              <label style={labelStyle}>// AKSİYONLAR</label>
              <div className="space-y-3">
                <button onClick={handleCopy} style={secondaryButtonStyle}>{copying ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copying ? "KOPYALANDI" : "METNİ KOPYALA"}</button>
                <button onClick={handleDownloadPDF} style={secondaryButtonStyle}><Download className="h-4 w-4" /> PDF İNDİR</button>
                <div style={{ height: "1px", background: "var(--vk-border)", margin: "16px 0" }} />
                
                {!currentKvkkEmail && !isLoading && (
                  <div style={{ padding: "12px", background: "#ef444411", border: "1px solid #ef444444", borderRadius: "8px", marginBottom: "8px" }}>
                    <p style={{ color: "#ef4444", fontSize: "10px", lineHeight: "1.4" }}>Bu şirketin KVKK adresi sistemimizde kayıtlı değil. Lütfen manuel bulun.</p>
                  </div>
                )}

                {emailStatus === "idle" && (
                  <button 
                    onClick={handleSendEmailRequest} 
                    style={{...primaryButtonStyle, width: "100%"}}
                  >
                    <Mail className="h-4 w-4" />
                    ŞİRKETE GÖNDER
                  </button>
                )}

                {emailStatus === "success" && (
                  <div style={{
                    background: "rgba(0, 255, 136, 0.07)",
                    border: "1px solid rgba(0, 255, 136, 0.2)",
                    borderRadius: "10px",
                    padding: "16px",
                    fontFamily: "monospace"
                  }}>
                    <div style={{ color: "var(--vk-primary)", fontSize: "12px", letterSpacing: "1px", marginBottom: "4px", fontWeight: "bold" }}>
                      ✓ E-POSTA GÖNDERİLDİ
                    </div>
                    <div style={{ color: "var(--vk-text-muted)", fontSize: "11px", lineHeight: "1.4" }}>
                      Dilekçeniz {currentKvkkEmail} adresine iletildi. Kopya {formData?.email} adresinize gönderildi.
                    </div>
                  </div>
                )}

                {emailStatus === "mailto" && (
                  <div style={{
                    background: "rgba(245, 158, 11, 0.07)",
                    border: "1px solid rgba(245, 158, 11, 0.2)",
                    borderRadius: "10px",
                    padding: "16px",
                    fontFamily: "monospace"
                  }}>
                    <div style={{ color: "#f59e0b", fontSize: "12px", letterSpacing: "1px", marginBottom: "4px", fontWeight: "bold" }}>
                      ✓ MAIL UYGULAMASI AÇILDI
                    </div>
                    <div style={{ color: "var(--vk-text-muted)", fontSize: "11px", lineHeight: "1.6" }}>
                      Dilekçeniz mail uygulamanızda hazır. Göndermek için "Gönder" tuşuna basmanız yeterli.
                    </div>
                    <div style={{ color: "var(--vk-text-muted)", fontSize: "10px", marginTop: "8px", letterSpacing: "1px", opacity: 0.7 }}>
                      Alıcı: {currentKvkkEmail}
                    </div>
                    <button
                      onClick={handleSendEmailFinal}
                      style={{
                        marginTop: "12px",
                        background: "transparent",
                        border: "1px solid rgba(245, 158, 11, 0.3)",
                        color: "#f59e0b",
                        fontFamily: "monospace",
                        fontSize: "10px",
                        letterSpacing: "1px",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        width: "100%"
                      }}
                    >
                      Tekrar Aç →
                    </button>
                  </div>
                )}
                
                {emailSuccess && !trackingStarted && (
                  <div style={{ marginTop: "20px", padding: "16px", background: "rgba(var(--vk-primary-rgb), 0.05)", borderRadius: "8px", border: "1px solid rgba(var(--vk-primary-rgb), 0.2)" }}>
                    <p style={{ color: "var(--vk-primary)", fontSize: "11px", fontWeight: "bold", marginBottom: "8px" }}>SÜRECİ TAKİP ET</p>
                    <p style={{ color: "var(--vk-text-muted)", fontSize: "10px", lineHeight: "1.5", marginBottom: "16px" }}>Şirketin 30 gün yasal süresi var. Takibi başlatarak bildirim alabilirsin.</p>
                    <button onClick={handleStartTracking} style={primaryButtonStyle}>TAKİBİ BAŞLAT</button>
                  </div>
                )}

                {trackingStarted && (
                  <div style={{ marginTop: "20px", padding: "16px", background: "rgba(var(--vk-primary-rgb), 0.05)", borderRadius: "8px", border: "1px solid rgba(var(--vk-primary-rgb), 0.2)", textAlign: "center" }}>
                    <p style={{ color: "var(--vk-primary)", fontSize: "11px", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}><PixelIcon variant="check" size={14} color="currentColor" /> TAKİP AKTİF</p>
                    <Link href="/dashboard" style={{...secondaryButtonStyle, marginTop: "12px", width: "100%"}}>DASHBOARD <PixelIcon variant="arrow" size={14} color="currentColor" /></Link>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      <ConfirmationModal 
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleSendEmailFinal}
        companyName={formData.companyName}
        userEmail={formData.email}
        kvkkEmail={currentKvkkEmail}
        rightType={formData.rightType}
        loading={false}
      />

      {toastBadge && <GamificationToast badge={toastBadge} onClose={() => setToastBadge(null)} />}
    </DarkLayout>
  );
}
