# VeriKalkan — Kişisel Veri Hakları Asistanı

> "Verini geri al." — Türkiye'nin ilk KVKK odaklı, AI destekli dijital hak koruma platformu.

---

## Problemim

Türkiye'de milyonlarca insan, hangi şirketlerin elinde hangi kişisel verisinin olduğunu bilmiyor. Trendyol'dan Migros'a, Papara'dan LinkedIn'e — onlarca platform, yıllarca veri biriktiriyor.

KVKK bu hakları yazıya dökmüş ama kullanan yok. Çünkü nasıl kullanılacağı anlaşılır değil, dilekçe yazmak zor, takip etmek yorucu.
Rakipler kurumsal çalışıyor kullanıcılar bireysel olarak nerde verilerinin sızdığını bilemeyebiliyorlar.

---

## Çözümüm

VeriKalkan beş şey yapar:

1. **Dijital Sağlık Skoru** — Hangi platformları kullandığını söyle, AI kaç sızıntıda yer aldığını ve risk skorunu hesaplasın.
2. **Veri Sızıntısı Analizi** — Groq AI, platformların geçmiş sızıntılarını analiz eder, hangi verilerinin çalındığını gösterir.
3. **KVKK Dilekçe Üretici** — Şirket seç, AI resmi silme/bilgi talebi dilekçesini saniyeler içinde yazar, PDF indir, mail uygulamanla tek tıkla gönder.
4. **Gizlilik Politikası Analizörü** — Karmaşık gizlilik metinlerini AI okur, sana sade Türkçeyle özetler.
5. **30 Gün Takipçisi** — Dilekçeni gönderdin, şirket cevap vermedi mi? Otomatik hatırlatma ve KVKK şikâyet dilekçesi hazır.

---

## Nasıl Çalıştırabilirsin?

### Gereksinimler
- Node.js 18+
- Groq API anahtarı (ücretsiz) → https://console.groq.com
- Supabase hesabı (ücretsiz) → https://supabase.com

### Kurulum
```bash
# 1. Projeyi klonla
git clone https://github.com/KULLANICI_ADIN/verikalkan.git
cd verikalkan

# 2. Bağımlılıkları yükle
npm install

# 3. Ortam değişkenlerini ayarla
cp .env.example .env.local
# .env.local dosyasını aç, anahtarları gir

# 4. Uygulamayı başlat
npm run dev
```

### .env.local Dosyasına Ne Girilmeli?
```bash
# Groq AI (zorunlu)
GROQ_API_KEY=buraya_groq_api_anahtarin

# Supabase (zorunlu)
NEXT_PUBLIC_SUPABASE_URL=buraya_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=buraya_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=buraya_service_role_key
```

---

## Canlı Demo

https://veri-kalkan.vercel.app/

video linki: https://youtu.be/OyEbdYQYwKg?si=s0sC7BEn6XHBoZ5r


---

## Proje Yapısı

```text
verikalkan/
├── README.md
├── idea.md              ← Proje vizyonu
├── tasks.md             ← Görev listesi
├── app/
│   ├── page.tsx         ← Ana sayfa
│   ├── dashboard/       ← Kullanıcı paneli
│   ├── dilekce/         ← Dilekçe üretici
│   ├── analiz/          ← Gizlilik analizörü
│   ├── takip/           ← 30 gün takipçisi
│   └── api/             ← Backend route'ları
│       ├── check-breach/
│       ├── generate-petition/
│       └── analyze-policy/
└── components/
    ├── Saye/            ← AI asistan
    ├── ScoreCard/       ← Sağlık skoru
    └── PixelBadges/     ← Pixel art rozetler
```

---

## Teknik Stack

| Katman | Teknoloji |
|--------|-----------|
| Frontend | Next.js 14, React, Tailwind CSS |
| Backend | Next.js API Routes |
| Veritabanı | Supabase (PostgreSQL) |
| AI | Groq API (LLaMA 3) |
| Mail | mailto: protokolü |
| Deploy | Vercel |

---

## Önemli Notlar

- Bu uygulama hukuki danışmanlık vermez; dilekçe şablonları bilgi amaçlıdır.
- Kullanıcı verileri Supabase'de güvenli şekilde saklanır, üçüncü taraflarla paylaşılmaz.
- AI analizleri tahmine dayalıdır, kesin hukuki sonuç doğurmaz.

---

##  Geliştirici

Sözbin — [@zuzanna0a](https://github.com/zuzanna0a)

---

*VeriKalkan — Dijital haklarınız, sizin kontrolünüzde.*

---
