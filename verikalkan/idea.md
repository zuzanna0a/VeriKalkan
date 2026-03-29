# VeriKalkan — Kişisel Veri Koruma Sistemi

## Proje Özeti
VeriKalkan, Türkiye'deki bireylerin dijital dünyada kişisel verilerini kontrol etmelerini ve KVKK haklarını kolayca kullanmalarını sağlayan bir web uygulamasıdır.

## Temel Özellikler

### 1. Dijital Sağlık Skoru
- Kullanıcının kaç yıldır internette olduğu
- Hangi platformları kullandığı
- Bu platformlarda veri sızıntısı yaşanıp yaşanmadığı bilgilerine göre 0-100 arası risk skoru hesaplanır

### 2. AI Destekli Veri Sızıntısı Analizi
- Groq API kullanılarak analiz yapılır
- Kullanıcının seçtiği platformlar ve internet kullanım süresi baz alınır
- Gerçek sızıntı verileriyle karşılaştırılır
- Sonuçlar Supabase'e cache'lenir (7 gün)

### 3. KVKK Dilekçe Üreticisi
- Veri silme, bilgi edinme, itiraz gibi dilekçe türleri
- Groq/Grok AI ile saniyeler içinde üretilir
- PDF olarak indirilebilir
- mailto: linki ile kullanıcının kendi mail uygulamasından gönderilebilir
- 25+ Türk platformunun KVKK mail adresi sistemde kayıtlı

### 4. Gizlilik Politikası Analizörü
- Şirketlerin gizlilik metinleri AI ile analiz edilir
- "Verilerim satılıyor mu?", "Konum takibi var mı?" gibi sorulara net yanıtlar verilir

### 5. Saye — AI Asistanı
- Tüm sayfalarda aktif
- KVKK ve dijital güvenlik konularında rehberlik
- Kullanıcının breach analiz sonuçlarını bilerek kişiselleştirilmiş yanıtlar verir

### 6. Oyunlaştırma Sistemi
- Kullanıcı aksiyonlarına göre puan kazanılır
- Dijital Dedektif → Veri Ustası rozet sistemi
- Pixel art rozet tasarımları

### 7. 30 Günlük Yasal Takip
- Dilekçe gönderildikten sonra otomatik takip
- 30 günlük yasal süre bildirimi

## Teknik Stack
- Frontend: Next.js 14, React, Tailwind CSS
- Backend: Next.js API Routes
- Veritabanı: Supabase (PostgreSQL)
- AI: Groq API (LLaMA modeli)
- Mail: mailto: protokolü (client-side)
- Deploy: Vercel
- Tema: Dark/Light mode, Pixel Art estetik

## Hedef Kitle
Türkiye'de yaşayan, dijital haklarını öğrenmek ve kullanmak isteyen bireyler
