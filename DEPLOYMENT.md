# TUSA Anket Sistemi - Deployment Rehberi

## Gereksinimler

- Node.js 18+
- Firebase projesi
- Cloudflare hesabı (domain yönetimi için)

## Firebase Kurulumu

1. Firebase Console'da yeni proje oluşturun
2. Firestore Database'i etkinleştirin
3. Service Account Key oluşturun:
   - Project Settings → Service Accounts
   - Generate New Private Key
   - JSON dosyasını indirin

4. `.env` dosyasını oluşturun:
```bash
cp backend/.env.example backend/.env
```

5. Firebase bilgilerini `.env` dosyasına ekleyin

## Veritabanı Seed

```bash
cd backend
npm install
node src/scripts/seedData.js
```

Bu komut:
- Admin kullanıcı oluşturur (admin@tusahastanesi.com / TusaAdmin2024!)
- 3 varsayılan anketi yükler
- Örnek departman ve doktorları ekler

## Domain Yapılandırması

### Cloudflare DNS

1. Cloudflare'de domain ekleyin: tusahastanesi.com
2. CNAME kaydı ekleyin:
   - Name: anket
   - Target: [hosting-provider-url]
   - Proxy: Enabled (turuncu bulut)

3. SSL/TLS ayarları:
   - Encryption mode: Full (strict)
   - Always Use HTTPS: On

## Production Build

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run build
```

Build dosyaları `frontend/dist` klasöründe oluşur.

## Hosting Seçenekleri

### Option 1: Firebase Hosting + Functions

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase init functions
firebase deploy
```

### Option 2: Vercel

```bash
npm install -g vercel
vercel --prod
```

### Option 3: Railway / Render

1. GitHub'a push edin
2. Railway/Render'da proje oluşturun
3. Environment variables ekleyin
4. Deploy edin

## Environment Variables (Production)

```
NODE_ENV=production
PORT=3000
JWT_SECRET=[güçlü-random-key]
JWT_REFRESH_SECRET=[güçlü-random-key]
FIREBASE_PROJECT_ID=[project-id]
FIREBASE_PRIVATE_KEY=[private-key]
FIREBASE_CLIENT_EMAIL=[client-email]
FRONTEND_URL=https://anket.tusahastanesi.com
SURVEY_DOMAIN=https://anket.tusahastanesi.com
```

## Güvenlik Kontrol Listesi

- [ ] JWT secret'ları güçlü ve unique
- [ ] Firebase private key güvenli
- [ ] CORS sadece production domain'e izin veriyor
- [ ] Rate limiting aktif
- [ ] HTTPS zorunlu
- [ ] Environment variables güvenli

## Monitoring

- Firebase Console'dan Firestore kullanımını izleyin
- Backend loglarını kontrol edin
- Hata raporlama servisi ekleyin (Sentry önerilir)

## Backup

Firestore otomatik backup:
```bash
firebase firestore:backup gs://[bucket-name]
```

## Destek

Sorun yaşarsanız:
1. Backend loglarını kontrol edin
2. Firebase Console'da hataları kontrol edin
3. Browser console'da frontend hatalarını kontrol edin
