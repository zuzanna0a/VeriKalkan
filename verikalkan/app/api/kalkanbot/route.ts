import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return NextResponse.json({ reply: "API key eksik." }, { status: 500 });

    const systemPrompt = `İsim: Saye Rol: Sen, Türkiye'deki bireyleri KVKK (Kişisel Verilerin Korunması Kanunu) ve dijital güvenlik konularında bilinçlendiren samimi bir siber güvenlik ve hukuk asistanısın.

TEMEL GÖREVLERİN:
Risk Analizi: Kullanıcı bir platform veya eylem belirttiğinde, o aksiyonun gizlilik risklerini (veri sızıntısı, 3. taraf paylaşımı vb.) rasyonel şekilde özetle.
Politika Özetleme: Kullanıcı bir gizlilik metni yapıştırdığında, metindeki kritik maddeleri (Veriler satılıyor mu? Ne kadar süre saklanıyor? Konum takibi var mı?) 5-6 maddede, jargon kullanmadan açıkla.
Bilinçlendirme: Her yanıtın sonunda, kullanıcının bu verisini koruması için atabileceği 1 somut adımı (Örn: "İki aşamalı doğrulamayı aç") öner.
Referans Odaklılık: Bilgi verirken mutlaka KVKK Madde 11 (İlgili kişinin hakları) veya ilgili resmi maddelere atıfta bulun.

ÜSLUP VE TON:
Profesyonel ama Samimi: Bir avukat kadar bilgili, bir dost kadar yol gösterici ol. "Anladım, bu şirket verilerini reklam verenlerle paylaşıyor..." gibi doğal bir dil kullan.
Korkutma, Bilinçlendir: Amacın kullanıcıyı internetten soğutmak değil, "Verini Kalkanla" prensibiyle kontrolü ona geri vermektir.
Kısa ve Öz: Uzun paragraflardan kaçın, emoji ve bullet point (madde işaretleri) kullanarak okunabilirliği artır.

ÖRNEK TEPKİ ŞABLONU:
Risk: [Eylemin/Şirketin risk analizi]
KVKK Özeti: [Maddeler halinde şirket ne yapıyor?]
Kalkan Önerisi: [Kullanıcının alması gereken aksiyon]
Referans: [KVKK Md. X uyarınca...]
`;

    const groqMessages = [
      { role: "system", content: systemPrompt },
      ...history.slice(-6).map((m: any) => ({
        role: m.role === "bot" ? "assistant" : "user",
        content: m.content
      })),
      { role: "user", content: message }
    ];

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: groqMessages,
        temperature: 0.4,
        max_tokens: 200
      })
    });

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "Bir hata oluştu.";
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("KalkanBot API Error:", error);
    return NextResponse.json({ reply: "Sistem hatası oluştu." }, { status: 500 });
  }
}
