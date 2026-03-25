# ⚙️ tech-stack.md — Teknoloji Seçimleri

## Özet Tablo

| Katman | Araç | Neden? | Maliyet |
|---|---|---|---|
| Frontend | Next.js 14 (App Router) | Cursor ile en iyi çalışan framework, Vercel'e 1 tıkla deploy | Ücretsiz |
| Stil | Tailwind CSS + shadcn/ui | Hazır bileşenler, Cursor AI'ı iyi biliyor | Ücretsiz |
| AI Motoru | Google Gemini 1.5 Flash/Pro | Ücretsiz tier yeterli, Türkçe güçlü | Ücretsiz (başlangıç) |
| Breach API | HaveIBeenPwned v3 | Dünya standardı, k-anonymity ile gizli | Ücretsiz (5 req/dk) |
| E-posta (Agent) | Resend | En kolay kurulum, 3.000 e-posta/ay ücretsiz | Ücretsiz |
| Veritabanı | Supabase (PostgreSQL) | Ücretsiz tier, auth dahil, EU sunucusu | Ücretsiz |
| PDF Üretimi | jsPDF | Tarayıcıda çalışır, kurulum basit | Ücretsiz |
| Hosting / Deploy | Vercel | GitHub'a push = otomatik deploy | Ücretsiz |
| Zamanlayıcı (cron) | Vercel Cron Jobs | 30 gün takip e-postaları için | Ücretsiz |

**Toplam MVP maliyeti: 0 TL** (tüm araçlar ücretsiz tier ile çalışır)

---

## Detaylı Kararlar

### Neden Next.js, düz HTML değil?
Cursor AI, Next.js projelerinde çok daha iyi kod üretiyor. "Agent modu" ile component bazlı geliştirme yapılabiliyor. Ayrıca Vercel'e deploy etmek tek tıkla oluyor. Dezavantaj yok.

### Neden Gemini, ChatGPT değil?
- **Maliyet:** Gemini 1.5 Flash ücretsiz tier'ı çok cömert (dakikada 15 istek)
- **Türkçe:** Gemini'nin Türkçe performansı GPT-3.5'ten iyi
- **Uzun metin:** Gemini 1.5 Pro'nun 1 milyon token context penceresi var — gizlilik politikalarını direkt okuyabilir
- **Google AI Studio:** API anahtarı almak 2 dakika sürüyor: https://aistudio.google.com

### Neden Resend e-posta için?
- Kurulum: 10 satır kod
- Ücretsiz: 3.000 e-posta/ay
- Alternatif (NodeMailer + Gmail): Domain doğrulaması, spam filtresi sorunları, daha karmaşık

### E-posta gönderimi nasıl çalışacak?
Agent kendi "noreply@verikalkan.com" adresinden gönderir.
- Kullanıcının Gmail şifresi veya izni gerekmez
- DPO adresine dilekçeyi gönderir
- "Gönderen: VeriKalkan adına [Kullanıcı Adı]" ibaresi yer alır
- Kullanıcı CC'ye eklenir (kendi de bir kopyasını alır)

---

## Kurulum Sırası (Gün 5 için)

```
1. Node.js indir → https://nodejs.org (LTS versiyonu)
2. VS Code indir → https://code.visualstudio.com
3. Cursor indir → https://cursor.com
4. GitHub hesabı aç → https://github.com
5. Vercel hesabı aç (GitHub ile) → https://vercel.com
6. Supabase hesabı aç → https://supabase.com (EU - Frankfurt bölgesi seç)
7. Google AI Studio → API anahtarı al → https://aistudio.google.com
8. Resend hesabı aç → API anahtarı al → https://resend.com
```

---

## API Anahtarları — Nereye Konulur?

Proje kök dizininde `.env.local` adlı bir dosya oluştur (GitHub'a yükleme, Cursor'da sakla):

```bash
# Google Gemini
GEMINI_API_KEY=AIzaSy...

# HaveIBeenPwned (isteğe bağlı, ücretsiz tier anahtarsız da çalışır)
HIBP_API_KEY=...

# Resend (e-posta gönderimi)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@verikalkan.com

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

⚠️ `.env.local` dosyasını asla GitHub'a yükleme. `.gitignore` dosyasına eklenmesi gerekiyor — Cursor bunu otomatik yapıyor.

---

## Vercel'e Deploy (Gün 6 sonu)

1. GitHub reposunu Vercel'e bağla (vercel.com/new)
2. Vercel dashboard'unda "Environment Variables" bölümüne .env.local içindeki değerleri ekle
3. Her `git push` otomatik deploy tetikler

---

## Gelecek Sprint için Notlar

| Özellik | Araç | Ne Zaman? |
|---|---|---|
| Türkiye Veri Haritası | Recharts + Supabase aggregate queries | Sprint 2 |
| Konuşma belleği | Supabase'de mesaj geçmişi | Sprint 2 |
| n8n otomasyonu | n8n.io self-hosted veya cloud | Sprint 3 |
| Mobil uygulama | React Native (Expo) | Sprint 4+ |
