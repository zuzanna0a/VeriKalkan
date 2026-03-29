import { NextResponse } from "next/server";
import { supabase } from "@/features/supabase/client";

// Bekleme fonksiyonu
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("İstek Geldi (Generate Petition API):", body);

    const { companyName, userName, userEmail, rightType, requestType, tcLast4, dpoEmail } = body;
    const activeRightType = requestType || rightType;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey || apiKey.trim() === "") {
      console.error("API KEY EKSİK!");
      return NextResponse.json({ error: "Groq API anahtarı (.env.local) eksik." }, { status: 500 });
    }

    // 1. Supabase Caching Kontrolü
    if (supabase) {
      try {
        const { data: cachedPetitions, error: fetchError } = await supabase
          .from("petitions")
          .select("petition_text")
          .eq("user_name", userName)
          .eq("company_name", companyName)
          .eq("right_type", activeRightType)
          .limit(1);

        if (!fetchError && cachedPetitions && cachedPetitions.length > 0) {
          console.log("Supabase Caching: Önceden üretilmiş dilekçe bulundu. AI tetiklenmiyor.");
          return NextResponse.json({ petitionText: cachedPetitions[0].petition_text });
        }
      } catch (dbErr) {
        console.warn("Supabase Cache Okuma Hatası:", dbErr);
      }
    } else {
      console.warn("Supabase API eksik, cache kontrolü atlanıyor.");
    }

    // İsim ayrıştırma
    const nameParts = (userName || "").trim().split(" ");
    const firstName = nameParts.slice(0, -1).join(" ") || userName;
    const lastName = nameParts.length > 1 ? nameParts.slice(-1).join(" ") : "";
    const today = new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.GROQ_API_KEY
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "Sen bir KVKK uzmanı avukatsın. Türkiye'de kişisel veri hakları konusunda resmi dilekçe yazıyorsun. Resmi ama anlaşılır bir dil kullan. KVKK madde numaralarını belirt. Şirkete 30 günlük yasal süreyi hatırlat. Dilekçenin sonuna İMZA satırı EKLEME — imza ayrıca eklenecek. Saygılarımla satırı da EKLEME — bu da ayrıca eklenecek. Yanıtı düz metin olarak ver, markdown kullanma."
          },
          {
            role: "user",
            content: "Şirket: " + companyName + "\nDPO E-posta: " + dpoEmail + "\nBaşvurucu: " + firstName + " " + lastName + "\nE-posta: " + userEmail + "\nHak türü: " + activeRightType + "\nBaşvuru No: BVTD-" + new Date().toISOString().slice(0,10) + "-" + Math.floor(1000 + Math.random() * 9000) + "\nTarih: " + today
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
