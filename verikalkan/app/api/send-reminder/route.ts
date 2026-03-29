import { Resend } from "resend";
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: Request) {
  const { userEmail, userName, companyName, dayNumber } = await req.json();

  if (!resend) return Response.json({ error: "Resend yapılandırılmadı" }, { status: 500 });

  const messages: Record<number, string> = {
    10: companyName + "'a gönderdiğin veri silme talebinin üzerinden 10 gün geçti. Henüz yanıt almadıysan endişelenme, yasal süre 30 gün.",
    25: "Son 5 gün! " + companyName + " yanıt vermezse KVKK'ya şikâyet hakkın doğuyor. Hazır olduğunda sana şikâyet dilekçesi oluşturabilirim.",
    30: "30 gün doldu. " + companyName + " yanıt verdi mi? Uygulamaya girerek sonucu kaydet."
  };

  const message = messages[dayNumber] || "KVKK takip hatırlatması.";

  await resend.emails.send({
    from: "VeriKalkan <onboarding@resend.dev>",
    to: [userEmail],
    subject: "VeriKalkan — Gün " + dayNumber + " Hatırlatması: " + companyName,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #1E3A5F; padding: 16px 20px; border-radius: 8px 8px 0 0;">
          <h2 style="color: white; margin: 0; font-size: 18px;">🛡️ VeriKalkan — ${dayNumber}. Gün Hatırlatması</h2>
        </div>
        <div style="border: 1px solid #E2E8F0; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
          <p style="font-size: 14px; color: #1E293B; line-height: 1.8;">Merhaba ${userName},</p>
          <p style="font-size: 14px; color: #1E293B; line-height: 1.8;">${message}</p>
          <a href="https://verikalkan.vercel.app/takip" 
             style="display: inline-block; background: #1E3A5F; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; margin-top: 16px; font-size: 14px;">
            Takip Sayfasına Git →
          </a>
        </div>
        <p style="color: #94A3B8; font-size: 11px; margin-top: 16px; text-align: center;">VeriKalkan — verikalkan.com</p>
      </div>
    `
  });

  return Response.json({ success: true });
}
