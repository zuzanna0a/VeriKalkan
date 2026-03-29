export async function POST(req: Request) {
  const body = await req.json();
  const { mode, url, text } = body;

  let contentToAnalyze = "";

  if (mode === "url") {
    if (!url) return Response.json({ error: "URL gerekli" }, { status: 400 });
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 VeriKalkan-Analyzer" }
      });
      const html = await res.text();
      // Strip HTML tags
      contentToAnalyze = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 12000); // Limit for Groq context
    } catch {
      return Response.json(
        { error: "URL içeriği alınamadı. Metni kopyalayıp yapıştırmayı deneyin." },
        { status: 400 }
      );
    }
  } else {
    if (!text) return Response.json({ error: "Metin gerekli" }, { status: 400 });
    contentToAnalyze = text.slice(0, 12000);
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return Response.json({ error: "Groq API key eksik" }, { status: 500 });

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + apiKey
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `Sana bir şirketin gizlilik politikası veya kullanım koşulları metni verilecek.
Aşağıdaki 5 soruyu SADECE "EVET", "HAYIR" veya "BELİRSİZ" olarak yanıtla.
Sonra 0-100 arası bir risk skoru ver (100 = çok riskli).
SADECE JSON döndür, başka hiçbir şey yazma:
{
  "sellsData": "EVET|HAYIR|BELİRSİZ",
  "deletesOnClose": "EVET|HAYIR|BELİRSİZ",
  "hasRetentionPeriod": "EVET|HAYIR|BELİRSİZ",
  "collectsChildData": "EVET|HAYIR|BELİRSİZ",
  "tracksLocation": "EVET|HAYIR|BELİRSİZ",
  "riskScore": 0,
  "summary": "2-3 cümle Türkçe özet"
}`
        },
        {
          role: "user",
          content: contentToAnalyze
        }
      ],
      temperature: 0.1,
      max_tokens: 500
    })
  });

  if (!response.ok) {
    return Response.json({ error: "AI analizi başarısız oldu" }, { status: 500 });
  }

  const data = await response.json();
  const rawText = data.choices[0].message.content;

  try {
    const clean = rawText.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);
    return Response.json(result);
  } catch {
    return Response.json(
      { error: "AI yanıtı işlenemedi. Tekrar deneyin." },
      { status: 500 }
    );
  }
}
