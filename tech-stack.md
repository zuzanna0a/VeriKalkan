
# ⚙️ tech-stack.md — Teknoloji Seçimleri

## Özet Tablo

| Katman | Araç | Neden? | Maliyet |
|---|---|---|---|
| Frontend | Next.js 15 (App Router) | Cursor/Antigravity ile en iyi çalışan framework, Vercel'e otomatik deploy | Ücretsiz |
| Stil | Tailwind CSS | Hızlı geliştirme, Cursor/Antigravity AI iyi biliyor | Ücretsiz |
| AI Motoru | Groq API (LLaMA 3) | Ücretsiz tier cömert, Türkçe güçlü, hızlı | Ücretsiz |
| Breach Analizi | AI destekli tahmin | Gerçek sızıntı verileriyle eğitilmiş prompt sistemi | Ücretsiz |
| E-posta | mailto: protokolü | Sunucu gerektirmez, kullanıcının kendi mail uygulaması | Ücretsiz |
| Veritabanı | Supabase (PostgreSQL) | Ücretsiz tier, auth dahil, breach cache sistemi | Ücretsiz |
| PDF Üretimi | jsPDF | Tarayıcıda çalışır, kurulum basit | Ücretsiz |
| Hosting | Vercel | GitHub push = otomatik deploy | Ücretsiz |
| Cache | Supabase breach_cache | Groq'a gereksiz istek gitmesini engeller (7 günlük) | Ücretsiz |

**Toplam maliyet: 0 TL** (tüm araçlar ücretsiz tier ile çalışır)

---

## Detaylı Kararlar

### Neden Next.js?
Cursor AI, Next.js projelerinde çok daha iyi 
kod üretiyor. App Router ile API route'ları 
aynı projede yönetiliyor. Vercel'e deploy 
otomatik, her git push'ta tetikleniyor.

### Neden Groq, Gemini değil?
Proje başlangıcında Gemini kullanıldı ancak 
API versiyonu değişikliği nedeniyle (v1beta 
deprecation) Groq'a geçildi.
- **Hız:** Groq, LLaMA 3 modelini çok hızlı çalıştırıyor
- **Ücretsiz tier:** Günlük 14.400 istek
- **Türkçe:** Yeterince güçlü
- **Supabase cache:** 7 günlük cache ile 
  Groq'a istek sayısı minimize edildi

### Neden mailto: protokolü?
Resend ile sunucu taraflı mail gönderimi 
denendi ancak domain doğrulaması ve 
kurumsal mail filtresi sorunları nedeniyle 
mailto: protokolüne geçildi.
- Kullanıcının kendi mail hesabından gider
- Spam'e düşme riski sıfır
- Sunucu maliyeti yok
- Kurumsal KVKK adreslerine güvenilir ulaşım

### Neden AI destekli breach analizi?
HIBP ($52/yıl) ve LeakCheck (public API 
yetersiz) değerlendirildi. Türk platformları 
için AI tabanlı analiz daha kapsamlı sonuç 
veriyor. Gerçek sızıntı tarihleri ve 
etkilenen veriler Groq prompt'una işlendi.

**İleride eklenecek:** HIBP API entegrasyonu 
(deploy sonrası, kullanıcı sayısı arttıkça)

---

## Proje Yapısı
VeriKalkan/
└── verikalkan/
├── app/
│   ├── page.tsx              ← Ana sayfa
│   ├── basla/                ← Onboarding
│   ├── dashboard/            ← Kullanıcı paneli
│   ├── dilekce/              ← Dilekçe üretici
│   ├── analiz/               ← Gizlilik analizörü
│   ├── takip/                ← 30 gün takipçisi
│   └── api/
│       ├── check-breach/     ← AI breach analizi
│       ├── generate-petition/← Dilekçe üretimi
│       └── analyze-policy/   ← Politika analizi
└── components/
├── Saye/                 ← AI asistan
└── PixelBadges/          ← Rozet sistemi

---

## Environment Variables

`.env.local` dosyasına şunlar girilmeli:
```bash
# Groq AI (zorunlu)
GROQ_API_KEY=buraya_groq_api_anahtarin

# Supabase (zorunlu)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# İleride eklenecek (opsiyonel)
HIBP_API_KEY=buraya_hibp_anahtarin
```

⚠️ `.env.local` dosyasını asla 
GitHub'a yükleme. `.gitignore` 
dosyasında tanımlı olmalı.



---

## Gelecek Geliştirmeler

| Özellik | Araç | Öncelik |
|---|---|---|
| Gerçek breach verisi | HIBP API ($4.39/ay) | Yüksek |
| Domain doğrulaması | Resend + verikalkan.com | Orta |
| Push bildirimleri | Supabase Realtime | Düşük |
| Mobil uygulama | React Native (Expo) | Düşük |

---