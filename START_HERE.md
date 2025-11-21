# 🚀 TUSA Anket Sistemi - Başlangıç Rehberi

## ✅ Sistem Durumu: ÇALIŞIYOR!

Backend ve Frontend başarıyla çalışıyor:
- ✅ Backend: http://localhost:3000 (ÇALIŞIYOR)
- ✅ Frontend: http://localhost:5173 (ÇALIŞIYOR)
- ✅ Veritabanı: Mock mode (geliştirme için hazır)
- ✅ Seed: Otomatik (backend başlangıcında)
- ✅ Login: Test edildi ve çalışıyor!

## 🎯 Hızlı Test

### 1. Admin Panele Giriş
```
URL: http://localhost:5173/login
Email: admin@tusahastanesi.com
Şifre: TusaAdmin2024!
```

### 2. Anket Doldurma (Test)
```
Ayaktan Hasta: http://localhost:5173/s/ayaktan-hasta
Yatan Hasta: http://localhost:5173/s/yatan-hasta
Genel Memnuniyet: http://localhost:5173/s/genel-memnuniyet
```

## 📋 Çalışan Servisler

### Backend (Port 3000)
- ✅ Express server çalışıyor
- ✅ Firebase mock mode aktif
- ✅ API endpoints hazır
- ✅ Rate limiting aktif
- ✅ JWT authentication hazır

### Frontend (Port 5173)
- ✅ Vite dev server çalışıyor
- ✅ React app yüklendi
- ✅ TailwindCSS tema aktif
- ✅ Routing yapılandırıldı

## 🔧 Servis Yönetimi

### Servisleri Durdurma
Terminallerde `Ctrl+C` tuşlarına basın.

### Servisleri Yeniden Başlatma

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

## 📊 Test Senaryoları

### Senaryo 1: Admin Login
1. http://localhost:5173/login adresine git
2. Email: admin@tusahastanesi.com
3. Şifre: TusaAdmin2024!
4. "Giriş Yap" butonuna tıkla
5. ✅ Dashboard'a yönlendirilmelisin

### Senaryo 2: Anket Listesi
1. Admin panelde "Anketler" menüsüne tıkla
2. ✅ 3 anket görmelisin:
   - Ayaktan Hasta Anketi
   - Yatan Hasta Anketi
   - Genel Memnuniyet Anketi

### Senaryo 3: Link Oluşturma
1. Bir anketin yanındaki "Link Oluştur" butonuna tıkla
2. ✅ Yeni bir link oluşturulmalı
3. Linki kopyala ve yeni sekmede aç
4. ✅ Anket formu açılmalı

### Senaryo 4: Anket Doldurma
1. http://localhost:5173/s/ayaktan-hasta adresine git
2. KVKK onay kutusunu işaretle
3. Soruları doldur (Likert, NPS, metin)
4. "İlerle" ve "Gönder" butonlarını kullan
5. ✅ Teşekkür sayfasına yönlendirilmelisin

### Senaryo 5: Dashboard KPI'ları
1. Admin panelde "Dashboard" menüsüne git
2. ✅ KPI kartlarını görmelisin:
   - Bu Ay Toplam
   - Ort. Memnuniyet
   - Ort. NPS
   - Aktif Anketler

## 🐛 Sorun Giderme

### Backend Çalışmıyor
```bash
# Port kontrolü
netstat -ano | findstr :3000

# Eğer port kullanımdaysa, process'i sonlandır
taskkill /PID [PID] /F

# Backend'i yeniden başlat
cd backend
npm run dev
```

### Frontend Çalışmıyor
```bash
# Port kontrolü
netstat -ano | findstr :5173

# Eğer port kullanımdaysa, process'i sonlandır
taskkill /PID [PID] /F

# Frontend'i yeniden başlat
cd frontend
npm run dev
```

### CORS Hatası
Frontend proxy ayarları `frontend/vite.config.js` dosyasında tanımlı.
Backend otomatik olarak `http://localhost:5173` adresine izin veriyor.

### Firebase Hatası
Geliştirme modunda Firebase olmadan çalışır (mock mode).
Production için Firebase kurulumu gerekli (DEPLOYMENT.md).

## 📚 Dokümantasyon

- **README.md** - Genel bakış ve özellikler
- **QUICKSTART.md** - Detaylı kurulum rehberi
- **API.md** - API endpoint dokümantasyonu
- **TESTING.md** - Test senaryoları ve checklist
- **DEPLOYMENT.md** - Production deployment rehberi
- **FEATURES.md** - Tüm özellikler listesi
- **PROJECT_SUMMARY.md** - Proje özeti

## 🎨 Özellikler

### Tamamlanan
- ✅ TUSA marka kimliği (renk, font)
- ✅ 3 varsayılan anket
- ✅ 8 soru tipi
- ✅ JWT authentication
- ✅ Link/QR üretimi
- ✅ Dashboard KPI'ları
- ✅ KVKK onay sistemi
- ✅ Rate limiting
- ✅ Responsive tasarım

### Geliştirilecek (Opsiyonel)
- ⏳ Grafik görselleştirmeleri
- ⏳ CSV/XLSX/PDF export
- ⏳ SMS-OTP doğrulama
- ⏳ E-posta bildirimleri

## 🚀 Sonraki Adımlar

1. ✅ Sistemi test et (yukarıdaki senaryolar)
2. 📊 Dashboard'da verileri incele
3. 📝 Yeni anket oluştur (opsiyonel)
4. 🔗 Link/QR üret ve test et
5. 📈 Cevapları görüntüle

## 💡 İpuçları

- **Mock Mode**: Firebase olmadan çalışır, veriler bellekte tutulur
- **Hot Reload**: Kod değişiklikleri otomatik yüklenir
- **Browser DevTools**: F12 ile hataları kontrol edebilirsin
- **API Test**: Postman veya curl ile API'yi test edebilirsin

## 📞 Yardım

Sorun yaşarsan:
1. Terminal loglarını kontrol et
2. Browser console'u kontrol et (F12)
3. TESTING.md dosyasındaki senaryoları dene
4. Backend health check: http://localhost:3000/health

---

**Sistem Hazır! Test etmeye başlayabilirsin! 🎉**
