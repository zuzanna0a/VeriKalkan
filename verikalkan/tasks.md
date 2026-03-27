# ✅ tasks.md — Cursor Görev Listesi

> Bu dosyayı Cursor'a ver ve şunu söyle:
> **"Bu tasks.md dosyasındaki görevleri sırayla tamamla. Her görevi bitirince [DONE] işaretle ve bir sonrakine geç."**

---

## 🔴 SPRINT 1 — Temel Altyapı

### Görev 1 — Proje Kurulumu
```
Next.js 14 projesi oluştur (App Router kullan).
Tailwind CSS ve shadcn/ui ekle.
Supabase client kurulumunu yap.
.env.local.example dosyası oluştur, tüm gerekli değişkenleri listele.
.gitignore'a .env.local ekle.
```
- [x] Tamamlandı

### Görev 2 — Landing Page
```
/ rotasına landing page yap.
İçerik:
- Büyük başlık: "Verini geri al."
- Alt başlık: "Hangi şirketlerin elinde ne var? KVKK haklarını 30 saniyede kullan."
- İki büyük buton: "Skorumu Öğren" ve "Dilekçe Oluştur"
- Basit 3 adım açıklaması (ikon + kısa metin)
Tasarım: Koyu lacivert (#1E3A5F) header, beyaz arka plan, mavi CTA butonları.
Mobil uyumlu olsun.
```
- [x] Tamamlandı

### Görev 3 — Dijital Sağlık Skoru Sayfası
```
/skor rotası oluştur.
E-posta input formu ekle (validation: geçerli e-posta formatı).
HIBP API entegrasyonu: https://haveibeenpwned.com/api/v3/breachedaccount/{e-posta}
- API key header: hibp-api-key
- Hata yönetimi: 404 = sızıntı yok, 429 = rate limit, 500 = genel hata
Skor hesaplama fonksiyonu yaz:
- Sızıntı yoksa: 85 puan
- 1-2 sızıntı: 65 puan
- 3-5 sızıntı: 40 puan
- 5+ sızıntı: 20 puan
Skor kartı bileşeni: Büyük sayı, renk (kırmızı/sarı/yeşil), kısa açıklama.
Sızıntı listesi: Her sızıntı için ad, tarih, etkilenen veri türleri.
```
- [x] Tamamlandı
  - 📝 Mantıksal Filtreleme Eklendi: tarih filtresi (internetYears), gerçekçilik kontrolü (kısa/tekrarlı e-posta → sızıntı yok), Adobe sadece eski kullanıcılara gösterilir.

### Görev 4 — Onboarding Anketi
```
/onboarding rotası oluştur. 5 adımlı wizard form (her adım tek soru):
Adım 1: "Hangi e-ticaret platformlarını kullanıyorsun?" (çoklu seçim: Trendyol, Hepsiburada, Getir, Yemeksepeti, Sahibinden, Amazon TR, Diğer)
Adım 2: "Sosyal medya hesapların?" (çoklu seçim: Instagram, Twitter/X, LinkedIn, TikTok, Facebook, Yok)
Adım 3: "Fintech/bankacılık uygulamaları?" (çoklu seçim: Papara, Moneyou, İninal, Klasik banka, Yok)
Adım 4: "Kaç yıldır aktif internet kullanıcısısın?" (seçim: 1-3 yıl, 4-7 yıl, 8-12 yıl, 12+ yıl)
Adım 5: "Son 1 yılda herhangi bir yerden veri silme talebinde bulundun mu?" (Evet/Hayır)
Yanıtları localStorage'a kaydet.
Son adımda /dashboard'a yönlendir.
```
- [x] Tamamlandı

---

## 🟡 SPRINT 2 — AI Entegrasyonu

### Görev 5 — Gemini AI Risk Profili
```
/api/risk-profile rotası oluştur (POST).
Girdi: onboarding anketi yanıtları (JSON).
Gemini API'ye gönderilecek sistem mesajı:
---
Sen bir kişisel veri güvenliği uzmanısın. Kullanıcının platform kullanım bilgilerine göre:
1. Hangi platformlarda veri riski yüksek olduğunu belirt
2. Hangi 3 aksiyon ile başlaması gerektiğini söyle
3. Toplam kaç platformda aktif olduğunu tahmin et
Yanıtı JSON formatında ver: { "highRiskPlatforms": [], "topActions": [], "estimatedPlatformCount": 0, "summary": "" }
---
Yanıtı parse et, /dashboard'da göster.
Hata durumunda statik bir fallback metin göster.
```
- [x] Tamamlandı

