# 🐙 github-rehberi.md — Sıfırdan GitHub ve Deploy

> GitHub hiç kullanmadıysan bu rehber senin için. Terminal komutu yok, her adım ekran görüntüsü gibi anlatılıyor.

---

## GitHub Nedir? (1 dakika)

GitHub = kodun için bir **bulut klasörü** + versiyon geçmişi.
- Bilgisayarında bir şeyi değiştirirsin → GitHub'a "kaydet" dersin → Vercel otomatik güncellenir
- Yanlışlıkla bir şeyi silersen → eski haline dönersin
- Cursor, GitHub ile direkt konuşur

---

## BÖLÜM 1 — Hesap Aç (5 dakika)

1. https://github.com adresine git
2. "Sign up" butonuna bas
3. E-posta, şifre, kullanıcı adı gir (kullanıcı adın URL'de görünür: github.com/KULLANICI_ADIN)
4. "Free" planı seç
5. E-posta doğrulamasını yap

---

## BÖLÜM 2 — İlk Repo'yu Oluştur (3 dakika)

1. GitHub'a giriş yap
2. Sağ üstteki **"+"** ikonuna bas → **"New repository"** seç
3. Doldur:
   - **Repository name:** `verikalkan`
   - **Description:** `Türkiye'nin KVKK Veri Hakları Asistanı`
   - **Public** seç (ödev için gerekli)
   - **"Add a README file"** kutusunu işaretle
4. **"Create repository"** butonuna bas
5. Ekranda bir URL göreceksin: `https://github.com/KULLANICI_ADIN/verikalkan` → bunu kaydet

---

## BÖLÜM 3 — Cursor ile GitHub'ı Bağla (10 dakika)

### Adım 1: Git'i Kur
Git = GitHub'la konuşmayı sağlayan program.
- https://git-scm.com/downloads adresine git
- İşletim sisteminize göre indir ve kur (hep "Next" de, değiştirme)

### Adım 2: Cursor'da Terminali Aç
- Cursor'u aç
- Üst menü: **Terminal → New Terminal**
- Alt kısımda siyah bir ekran açılır — bu terminal

### Adım 3: Kendini Tanıt (sadece bir kez)
Terminale şunları yaz (Enter'a bas):
```bash
git config --global user.name "Adın Soyadın"
git config --global user.email "github@emailin.com"
```

### Adım 4: Projeyi GitHub'a Bağla
Cursor'da proje klasörünün terminali açıkken şunları sırayla yaz:
```bash
git init
git add .
git commit -m "İlk yükleme"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADIN/verikalkan.git
git push -u origin main
```
Her satırı ayrı ayrı yaz, Enter'a bas, bir sonrakini yaz.

Son komuttan sonra GitHub kullanıcı adı ve şifren sorulabilir.
⚠️ Şifre yerine **Personal Access Token** gerekiyor:
- GitHub → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
- "Generate new token" → tüm repo yetkilerini seç → kopyala
- Şifre sorulunca bu token'ı yapıştır

---

## BÖLÜM 4 — Her Gün Nasıl Push Yapılır? (2 dakika)

Kod yazıp değişiklik yaptıktan sonra terminale şunu yaz:
```bash
git add .
git commit -m "bugün ne yaptığını buraya yaz"
git push
```

**Örnekler:**
```bash
git commit -m "Dilekçe sayfası tamamlandı"
git commit -m "Skor renkleri düzeltildi"
git commit -m "Mobil uyum eklendi"
```

Bu üç komut = "kaydet ve yükle" demek. Her gün en az bir kez yap.

---

## BÖLÜM 5 — Vercel ile Otomatik Deploy (10 dakika)

Bir kez kur, sonra her push = otomatik yayın.

1. https://vercel.com adresine git
2. **"Sign Up"** → **"Continue with GitHub"** seç
3. GitHub hesabınla giriş yap
4. **"Add New → Project"** butonuna bas
5. Sol tarafta GitHub repoların görünür → **"verikalkan"** yanındaki **"Import"** butonuna bas
6. **"Environment Variables"** bölümüne git:
   - Her `.env.local` değişkenini buraya ekle (GEMINI_API_KEY, RESEND_API_KEY vb.)
7. **"Deploy"** butonuna bas
8. 2-3 dakika sonra `https://verikalkan.vercel.app` linkin hazır!

Artık her `git push` yaptığında Vercel otomatik güncelleniyor. Hiçbir şey yapmana gerek yok.

---

## BÖLÜM 6 — Ödev için GitHub'a Dosya Yükleme (1 dakika)

README.md, idea.md, user-flow.md, tech-stack.md dosyalarını GitHub'a yüklemek için:

**Yöntem A — Terminal (hızlı):**
```bash
git add .
git commit -m "Dokümanlar eklendi"
git push
```

**Yöntem B — Web arayüzü (terminal bilmiyorsan):**
1. GitHub'da reponun sayfasına git
2. "Add file → Upload files" butonuna bas
3. Dosyaları sürükle bırak
4. "Commit changes" butonuna bas

---

## BÖLÜM 7 — Sorun Giderme

| Sorun | Çözüm |
|---|---|
| "git: command not found" | Git kurulmamış, bölüm 3 adım 1'e dön |
| "Permission denied" | Token'ı yanlış girdin, tekrar dene |
| "Repository not found" | URL'yi kontrol et, büyük/küçük harf |
| Push'tan sonra Vercel güncellenmiyor | Vercel dashboard'unda "Deployments" sekmesini kontrol et |
| .env.local GitHub'a yüklendi | Hemen GitHub'dan sil! Settings → Secrets & Variables'a taşı |

---

## Hatırlatıcı — Her Gün Yapılacaklar

```
Sabah:  Cursor'u aç, projeyi aç
Akşam: git add . && git commit -m "bugün ne yaptım" && git push
```

Bu kadar. GitHub'da her gün yeşil kare görürsün. 🟩
