import { NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const testEmail = "darwin.sozbin78@gmail.com"; // Resend hesap emaili
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { dpoEmail, userEmail, userName, petitionText, pdfBase64, companyName } = body;

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

    const today = new Date().toLocaleDateString("tr-TR", { 
      day: "numeric", month: "long", year: "numeric" 
    });
    const fileName = "KVKK-Dilekce-" + (companyName || "Sirket") + "-" + today + ".pdf";

    const { data, error } = await resend.emails.send({
      from: `VeriKalkan <${resendFromEmail}>`,
      // TODO: Production'da 'to' alanını dpoEmail olarak değiştir
      to: [testEmail],
      cc: [],
      replyTo: userEmail,
      subject: "[TEST] KVKK Dilekçesi — " + userName + " → " + dpoEmail,
      attachments: pdfBase64 ? [
        {
          filename: fileName,
          content: pdfBase64,
        }
      ] : [],
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #1E3A5F; padding: 16px 20px; border-radius: 8px 8px 0 0;">
    <h2 style="color: white; margin: 0; font-size: 18px;">🛡️ VeriKalkan — KVKK Dilekçesi</h2>
    <p style="color: #CBD5E1; margin: 4px 0 0; font-size: 13px;">Gönderileceği adres: ${dpoEmail}</p>
  </div>
  <div style="border: 1px solid #E2E8F0; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
    <pre style="font-family: Arial, sans-serif; font-size: 13px; line-height: 1.8; white-space: pre-wrap; color: #1E293B;">${petitionText}</pre>
  </div>
  <p style="color: #94A3B8; font-size: 11px; margin-top: 16px; text-align: center;">
    Bu e-posta VeriKalkan tarafından oluşturulmuştur. verikalkan.com
  </p>
</div>
`,
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
