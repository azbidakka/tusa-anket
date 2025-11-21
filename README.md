# TUSA Anket Sistemi

TUSA Hospital için kapsamlı hasta memnuniyet anket yönetim sistemi.

## 🎯 Özellikler

- 🎨 **TUSA Marka Kimliği**: Özel renk paleti (#0A6A39) ve Poppins font
- 📱 **Mobil Öncelikli**: 320px'den 1440px'e tam responsive
- 🔒 **Güvenlik**: JWT auth, tekil token, rate limiting, KVKK uyumlu
- 📊 **Raporlama**: Dashboard KPI'ları, filtreleme, analitik
- 🔗 **Link/QR Yönetimi**: Otomatik token üretimi, kanal takibi, UTM desteği
- 📝 **8 Soru Tipi**: Likert 1-5, NPS 0-10, Evet/Hayır, metin, çoktan seçmeli
- 🏥 **3 Varsayılan Anket**: Ayaktan, Yatan, Genel Memnuniyet

## 🚀 Hızlı Başlangıç

```bash
# Tüm bağımlılıkları yükle
npm install

# Backend ve Frontend'i başlat
npm run dev
```

**Erişim**:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Admin Panel: http://localhost:5173/admin

**Varsayılan Admin**:
- Email: admin@tusahastanesi.com
- Şifre: TusaAdmin2024!

## 📚 Dokümantasyon

- [QUICKSTART.md](QUICKSTART.md) - Detaylı kurulum rehberi
- [FEATURES.md](FEATURES.md) - Tüm özellikler listesi
- [API.md](API.md) - API endpoint dokümantasyonu
- [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment
- [TESTING.md](TESTING.md) - Test senaryoları

## 🏗️ Proje Yapısı

```
tusa-survey-system/
├── frontend/          # React + TailwindCSS
│   ├── src/
│   │   ├── pages/     # Sayfa bileşenleri
│   │   ├── components/# Yeniden kullanılabilir bileşenler
│   │   ├── context/   # React Context (Auth)
│   │   └── config/    # Axios yapılandırması
├── backend/           # Node.js + Express
│   ├── src/
│   │   ├── routes/    # API rotaları
│   │   ├── middleware/# Auth, rate limit
│   │   ├── config/    # Firebase config
│   │   └── scripts/   # Seed script
└── shared/            # Ortak sabitler ve tipler
```

## 🛠️ Teknolojiler

**Frontend**:
- React 18 + React Router v6
- TailwindCSS (TUSA tema)
- Axios (API client)
- Recharts (grafikler)

**Backend**:
- Node.js + Express
- Firebase Firestore
- JWT Authentication
- QRCode generation
- Rate limiting

## 📦 Veritabanı Seed

```bash
cd backend
node src/scripts/seedData.js
```

Bu komut oluşturur:
- ✅ Admin kullanıcı
- ✅ 3 varsayılan anket (Ayaktan, Yatan, Genel)
- ✅ Örnek departman ve doktorlar
- ✅ Sistem ayarları

## 🌐 Domain Yapılandırması

**Production**: anket.tusahastanesi.com

Cloudflare DNS:
```
Type: CNAME
Name: anket
Target: [hosting-url]
Proxy: Enabled
SSL: Full (strict)
```

## 🔐 Güvenlik Özellikleri

- ✅ JWT token authentication
- ✅ Refresh token desteği
- ✅ Tekil token sistemi (anket başına)
- ✅ IP bazlı rate limiting (5 deneme/24s)
- ✅ KVKK onay mekanizması
- ✅ Tekrar doldurma engeli
- ✅ HTTPS zorunlu (production)

## 📊 Varsayılan Anketler

### 1. Ayaktan Hasta Anketi
- Kayıt & Karşılama
- Hekim Görüşmesi
- Fiziksel Ortam
- Genel Değerlendirme

### 2. Yatan Hasta Anketi
- Hemşirelik Hizmetleri
- Hekim Hizmetleri
- Oda & Yemek
- Genel Değerlendirme

### 3. Genel Memnuniyet Anketi
- Hizmet Kalitesi
- İletişim
- Erişilebilirlik
- Genel Değerlendirme

## 🧪 Test

```bash
# Manuel test senaryoları
# Detaylar için TESTING.md dosyasına bakın

# Örnek test akışı:
1. Admin panele giriş
2. Anket oluştur
3. Link/QR üret
4. Anketi doldur
5. Dashboard'da sonuçları gör
```

## 📈 Raporlama

Dashboard KPI'ları:
- Bu ay toplam doldurma
- Geçen aya göre % değişim
- Ortalama memnuniyet (1-5)
- Ortalama NPS (0-10)

Filtreler:
- Tarih aralığı
- Anket şablonu
- Departman
- Doktor
- Kanal (SMS/WhatsApp/E-posta/QR)

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing`)
3. Commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Push edin (`git push origin feature/amazing`)
5. Pull Request açın

## 📝 Lisans

Bu proje TUSA Hospital için özel olarak geliştirilmiştir.

## 📞 Destek

Sorun yaşarsanız:
1. [TESTING.md](TESTING.md) dosyasındaki test senaryolarını kontrol edin
2. Backend loglarını inceleyin
3. Browser console'da hataları kontrol edin
4. Firebase Console'da veritabanı durumunu kontrol edin

## 🎉 Teşekkürler

TUSA Hospital ekibine güvenleri için teşekkürler!
