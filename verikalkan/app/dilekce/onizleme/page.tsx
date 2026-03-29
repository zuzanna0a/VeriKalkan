"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { usePetitionContext } from "@/features/petition/PetitionContext";
import { Button } from "@/components/ui/button";
import { Loader2, Copy, Download, Mail, CheckCircle2 } from "lucide-react";
import jsPDF from "jspdf";
import SignaturePadComponent, { SignaturePadRef } from "@/features/petition/SignaturePad";

export default function PetitionPreviewPage() {
  const router = useRouter();
  const { formData, generatedPetition, setGeneratedPetition } = usePetitionContext();

  const [petitionText, setPetitionText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [copying, setCopying] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState("");

  const [hasFetched, setHasFetched] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const signatureRef = useRef<SignaturePadRef>(null);

  // İmza onayı durumları
  const [isSignatureConfirmed, setIsSignatureConfirmed] = useState(false);
  const [confirmedSignatureUrl, setConfirmedSignatureUrl] = useState<string | null>(null);

  const handleConfirmSignature = () => {
    if (signatureRef.current?.isEmpty()) {
      alert("Lütfen önce imzanızı atın.");
      return;
    }
    const signatureData = signatureRef.current!.toDataURL();
    setConfirmedSignatureUrl(signatureData);
    setIsSignatureConfirmed(true);
  };

  const handleClearSignature = () => {
    signatureRef.current?.clear();
    setIsSignatureConfirmed(false);
    setConfirmedSignatureUrl(null);
  };

  // Geri sayım sayacı
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (!formData) {
      console.warn("FRONTEND HATA: formData boş, form sayfasına yönlendiriliyor.");
      router.push("/dilekce");
      return;
    }

    if (!formData.companyName || formData.companyName.trim() === "") {
      console.error("FRONTEND HATA: companyName boş veya tanımsız! Fetch isteği durduruluyor.");
      setError("Hata: Şirket adı eksik. Lütfen formu tekrar doldurun.");
      setIsLoading(false);
      return;
    }

    console.log("Frontend Context Payload, Fetch başlıyor:", formData);

    // Önbellekte (Context'te) zaten üretilmiş bir dilekçe varsa, API'ye tekrar gitme
    if (generatedPetition) {
      setPetitionText(generatedPetition);
      setIsLoading(false);
      return;
    }

    // Zaten fetch başladıysa tekrar başlatma (React Strict Mode koruması)
    if (hasFetched) return;

    const generate = async () => {
      setHasFetched(true);
      setIsLoading(true);
      setError("");
      try {
        const capitalize = (s: string) => s ? s.trim().charAt(0).toUpperCase() + s.trim().slice(1).toLowerCase() : "";
        const fName = capitalize(formData.firstName || "");
        const lName = capitalize(formData.lastName || "");

        const payload = {
          companyName: formData.companyName,
          userName: `${fName} ${lName}`.trim(),
          userEmail: formData.email,
          rightType: formData.rightType,
          tcLast4: formData.tcLast4,
        };
        
        console.log("Frontend Context Payload:", payload);

        const res = await fetch("/api/generate-petition", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (res.status === 429) {
          setError("Sunucu yoğunluğu nedeniyle istek yapılamadı (Kota aşıldı). Lütfen 60 saniye bekleyin.");
          setCountdown(60);
          setHasFetched(false); // Tekrar denenebilmesi için state'i sıfırlıyoruz.
          return;
        }

        if (!res.ok) {
          throw new Error(data.error || "Beklenmeyen bir hata oluştu.");
        }

        const cleanText = data.petitionText
          .replace(/İmza:.*$/gim, "")
          .replace(/Saygılarımla.*$/gim, "")
          .replace(/_{3,}/g, "")
          .trim();

        const today = new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
        
        const fullText = cleanText + "\n\nSaygılarımla,\n" + fName + " " + lName + "\n" + formData.email + "\nTarih: " + today + "\n\nİMZA:";

        setPetitionText(fullText);
        setGeneratedPetition(fullText); // Context'e kaydet (Caching)
      } catch (err: any) {
        console.error("Frontend Fetch Hatası Yakalandı:", err);
        setError(err.message || "Bilinmeyen bir fetch hatası oluştu.");
        setHasFetched(false); // Hata olduysa tekrar deneyebilsin
      } finally {
        setIsLoading(false);
      }
    };

    generate();
  }, []);

  const handleRetry = () => {
    setHasFetched(false);
    setError("");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(petitionText);
      setCopying(true);
      setTimeout(() => setCopying(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const generatePdfBase64 = async (): Promise<string | null> => {
    try {
      // 1. Türkçe Karakter Desteği için Roboto Fontunu Yükle
      const fontUrl = "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf";
      const fontResponse = await fetch(fontUrl);
      const fontBuffer = await fontResponse.arrayBuffer();
      
      let binary = '';
      const bytes = new Uint8Array(fontBuffer);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64Font = window.btoa(binary);

      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const margin = 20; // 4. Hizalama: Sol ve sağ margin 20mm
      const maxWidth = 170; // (210 - 20 - 20)
      let y = margin;

      // Fontu VFS'e ekle ve kullan
      doc.addFileToVFS("Roboto-Regular.ttf", base64Font);
      doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
      doc.setFont("Roboto", "normal");
      
      // 5. Referans Numarası (Sağ Üst Köşeye Küçük Fontla)
      const d = new Date();
      const dateStr = `${d.getFullYear()}${(d.getMonth()+1).toString().padStart(2,'0')}${d.getDate().toString().padStart(2,'0')}`;
      const random4 = Math.floor(1000 + Math.random() * 9000);
      const refNo = `BVTD-${dateStr}-${random4}`;

      doc.setFontSize(8);
      const pageWidth = doc.internal.pageSize.getWidth();
      doc.text("Referans No: " + refNo, pageWidth - margin, margin, { align: 'right' });
      
      y += 8; // Ref nodan sonra biraz boşluk bırak
      
      // Standart font boyutu metin için
      doc.setFontSize(10);

      // 2. Otomatik Satır Kaydırma (doc.splitTextToSize zaten eklemiştik, koruyoruz)
      const paragraphs = petitionText.split("\n");
      paragraphs.forEach((paragraph) => {
        if (paragraph.trim() === "") {
          y += 4; // empty line spacing
          return;
        }
        const lines = doc.splitTextToSize(paragraph, maxWidth);
        lines.forEach((line: string) => {
          if (y > 270) { doc.addPage(); y = margin; }
          doc.text(line, margin, y);
          y += 5.5;
        });
        y += 2;
      });

      // 3. Dinamik İmza Konumu: Metnin bittiği y koordinatına +20px (jsPDF'teki karşılığı ortalama +6mm)
      y += 6; 
      
      if (y > 250) { 
        doc.addPage(); 
        y = margin; 
      }
      
      doc.setFontSize(10);
      doc.text("İMZA:", margin, y);
      y += 4;

      doc.addImage(confirmedSignatureUrl!, "PNG", margin, y, 60, 25);

      return doc.output("datauristring").split(",")[1];
    } catch (err) {
      console.error("PDF oluşturulurken hata:", err);
      alert("PDF oluşturulurken bir hata oluştu. Lütfen bağlantınızı kontrol edip tekrar deneyin.");
      return null;
    }
  };

  const handleDownloadPDF = async () => {
    if (!isSignatureConfirmed || !confirmedSignatureUrl) {
      alert("Lütfen imzanızı onaylayın");
      return;
    }

    const pdfBase64 = await generatePdfBase64();
    if (pdfBase64) {
      const link = document.createElement("a");
      link.href = "data:application/pdf;base64," + pdfBase64;
      const companyName = formData?.companyName?.replace(/\s+/g, '-') || "Sirket";
      link.download = "KVKK-Dilekce-" + companyName + "-" + new Date().toISOString().slice(0,10) + ".pdf";
      link.click();
    }
  };

  const handleSendEmail = async () => {
    if (!isSignatureConfirmed || !confirmedSignatureUrl) {
      alert("Lütfen imzanızı onaylayın");
      return;
    }

    setSendingEmail(true);
    setEmailError("");
    setEmailSuccess(false);

    try {
      const pdfBase64 = await generatePdfBase64();
      if (!pdfBase64) throw new Error("PDF verisi oluşturulamadığı için e-posta gönderilemedi.");

      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dpoEmail: formData?.dpoEmail,
          userEmail: formData?.email,
          userName: `${formData?.firstName} ${formData?.lastName}`,
          petitionText,
          pdfBase64,
          companyName: formData?.companyName
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "E-posta gönderilemedi.");
      }

      setEmailSuccess(true);
    } catch (err: any) {
      setEmailError(err.message);
    } finally {
      setSendingEmail(false);
    }
  };

  if (!formData) return null; // Will redirect in useEffect

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dilekçe Önizleme</h1>
        <p className="text-slate-500 mt-2">Dilekçeniz Groq yapay zekası tarafından KVKK Madde 11 ve 13'e uygun olarak hazırlandı.</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-slate-200 shadow-sm">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
          <p className="text-slate-600 font-medium">Lütfen bekleyin, dilekçeniz hazırlanıyor...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 text-red-600 rounded-lg border border-red-200 text-center">
          <h3 className="font-semibold mb-2">Hata Oluştu</h3>
          <p className="mb-4">{error}</p>
          {countdown > 0 ? (
            <p className="font-bold text-red-700">{countdown} saniye sonra tekrar deneyebilirsiniz.</p>
          ) : (
            <div className="flex justify-center gap-4 mt-4">
              <Button onClick={() => router.push("/dilekce")} variant="outline">
                Forma Geri Dön
              </Button>
              <Button onClick={handleRetry} className="bg-blue-600 hover:bg-blue-700 text-white">
                Tekrar Dene
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="w-full">
            <div id="petition-content" className="bg-white p-6 md:p-10 rounded-lg border border-slate-200 shadow-sm relative">
              <textarea
                value={petitionText}
                onChange={(e) => setPetitionText(e.target.value)}
                className="w-full whitespace-pre-wrap font-serif text-slate-800 leading-relaxed min-h-[400px] resize-y bg-transparent outline-none border-none focus:ring-0"
              />
              {isSignatureConfirmed && (
                <div className="absolute bottom-4 right-4 bg-green-100 text-green-800 text-xs font-semibold px-3 py-1.5 rounded-md border border-green-200 shadow-sm">
                  ✓ İmza eklendi
                </div>
              )}
            </div>
            <p className="text-sm text-slate-500 italic mt-2 text-center">Dilekçeyi ihtiyacınıza göre düzenleyebilirsiniz.</p>
          </div>
          
          <div className="space-y-3 border rounded-xl p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">İmzanız</p>
                <p className="text-xs text-gray-500">Parmağınız veya mouse ile imzanızı atın</p>
              </div>
              <button
                onClick={handleClearSignature}
                className="text-xs text-red-500 hover:text-red-700 underline"
                type="button"
              >
                Temizle
              </button>
            </div>
            
            {!isSignatureConfirmed ? (
              <div className="flex flex-col gap-3">
                <SignaturePadComponent ref={signatureRef} />
                <Button 
                  onClick={handleConfirmSignature} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  İmzayı Onayla
                </Button>
              </div>
            ) : (
              <div className="mt-2 flex flex-col items-center justify-center p-4 border border-slate-200 bg-white rounded-lg shadow-inner">
                <img 
                  src={confirmedSignatureUrl!} 
                  alt="Onaylanmış İmza" 
                  className="h-20 max-w-full border border-gray-200 rounded opacity-60 bg-gray-50" 
                />
                <p className="text-green-600 font-medium text-sm mt-3 flex items-center">
                  ✓ İmzanız onaylandı
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4 sticky top-24">
              <h3 className="font-semibold text-slate-900 mb-4">Aksiyonlar</h3>
              
              <Button 
                onClick={handleCopy} 
                variant="outline" 
                className="w-full sm:w-auto justify-start gap-2"
              >
                {copying ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                {copying ? "Kopyalandı!" : "Metni Kopyala"}
              </Button>

              <Button 
                onClick={handleDownloadPDF} 
                variant="outline" 
                className="w-full sm:w-auto justify-start gap-2"
              >
                <Download className="h-4 w-4" />
                PDF Olarak İndir
              </Button>

              <div className="pt-4 border-t border-slate-100">
                <Button 
                  onClick={handleSendEmail} 
                  disabled={sendingEmail || emailSuccess}
                  className="w-full sm:w-auto justify-start gap-2 bg-[#1E3A5F] hover:bg-[#16304f] text-white disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {sendingEmail ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                  {emailSuccess ? "E-posta Gönderildi" : "Şirkete E-posta Gönder"}
                </Button>
                
                {emailError && (
                  <p className="text-xs text-red-500 mt-2">{emailError} (Dilekçeyi kopyalayıp kendiniz de gönderebilirsiniz.)</p>
                )}
                {emailSuccess && (
                  <p className="text-xs text-green-600 mt-2">Dilekçeniz e-posta olarak hazırlandı ve test modunda size iletildi. Domain kurulumu sonrası doğrudan şirkete gönderilecektir.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
