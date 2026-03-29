/**
 * SUPABASE MIGRATION (Run this in Supabase SQL Editor):
 * 
 * ALTER TABLE breach_cache 
 * ADD COLUMN IF NOT EXISTS platforms jsonb,
 * ADD COLUMN IF NOT EXISTS internet_years int;
 */

import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/service";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(req: Request) {
  try {
    const { email, platforms, internet_years, categories } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "E-posta adresi zorunludur" }, { status: 400 });
    }

    // 1. Check Cache
    const { data: cacheEntry, error: cacheError } = await supabaseService
      .from("breach_cache")
      .select("*")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (cacheEntry) {
      const cacheDate = new Date(cacheEntry.created_at);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      // Check if platforms are the same and cache is fresh
      const samePlatforms = JSON.stringify(cacheEntry.platforms) === JSON.stringify(platforms);
      
      if (cacheDate > sevenDaysAgo && samePlatforms) {
        console.log("Returning from cache...");
        return NextResponse.json(cacheEntry.result);
      }
    }

    // 2. Groq AI Analysis
    const systemPrompt = `
Sen bir siber güvenlik uzmanısın. Kullanıcının dijital geçmişine bakarak gerçekçi bir veri sızıntısı analizi yapıyorsun.

Kullanıcı bilgileri verildiğinde:
1. Her platform için o yıllarda gerçekten yaşanmış veri sızıntılarını biliyorsun
2. Hangi verilerin çalınmış olabileceğini söyle
3. Risk seviyesini belirt (düşük/orta/yüksek)

Gerçek bilinen sızıntılar:
- Trendyol: 2022'de e-posta, telefon, adres
- Yemeksepeti: 2020'de e-posta, şifre, adres
- Migros: 2023'te e-posta, telefon, adres
- Getir: 2021'de e-posta, telefon, adres
- Hepsiburada: 2020'de e-posta, şifre, adres
- N11: 2021'de e-posta, telefon
- Çiçeksepeti: 2022'de e-posta, adres, telefon
- Papara: 2020'de e-posta, TC kimlik, telefon
- BiP: 2021'de telefon numarası
- Boyner: 2022'de e-posta, adres
- Puhutv: 2022'de e-posta, şifre
- LinkedIn: 2021'de e-posta, telefon, iş bilgisi
- Turkcell: 2022'de TC kimlik, telefon, adres
- Vodafone TR: 2022'de TC kimlik, telefon
- Facebook: 2021'de telefon, e-posta, isim
- Twitter/X: 2022'de e-posta, telefon
- Dropbox: 2012'de e-posta, şifre hash
- Netflix: 2023'te e-posta, ödeme bilgisi riski

Eğer kullanıcı bu platformları kullanıyorsa ve sızıntı tarihinde aktif kullanıcıysa etkilenmiş sayılır.

SADECE JSON döndür, başka hiçbir şey yazma:
{
  "found": <toplam etkilenen platform sayısı>,
  "sources": [
    {
      "name": "<platform adı>",
      "date": "<sızıntı tarihi>",
      "fields": ["<çalınan veri 1>", "<çalınan veri 2>"],
      "risk": "<düşük|orta|yüksek>",
      "certain": <true|false>
    }
  ],
  "summary": "<Türkçe kısa özet, 1 cümle>"
}
    `.trim();

    const userPrompt = `
Kullanıcı Analiz Verileri:
- E-posta: ${email}
- Kayıtlı Platformlar: ${platforms?.join(", ") || "Belirtilmedi"}
- İnternet Kullanım Süresi: ${internet_years || "Belirtilmedi"}
- Kullanım Kategorileri: ${categories?.join(", ") || "Belirtilmedi"}
    `.trim();

    const groqRes = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.1,
        response_format: { type: "json_object" }
      }),
    });

    if (!groqRes.ok) {
      throw new Error(`Groq API error: ${groqRes.status}`);
    }

    const groqData = await groqRes.json();
    const result = JSON.parse(groqData.choices[0].message.content);

    // 3. Save to Cache
    await supabaseService.from("breach_cache").upsert({
      email,
      result,
      platforms,
      internet_years: parseInt(internet_years) || 0,
      created_at: new Date().toISOString()
    }, { onConflict: "email" });

    return NextResponse.json(result);

  } catch (err: any) {
    console.error("Breach Check API Error:", err.message);
    return NextResponse.json({ 
      found: 0, 
      sources: [], 
      summary: "Analiz sırasında bir sorun oluştu, lütfen daha sonra tekrar deneyin." 
    }, { status: 500 });
  }
}
