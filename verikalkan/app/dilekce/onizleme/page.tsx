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

        const today = new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
        
        const signature = "\n\nSaygılarımla,\n\n" + fName + " " + lName + "\n" + formData.email + "\n\nTarih: " + today;
        const finalPetitionText = data.petitionText + signature;

        setPetitionText(finalPetitionText);
        setGeneratedPetition(finalPetitionText); // Context'e kaydet (Caching)
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

  const handleDownloadPDF = () => {
    if (signatureRef.current?.isEmpty()) {
      alert("Lütfen önce imzanızı atın.");
      return;
    }

    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const margin = 20;
    const maxWidth = 170;
    let y = margin;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    const lines = doc.splitTextToSize(petitionText, maxWidth);
    lines.forEach((line: string) => {
      if (y > 270) { doc.addPage(); y = margin; }
      doc.text(line, margin, y);
      y += 5.5;
    });

    y += 10;
    if (y > 240) { doc.addPage(); y = margin; }
    doc.setFontSize(10);
    doc.text("İMZA:", margin, y);
    y += 4;

    const signatureData = signatureRef.current!.toDataURL();
    doc.addImage(signatureData, "PNG", margin, y, 60, 25);

    const companyName = formData?.companyName?.replace(/\s+/g, '-') || "Sirket";
    const fileName = "KVKK-Dilekce-" + companyName + "-" + new Date().toISOString().slice(0,10) + ".pdf";
    doc.save(fileName);
  };

  const handleSendEmail = async () => {
    if (signatureRef.current?.isEmpty()) {
      alert("Lütfen önce imzanızı atın.");
      return;
    }

    setSendingEmail(true);
    setEmailError("");
    setEmailSuccess(false);

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dpoEmail: formData?.dpoEmail,
          userEmail: formData?.email,
          userName: `${formData?.firstName} ${formData?.lastName}`,
          petitionText,
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
        <p className="text-slate-500 mt-2">Dilekçeniz Gemini yapay zekası tarafından KVKK Madde 11 ve 13'e uygun olarak hazırlandı.</p>
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
            <div id="petition-content" className="bg-white p-6 md:p-10 rounded-lg border border-slate-200 shadow-sm">
              <textarea
                value={petitionText}
                onChange={(e) => setPetitionText(e.target.value)}
                className="w-full whitespace-pre-wrap font-serif text-slate-800 leading-relaxed min-h-[400px] resize-y bg-transparent outline-none border-none focus:ring-0"
              />
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
                onClick={() => signatureRef.current?.clear()}
                className="text-xs text-red-500 hover:text-red-700 underline"
                type="button"
              >
                Temizle
              </button>
            </div>
            <SignaturePadComponent ref={signatureRef} />
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
                  <p className="text-xs text-green-600 mt-2">Dilekçe ilgili şirketin DPO adresine gönderildi ve size CC yapıldı.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
