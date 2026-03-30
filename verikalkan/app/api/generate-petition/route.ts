import { NextResponse } from "next/server";
import { supabase } from "@/features/supabase/client";

// Bekleme fonksiyonu
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("İstek Geldi (Generate Petition API):", body);

    const { companyName, userName, userEmail, rightType, requestType, tcLast4, dpoEmail, language } = body;
    const activeRightType = requestType || rightType;
    const activeLanguage = language || "tr";
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey || apiKey.trim() === "") {
      console.error("API KEY EKSİK!");
      return NextResponse.json({ error: "Groq API anahtarı (.env.local) eklenmemiş veya hatalı." }, { status: 500 });
    }

    const nameParts = (userName || "").trim().split(" ");
    const firstName = nameParts.slice(0, -1).join(" ") || userName;
    const lastName = nameParts.length > 1 ? nameParts.slice(-1).join(" ") : "";
    
    // Dil desteği için sistem mesajı
    const systemPrompt = activeLanguage === "en" 
      ? "You are a GDPR and privacy expert lawyer. You are writing an official data privacy request (like GDPR Art. 15, 17) to a company. Use formal language. Mention relevant GDPR or local law articles. Remind the company of their 30-day legal response window. DO NOT include any signature lines, DO NOT include 'Sincerely' or 'Kind regards' at the end. DO NOT add 'Signature:' or 'Signed by:'. The response must be plain text without markdown."
      : "Sen bir KVKK uzmanı avukatsın. Türkiye'de kişisel veri hakları konusunda resmi dilekçe yazıyorsun. Resmi ama anlaşılır bir dil kullan. KVKK madde numaralarını (Md. 7, 11 vb.) belirt. Şirkete 30 günlük yasal süreyi hatırlat. Dilekçenin sonuna İMZA satırı ASLA ekleme. 'Saygılarımla' satırı ASLA ekleme. 'İmzalayan:' veya 'Ad Soyad:' gibi bölümleri en sona ekleme. Yanıtı düz metin olarak ver, markdown kullanma.";

    const today = new Date().toLocaleDateString(activeLanguage === "en" ? "en-US" : "tr-TR", { day: "numeric", month: "long", year: "numeric" });

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
            content: systemPrompt
          },
          {
            role: "user",
            content: `Language: ${activeLanguage}\nCompany: ${companyName}\nDPO Email: ${dpoEmail || "Privacy Department"}\nApplicant: ${firstName} ${lastName}\nEmail: ${userEmail}\nRequest Type: ${activeRightType}\nDate: ${today}`
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Groq API isteği başarısız oldu (Status: ${response.status})`);
    }

    const data = await response.json();
    const petitionText = data.choices[0].message.content;
    const text = petitionText; // Aşağıdaki kodun bozulmaması için text değişkenini eşitle

    if (!text) {
      throw new Error("Tüm denemelere rağmen dilekçe üretilemedi.");
    }

    // 4. Üretilen yepyeni sonucu Supabase'e kaydet (Caching için)
    if (supabase) {
      try {
        const { error: insertError } = await supabase.from("petitions").insert([{
          user_email: userEmail || "anonim",
          user_name: userName,
          company_name: companyName,
          dpo_email: dpoEmail || "bilinmiyor@sirket.com",
          right_type: activeRightType,
          petition_text: text,
          status: 'sent'
        }]);

        if (insertError) {
          console.error("Supabase Insert Hatası - Detay:", JSON.stringify(insertError));
        } else {
          console.log("Supabase insert başarılı!");
        }
      } catch (insertErr) {
        console.error("Dilekçe veritabanına kaydedilemedi:", insertErr);
      }
    }

    return NextResponse.json({ petitionText: text });

  } catch (error: any) {
    console.error("Generate Petition API - Tüm Hata Objesi:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Dilekçe üretilirken sorun oluştu: ${errorMessage}` },
      { status: 500 }
    );
  }
}