### Görev 6 — Dilekçe Üretici Sayfası
```
/dilekce rotası oluştur. 3 adımlı form:
Adım 1 — Şirket Seç:
  Dropdown listesi. Şirketler: Trendyol (kvkk@trendyol.com), Hepsiburada (kvkk@hepsiburada.com), Getir (privacy@getir.com), Yemeksepeti (kvkk@yemeksepeti.com), Sahibinden (kvkk@sahibinden.com), N11 (kvkk@n11.com), Boyner (kvkk@boyner.com.tr), Zara TR (privacy@zara.com.tr), LC Waikiki (kvkk@lcw.com), MediaMarkt TR (kvkk@mediamarkt.com.tr), Diğer (kullanıcı DPO e-postasını girer).
Adım 2 — Bilgilerini Gir:
  Ad, Soyad, E-posta (zorunlu). TC Kimlik No son 4 hane (isteğe bağlı).
Adım 3 — Hak Türünü Seç:
  Radyo buton: "Verilerimi Sil (KVKK Md.7)" / "Verilerim Hakkında Bilgi Ver (KVKK Md.11)" / "Verilerimi Düzelt (KVKK Md.11)"
"Dilekçeyi Oluştur" butonu.
```
- [x] Tamamlandı (başlandı — companies.ts hazır ve form oluşturuldu)

### Görev 7 — Gemini Dilekçe Üretimi
```
/api/generate-petition rotası oluştur (POST).
Girdi: { companyName, dpoEmail, userName, userEmail, rightType }
Gemini API sistem mesajı:
---
Sen bir KVKK uzmanı avukatsın. Türkiye'de kişisel veri hakları konusunda resmi dilekçe yazıyorsun.
Aşağıdaki bilgilere göre KVKK Madde 11 ve 13 kapsamında resmi bir veri hakkı kullanım dilekçesi yaz.
Kurallar:
- Resmi ama anlaşılır bir dil kullan
- KVKK madde numaralarını belirt
- Şirkete 30 günlük yasal süreyi hatırlat
- İmza için boşluk bırak
- Tarih ve başvuru numarası ekle (BVTD-{bugünün tarihi}-{rastgele 4 hane})
Yanıtı düz metin olarak ver, markdown kullanma.
---
Üretilen dilekçeyi önizleme alanında göster.
```
- [x] Tamamlandı

### Görev 8 — Dilekçe Çıktıları
```
Dilekçe önizleme sayfasına 3 buton ekle:
1. "Kopyala" — navigator.clipboard.writeText() ile panoya kopyala, "Kopyalandı!" feedback göster
2. "PDF İndir" — jsPDF ile PDF oluştur, dosya adı: "KVKK-Dilekce-{şirket}-{tarih}.pdf"
3. "E-posta Gönder" — /api/send-email endpoint'ini çağır
/api/send-email rotası (POST):
  Resend API kullan.
  From: "VeriKalkan <noreply@verikalkan.com>"
  To: DPO e-posta adresi
  CC: kullanıcının e-postası
  Subject: "KVKK Kapsamında Kişisel Veri Hakkı Kullanım Bildirimi — [Kullanıcı Adı Soyadı]"
  Body: Dilekçe metni (düz metin)
  Başarıda: "E-posta gönderildi!" toast göster
  Hata durumunda: "Gönderim başarısız, dilekçeyi kopyalayıp kendin gönderebilirsin" mesajı
```
- [x] Tamamlandı

---

## 🟢 SPRINT 3 — Takip ve Gamification

### Görev 9 — Supabase Tabloları
```
Supabase'de şu tabloları oluştur (SQL editörde çalıştır):

CREATE TABLE petitions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email text NOT NULL,
  user_name text NOT NULL,
  company_name text NOT NULL,
  dpo_email text NOT NULL,
  right_type text NOT NULL,
  petition_text text,
  sent_at timestamp DEFAULT now(),
  status text DEFAULT 'sent'
);

CREATE TABLE tracking (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  petition_id uuid REFERENCES petitions(id),
  user_email text NOT NULL,
  deadline timestamp NOT NULL,
  notif_10_sent boolean DEFAULT false,
  notif_25_sent boolean DEFAULT false,
  result text DEFAULT 'pending'
);

Row Level Security'yi kapat (MVP için, sonra ekle).
```
- [x] Tamamlandı

