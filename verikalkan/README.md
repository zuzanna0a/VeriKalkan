# 🛡️ VeriKalkan — Kişisel Veri Hakları Asistanı

> "Verini geri al." — Türkiye'nin ilk KVKK odaklı, AI destekli veri hakkı asistanı.

---

## 🧩 Problem

Türkiye'de milyonlarca insan, hangi şirketlerin elinde hangi kişisel verisinin olduğunu bilmiyor. KVKK bu hakları yazıya dökmüş ama kullanan yok — çünkü nasıl kullanılacağı anlaşılır değil.

## 💡 Çözüm

VeriKalkan üç şey yapar:
1. **Dijital Sağlık Skoru** — E-postanı gir, kaç sızıntıda yer aldığını ve risk skorunu gör
2. **KVKK Dilekçe Üretici** — Şirket seç, bilgilerini gir, resmi silme/bilgi talebi dilekçesini AI yazar ve e-posta olarak gönderir
3. **30 Gün Takipçisi** — Dilekçeni gönderdin, şirket cevap vermedi mi? Otomatik hatırlatma ve KVKK şikâyet dilekçesi hazır

---

## 🚀 Nasıl Çalıştırılır?

### Gereksinimler
- Node.js 18+
- Bir API anahtarı: Google AI Studio (Gemini) — ücretsiz → https://aistudio.google.com
- Bir e-posta servisi: Resend — ücretsiz 3.000 e-posta/ay → https://resend.com

### Kurulum

```bash
# 1. Projeyi bilgisayarına indir
git clone https://github.com/KULLANICI_ADIN/verikalkan.git
cd verikalkan

# 2. Bağımlılıkları yükle
npm install

# 3. Ortam değişkenlerini ayarla
cp .env.example .env
# .env dosyasını aç, API anahtarlarını gir (aşağıda açıklandı)

# 4. Uygulamayı başlat
npm run dev
```

### .env Dosyasına Ne Girilmeli?

```
GEMINI_API_KEY=buraya_google_ai_studio_anahtarın
RESEND_API_KEY=buraya_resend_anahtarın
RESEND_FROM_EMAIL=noreply@verikalkan.com
```

### Canlı Yayın Linki

🌐 https://verikalkan.vercel.app *(deploy sonrası güncellenecek)*

---

## 📁 Proje Yapısı

```
verikalkan/
├── README.md           ← Bu dosya
├── idea.md             ← Problem tanımı ve AI'ın rolü
├── user-flow.md        ← Kullanıcı akışı adım adım
├── tech-stack.md       ← Teknoloji seçimleri ve gerekçeleri
├── prd.md              ← Ürün gereksinimleri dokümanı
├── tasks.md            ← Cursor için görev listesi
└── features/           ← Tüm kaynak kodları burada
    ├── score/          ← Dijital Sağlık Skoru
    ├── petition/       ← Dilekçe Üretici
    ├── tracker/        ← 30 Gün Takipçisi
    └── analyzer/       ← Metin/Cookie Analizörü
```

---

## ⚠️ Önemli Notlar

- Bu uygulama hukuki danışmanlık vermez; KVKK dilekçe şablonları bilgi amaçlıdır
- Kullanıcı verileri şifrelenerek saklanır, üçüncü taraflarla paylaşılmaz
- Gizlilik Politikası: `features/legal/privacy-policy.md`
