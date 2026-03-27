import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/features/supabase/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("İstek Geldi (Generate Petition API):", body);

    const { companyName, userName, userEmail, rightType, tcLast4, dpoEmail } = body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey.trim() === "") {
      console.error("API KEY EKSİK!");
      return NextResponse.json({ error: "API Key Bulunamadı." }, { status: 500 });
    }

    // Supabase Caching Kontrolü
    if (supabase) {
      try {
        const { data: cachedPetitions, error: fetchError } = await supabase
          .from("petitions")
          .select("petition_text")
          .eq("user_email", userEmail)
          .eq("company_name", companyName)
          .eq("right_type", rightType)
          .limit(1);

        if (!fetchError && cachedPetitions && cachedPetitions.length > 0) {
          console.log("Supabase Caching: Önceden üretilmiş dilekçe veritabanında bulundu. AI tetiklenmeden geri dönülüyor.");
          return NextResponse.json({ petitionText: cachedPetitions[0].petition_text });
        }
      } catch (dbErr) {
        console.warn("Supabase Caching Hatası:", dbErr);
      }
    } else {
      console.warn("Supabase API bağlantısı kurulamadı. Sadece Gemini kullanılacak.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // TS hatasını göz ardı etmek için ts-ignore kullandık, böylece apiVersion sorun yaratmaz
    // @ts-ignore
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      apiVersion: 'v1' 
    });

    const prompt = `Sen bir KVKK uzmanı avukatsın. Türkiye'de kişisel veri hakları konusunda resmi dilekçe yazıyorsun.
Aşağıdaki bilgilere göre KVKK Madde 11 ve 13 kapsamında resmi bir veri hakkı kullanım dilekçesi yaz.

Kullanıcı Bilgileri:
- İlgili Kişi Adı Soyadı: ${userName}
- E-posta Adresi: ${userEmail}
- TC Kimlik No Son 4 Hane: ${tcLast4 || "Belirtilmedi"}
- Başvuru Yapılan Şirket: ${companyName}
- Talep Türü: ${rightType}

Kurallar:
- Resmi ama anlaşılır bir dil kullan.
- KVKK Madde 11 ve 13 numaralarını açıkça belirt.
- Hak düşürücü ve yasal süre olan 30 günlük cevap verme süresini şirkete hatırlat.
- Dilekçe sonuna imza için boşluk bırak.
- Dilekçenin bir köşesine şu formattaki başvuru numarasını ekle: BVTD-${new Date().toISOString().split('T')[0]}-${Math.floor(1000 + Math.random() * 9000)}.
- Talep türüne ("Verilerimi Sil", "Bilgi Ver", "Düzelt") uygun spesifik bir talep paragrafı yaz.
- SADECE dilekçe metnini üret, markdown kullanma, ekstra yorum veya giriş/çıkış cümleleri ekleme.`;

    let text = "";
    try {
      const result = await model.generateContent(prompt);
      text = result.response.text();
    } catch (modelErr: any) {
      console.warn("Gemini 2.0 Flash başarısız:", modelErr.message);
      throw modelErr;
    }

    // Üretilen yepyeni sonucu Supabase'e kaydet
    if (supabase) {
      try {
        await supabase.from("petitions").insert([{
          user_email: userEmail,
          user_name: userName,
          company_name: companyName,
          dpo_email: dpoEmail || "bilinmiyor@sirket.com",
          right_type: rightType,
          petition_text: text,
          status: 'sent'
        }]);
        console.log("Yeni dilekçe Supabase'e başarıyla kaydedildi.");
      } catch (insertErr) {
        console.error("Dilekçe veritabanına kaydedilemedi:", insertErr);
      }
    }

    return NextResponse.json({ petitionText: text });
  } catch (error: any) {
    console.error("Generate Petition API - Tüm Hata Objesi:", error); // Hatanın tüm objesi
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return NextResponse.json(
      { error: `Dilekçe üretilirken detaylı hata oluştu: ${errorMessage}` },
      { status: 500 }
    );
  }
}