### Görev 10 — 30 Gün Takipçisi
```
Dilekçe gönderildikten sonra "Takibi Başlat" butonu göster.
Kullanıcı onaylarsa:
  - petitions tablosuna kayıt ekle
  - tracking tablosuna kayıt ekle (deadline = şimdiki zaman + 30 gün)

/api/send-reminder rotası oluştur:
  Girdi: { trackingId, dayNumber }
  Gün 10 e-postası: "Trendyol'a gönderdiğin veri silme talebinin üzerinden 10 gün geçti. Henüz yanıt almadıysan endişelenme, yasal süre 30 gün."
  Gün 25 e-postası: "Son 5 gün! Yanıt gelmezse KVKK'ya şikâyet hakkın doğuyor. Hazır olduğunda sana şikâyet dilekçesi oluşturabilirim."
  Gün 30 e-postası: "30 gün doldu. Yanıt geldi mi? [Yanıtı Kaydet] bağlantısına tıkla."

Vercel Cron Job ekle (vercel.json):
{
  "crons": [{ "path": "/api/check-deadlines", "schedule": "0 9 * * *" }]
}

/api/check-deadlines rotası: Supabase'den süresi geçmiş takipleri çek, hatırlatma e-postalarını gönder.
```
- [ ] Tamamlandı

### Görev 11 — Metin / Cookie Analizörü
```
/analiz rotası oluştur.
İki input modu:
  a) URL yapıştır → sunucu tarafında fetch et, HTML'den metin çıkar
  b) Metin yapıştır → direkt Gemini'ye gönder

/api/analyze-text rotası (POST):
Gemini sistem mesajı:
---
Sana bir şirketin gizlilik politikası veya kullanım koşulları metni verilecek.
Aşağıdaki 5 soruyu SADECE "EVET", "HAYIR" veya "BELİRSİZ" olarak yanıtla.
Sonra 0-100 arası bir risk skoru ver (100 = çok riskli).
Yanıtı JSON formatında ver:
{
  "sellsData": "EVET|HAYIR|BELİRSİZ",
  "deletesOnClose": "EVET|HAYIR|BELİRSİZ",
  "hasRetentionPeriod": "EVET|HAYIR|BELİRSİZ",
  "collectsChildData": "EVET|HAYIR|BELİRSİZ",
  "tracksLocation": "EVET|HAYIR|BELİRSİZ",
  "riskScore": 0,
  "summary": "2-3 cümle özet"
}
---
Sonuç kartı:
  Her soru için renkli badge (Evet=kırmızı, Hayır=yeşil, Belirsiz=sarı)
  Risk skoru göster
  "Bu şirkete dilekçe gönder" CTA butonu
```
- [ ] Tamamlandı

### Görev 12 — Gamification Sistemi
```
localStorage'da kullanıcı puanını tut: { score: 0, badges: [], actions: [] }

Puan ekle şu aksiyonlarda:
  - Breach skoru görüntüleme: +5
  - Onboarding tamamlama: +10
  - İlk dilekçe oluşturma: +15
  - Her ek dilekçe: +10
  - Metin analizi: +8
  - 30 gün takip başlatma: +12

Rozet sistemi:
  "Dijital Dedektif" → 25 puan (ikon: 🔍)
  "Veri Kalkanı" → 75 puan (ikon: 🛡️)
  "KVKK Savaşçısı" → 150 puan (ikon: ⚔️)
  "Veri Ustası" → 250 puan (ikon: 🏆)

Dashboard'a puan + aktif rozet göster.
Yeni rozet kazanıldığında confetti animasyonu + toast bildirim.
```
- [ ] Tamamlandı

---

## 🔵 SPRINT 4 — Cila ve Deploy

### Görev 13 — UI Polish
```
Tüm sayfalara loading state ekle (skeleton loader veya spinner).
Tüm hata mesajlarını Türkçe yap.
Mobil responsive kontrol: iPhone SE, iPhone 14, Samsung Galaxy S23.
Favicon ekle (kalkan ikonu).
Meta tags ekle (SEO için): title, description, og:image.
```
- [ ] Tamamlandı

### Görev 14 — GitHub'a Yükle ve Deploy
```
(Bu adımı kendim yapacağım — GitHub bölümüne bak)
```
- [ ] Tamamlandı

---

## 📝 Cursor'a Komut Şablonları

Bir görevi başlatmak için Cursor Agent Mode'da şunu söyle:
> "tasks.md dosyasındaki [GÖREV NUMARASI]'i tamamla. Tüm bileşenleri features/ klasörüne kaydet."

Hata alınca:
> "Bu hatayı düzelt: [hata metnini yapıştır]. Başka hiçbir şeyi değiştirme."

İterasyon için:
> "Dilekçe sayfasındaki butonu daha büyük yap ve rengini #1A56DB yap."
