# Domain Kurulum Rehberi

## Adım 1 — Domain Satın Al
- Namecheap.com → verikalkan.com → ~$10/yıl
- Cloudflare.com → daha ucuz seçenek

## Adım 2 — Resend'e Domain Ekle
1. resend.com/domains → "Add Domain"
2. Domain adını gir: verikalkan.com
3. Sana 3 DNS kaydı verecek (TXT, MX, DKIM)

## Adım 3 — DNS Kayıtlarını Ekle
Namecheap → Advanced DNS → Add Record:
- TXT kaydı → Resend'in verdiği değer
- MX kaydı → Resend'in verdiği değer  
- DKIM → Resend'in verdiği değer

## Adım 4 — .env.local Güncelle
RESEND_FROM_EMAIL=noreply@verikalkan.com

## Adım 5 — Verify
Resend dashboard → Domain → "Verify" butonuna bas
Yeşil onay işareti çıkınca hazır!

Tahmini süre: 30 dakika (DNS yayılması 24 saate kadar sürebilir)
