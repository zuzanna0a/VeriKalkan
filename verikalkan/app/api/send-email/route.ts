import { NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = process.env.RESEND_FROM_EMAIL || "noreply@verikalkan.com";
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { dpoEmail, userEmail, userName, petitionText } = body;

    // Validation
    if (!dpoEmail || !userEmail || !userName || !petitionText) {
      return NextResponse.json(
        { error: "Tüm alanlar (DPO E-posta, Kullanıcı E-posta, Ad Soyad, Dilekçe Metni) zorunludur." },
        { status: 400 }
      );
    }

    if (!resend) {
      return NextResponse.json(
        { error: "E-posta servisi (Resend API) yapılandırılmadı." },
        { status: 500 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: `VeriKalkan <${resendFromEmail}>`,
      to: [dpoEmail],
      cc: [userEmail],
      subject: `KVKK Kapsamında Kişisel Veri Hakkı Kullanım Bildirimi — ${userName}`,
      text: petitionText,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "E-posta gönderilirken bir hata oluştu." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Email API error:", error);
    return NextResponse.json(
      { error: "E-posta gönderilirken beklenmeyen bir hata oluştu." },
      { status: 500 }
    );
  }
}
