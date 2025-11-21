# TUSA Anket Sistemi - Hızlı Başlangıç

## 1. Kurulum

```bash
# Tüm bağımlılıkları yükle
npm install

# Backend bağımlılıkları
cd backend && npm install

# Frontend bağımlılıkları
cd ../frontend && npm install
```

## 2. Environment Ayarları

```bash
# Backend .env dosyası oluştur
cp backend/.env.example backend/.env
```

Geliştirme için Firebase olmadan çalışabilir (mock mode).

## 3. Veritabanı Seed (Opsiyonel)

```bash
cd backend
node src/scripts/seedData.js
```

Bu komut:
- Admin kullanıcı: admin@tusahastanesi.com / TusaAdmin2024!
- 3 varsayılan anket
- Örnek departman ve doktorlar

## 4. Uygulamayı Başlat

### Windows için Ayrı Terminaller (Önerilen):

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Alternatif - Tek Komut (Linux/Mac):
```bash
npm run dev
```

**Not**: Windows'ta `npm run dev` komutu çalışmazsa yukarıdaki ayrı terminal yöntemini kullanın.

## 5. Erişim

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Admin Panel**: http://localhost:5173/admin
- **Login**: admin@tusahastanesi.com / TusaAdmin2024!

## 6. Test Anketi

1. Admin panele giriş yap
2. Anketler → "Ayaktan Hasta Anketi"
3. "Link Oluştur" butonuna tıkla
4. Oluşan linki yeni sekmede aç
5. Anketi doldur
6. Dashboard'da sonuçları gör

## Örnek Anket URL'leri

Seed sonrası oluşan anketler:
- http://localhost:5173/s/ayaktan-hasta
- http://localhost:5173/s/yatan-hasta
- http://localhost:5173/s/genel-memnuniyet

## Sorun Giderme

### Port zaten kullanımda
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# Backend portunu değiştir
# backend/.env dosyasında PORT=3001
```

### Firebase hatası
Geliştirme modunda Firebase olmadan çalışır (mock mode).
Production için Firebase kurulumu gerekli.

### CORS hatası
Frontend proxy ayarları `frontend/vite.config.js` dosyasında.

## Sonraki Adımlar

1. ✅ Sistemi test edin
2. 📊 Dashboard'da KPI'ları görün
3. 📝 Yeni anket oluşturun
4. 🔗 Link/QR üretin
5. 📈 Raporları inceleyin

## Daha Fazla Bilgi

- `README.md` - Genel bilgiler
- `FEATURES.md` - Özellik listesi
- `DEPLOYMENT.md` - Production deployment
- `backend/src/routes/` - API endpoint'leri
- `frontend/src/pages/` - Sayfa bileşenleri
