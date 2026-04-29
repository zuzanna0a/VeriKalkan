import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/features/supabase/client";

function buildMailtoUrl(
  userEmail: string,
  companyName: string,
  dayNumber: number
): { subject: string; body: string; message: string } {
  if (dayNumber === 10) {
    return {
      subject: `VeriKalkan — 10. Gün Hatırlatması: ${companyName}`,
      body: `Merhaba, ${companyName}'a gönderdiğin veri silme talebinin üzerinden 10 gün geçti. Henüz yanıt almadıysan endişelenme, yasal süre 30 gün.`,
      message: `${companyName} talebinin üzerinden 10 gün geçti.`,
    };
  }

  if (dayNumber === 25) {
    return {
      subject: `VeriKalkan — Son 5 Gün! ${companyName}`,
      body: `Son 5 gün! ${companyName} yanıt vermezse KVKK'ya şikayet hakkın doğuyor.`,
      message: `Son 5 gün! ${companyName} yanıt vermezse KVKK'ya şikayet hakkın doğuyor.`,
    };
  }

  // dayNumber === 30
  return {
    subject: `VeriKalkan — 30 Gün Doldu: ${companyName}`,
    body: `30 gün doldu. ${companyName} yanıt verdi mi? Uygulamaya girerek sonucu kaydet.`,
    message: `30 gün doldu. ${companyName} yanıt verdi mi?`,
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userEmail, userName, companyName, dayNumber } = body;

    if (!userEmail || !companyName || !dayNumber) {
      return NextResponse.json(
        { error: "Eksik parametre: userEmail, companyName, dayNumber zorunlu." },
        { status: 400 }
      );
    }

    const { subject, body: emailBody, message } = buildMailtoUrl(userEmail, companyName, dayNumber);

    const mailtoUrl = `mailto:${userEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

    if (supabaseAdmin) {
      await supabaseAdmin
        .from("reminder_logs")
        .insert([{
          user_email: userEmail,
          company_name: companyName,
          day_number: dayNumber,
          sent_at: new Date().toISOString(),
        }])
        .catch(() => {
          // reminder_logs tablosu yoksa sessizce geç
        });
    }

    return NextResponse.json({ mailtoUrl, dayNumber, message });
  } catch (error: any) {
    console.error("send-reminder hatası:", error);
    return NextResponse.json(
      { error: error.message || "Bilinmeyen hata" },
      { status: 500 }
    );
  }
}
