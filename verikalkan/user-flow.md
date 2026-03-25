# 🗺️ user-flow.md — Kullanıcı Akışı

## Genel Harita

```
[ Landing Page ]
       ↓
[ E-posta Gir ] ──→ [ Skor Hesaplanıyor... ] ──→ [ Dijital Sağlık Skoru Kartı ]
                                                           ↓
                                               [ Onboarding Anketi (5 soru) ]
                                                           ↓
                                               [ AI Risk Profili + Öneriler ]
                                                           ↓
                         ┌─────────────────────────────────┤
                         ↓                                 ↓
              [ Dilekçe Üretici ]              [ Metin Analizörü ]
                         ↓
              [ Şirket Seç → Bilgi Gir ]
                         ↓
              [ AI Dilekçeyi Yazar ]
                         ↓
              [ Kopyala / PDF / E-posta Gönder ]
                         ↓
              [ 30 Gün Takibini Başlat? ]
                   ↓           ↓
                 EVET         HAYIR
                   ↓
         [ Takip Dashboard'u ]
                   ↓
    [ Gün 10: Hatırlatma E-postası ]
                   ↓
    [ Gün 25: "Son 5 gün!" Uyarısı ]
                   ↓
    [ Gün 30: Sonuç Sor ]
         ↓               ↓
    Cevap Aldım     Cevap Gelmedim
                         ↓
              [ KVKK Şikâyet Dilekçesi Oluştur ]
```

---

## Akış 1 — İlk Ziyaret (Aktivasyon)

| Adım | Ekran | Kullanıcı Aksiyonu | Sistem Tepkisi |
|---|---|---|---|
| 1 | Landing Page | Sayfaya gelir | Hero başlık, skor CTA görünür |
| 2 | Landing Page | "Skorunu Öğren" butonuna basar | E-posta input alanı açılır |
| 3 | Skor Sayfası | E-posta adresini girer | HIBP API çağrısı başlar, yükleme animasyonu |
| 4 | Skor Sayfası | Bekler (maks. 3 sn) | Skor kartı render edilir |
| 5 | Skor Sayfası | Skoru görür | "Profilini tamamla" CTA çıkar |
| 6 | Onboarding | 5 soruyu yanıtlar | AI profil analizi başlar |
| 7 | Dashboard | Profil tamamlanır | Kişiselleştirilmiş öneri listesi görünür |

---

## Akış 2 — Dilekçe Üretme

| Adım | Ekran | Kullanıcı Aksiyonu | Sistem Tepkisi |
|---|---|---|---|
| 1 | Dashboard | "Dilekçe Oluştur" seçer | Dilekçe formu açılır |
| 2 | Form — Adım 1 | Şirket dropdown'dan seçer | DPO e-posta otomatik dolar |
| 3 | Form — Adım 2 | Ad, soyad, e-posta girer | Validation kontrol |
| 4 | Form — Adım 3 | Hak türü seçer: Sil / Bilgi Ver / Düzelt | — |
| 5 | Önizleme | "Dilekçeyi Oluştur" butonuna basar | AI dilekçeyi üretir (~5 sn) |
| 6 | Önizleme | Dilekçeyi okur, onaylar | 3 çıktı seçeneği aktif olur |
| 7a | — | "Kopyala" basar | Panoya kopyalanır |
| 7b | — | "PDF İndir" basar | PDF dosyası indirilir |
| 7c | — | "E-posta Gönder" basar | Agent e-postayı DPO'ya gönderir, onay gösterir |
| 8 | Takip | "30 Gün Takibini Başlat" sorusu | Evet → e-posta onayı → takip başlar |

---

## Akış 3 — Metin Analizörü

| Adım | Ekran | Kullanıcı Aksiyonu | Sistem Tepkisi |
|---|---|---|---|
| 1 | Analizör | URL yapıştırır VEYA metin yapıştırır | Input tipi otomatik algılanır |
| 2 | Analizör | "Analiz Et" basar | Scraping (URL ise) + AI analizi başlar |
| 3 | Sonuç | Bekler (~8 sn) | 5 soruluk Evet/Hayır kartı + Risk Skoru |
| 4 | Sonuç | Sonuçları okur | "Bu şirkete dilekçe gönder" CTA çıkar |

---

## Akış 4 — 30 Gün Takipçisi

| Adım | Ekran | Ne Olur? |
|---|---|---|
| Gün 0 | — | Dilekçe gönderildi, takip başladı |
| Gün 10 | E-posta | "Trendyol'a gönderdiğin talep hâlâ beklemede. Henüz bir yanıt aldın mı?" |
| Gün 25 | E-posta | "Son 5 gün! Cevap gelmediyse KVKK'ya şikâyet hakkın doğuyor." |
| Gün 30 | E-posta + Dashboard | "Sonuç ne oldu?" sorusu. Cevap Gelmedim → şikâyet dilekçesi üretilir |

---

## Hata Akışları

| Durum | Ne Gösterilir? |
|---|---|
| HIBP API yanıt vermez | "Sızıntı kontrolü şu an yapılamıyor, skor tahmini gösteriliyor" |
| Şirket listede yok | "Diğer" seçeneği — kullanıcı şirket adı + DPO e-postasını manuel girer |
| AI dilekçe üretemez | Sabit şablon gösterilir, "AI özelleştirme şu an mevcut değil" uyarısı |
| E-posta gönderilemez | "Gönderim başarısız. Dilekçeyi kopyalayıp kendin gönderebilirsin" + kopyala butonu |
