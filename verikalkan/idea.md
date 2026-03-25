# 💡 idea.md — Problem Tanımı ve AI'ın Rolü

## Seçilen Problem

**"Türkiye'deki bireyler KVKK haklarını bilmiyor ve kullansa bile nasıl kullanacağını bilmiyor."**

---

## Neden Bu Problem?

### Rakip Analizi Özeti
| Rakip | Ne Yapıyor | Neden Yetmiyor |
|---|---|---|
| Mine (saymine.com) | Inbox tarama, silme talebi | KVKK yok, Türkçe yok |
| DeleteMe | Data broker temizliği | Türkiye pazarı yok |
| KVKK.gov.tr | Resmi bilgi | Kullanıcı dostu değil, aksiyon yok |

**Boşluk:** Türkiye'de KVKK odaklı, Türkçe, AI destekli, aksiyona yönelten bir araç **yok.**

---

## Kullanıcı Kimdir?

**Ayşe, 28, pazarlama uzmanı.**
- Her gün 5-6 farklı uygulama kullanıyor
- Spama boğulmuş, kime ne verdiğini hatırlamıyor
- KVKK'yı duymuş ama "hukuki iş" diye ertelemiş
- İstediği şey: Biri "şunu yap" desin, o da yapsın

---

## AI'ın Rolü — 4 Görev

### Görev 1 — Skor Hesaplayıcı
- **Girdi:** Kullanıcının e-posta adresi + onboarding anketi yanıtları
- **AI ne yapar:** HIBP API sonuçlarını + platform kullanım bilgilerini yorumlar, 0-100 arası dijital sağlık skoru üretir
- **Çıktı:** Renkli skor kartı + kısa risk özeti ("3 sızıntıda adın geçiyor, e-ticaret verilerinin tehlikede")
- **Kullanılan model:** Gemini 1.5 Flash (hızlı, ücretsiz tier)

### Görev 2 — Dilekçe Yazarı
- **Girdi:** Şirket adı + kullanıcı adı/soyadı/e-posta + hak türü (sil/bilgi ver/düzelt)
- **AI ne yapar:** KVKK Madde 11 ve 13'e atıfla, resmi, sert ama hukuki dilekçe üretir. Jargon yok, eksik alan yok.
- **Çıktı:** Kopyalanabilir metin + PDF + doğrudan e-posta gönderimi (Resend API üzerinden agent)
- **Prompt stratejisi:** Few-shot — 3 örnek dilekçeyle modeli yönlendir, format sabit tut

### Görev 3 — Metin Analizörü (Cookie / Gizlilik Politikası)
- **Girdi:** Kullanıcının yapıştırdığı metin veya URL (sayfa içeriği scrape edilir)
- **AI ne yapar:** Uzun hukuki metni okur, 5 kritik soruyu Evet/Hayır olarak yanıtlar
- **Çıktı:**
  ```
  🔴 Verilerini 3. taraflara satıyor mu?        EVET
  🟡 Hesabını kapatınca verin siliniyor mu?     BELİRSİZ
  🟢 Veri saklama süresi belirtilmiş mi?        HAYIR
  🟢 Çocuk verisi topluyor mu?                  HAYIR
  🔴 Konum takibi yapıyor mu?                   EVET
  
  Risk Skoru: 68/100 — Yüksek Risk
  ```
- **Kullanılan model:** Gemini 1.5 Pro (uzun context gerektirir)

### Görev 4 — 30 Gün Takip Ajanı
- **Girdi:** Dilekçe gönderim tarihi + kullanıcı e-postası
- **AI ne yapar:** Gün 10, 25 ve 30'da otomatik e-posta gönderir. Gün 30'da cevap gelmemişse KVKK şikâyet dilekçesi oluşturur.
- **Çıktı:** Otomatik e-postalar + şikâyet dilekçesi
- **Altyapı:** Resend API (e-posta gönderimi) + cron job veya Vercel Scheduled Functions

---

## Neden AI Olmadan Yapılamaz?

1. **Dilekçe:** Her şirket, her hak türü için ayrı bir şablon gerekir → AI dinamik üretir
2. **Skor:** Onlarca değişkeni yorumlamak kurallar bazlı kodla kırılgan olur → AI doğal dil üretir
3. **Metin analizi:** Gizlilik politikaları 5.000-20.000 kelime → insan okuyamaz, AI okur
4. **Kişiselleştirme:** "Sen Trendyol kullanıcısısın, önce oradan başla" → AI profil bazlı öneri yapar
