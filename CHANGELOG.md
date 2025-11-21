# Changelog

## [1.0.0] - 2024-11-20

### ✨ İlk Sürüm

#### Eklenen Özellikler

**Tema ve Marka**
- TUSA renk paleti implementasyonu (#0A6A39, #084F2A, #1E7D4E)
- Poppins font ailesi entegrasyonu
- Responsive tasarım (320px - 1440px)
- TailwindCSS özel tema yapılandırması

**Güvenlik**
- JWT tabanlı authentication sistemi
- Refresh token mekanizması
- Tekil token sistemi (anket başına)
- IP bazlı rate limiting (5 deneme/24s)
- KVKK onay mekanizması
- Tekrar doldurma engeli
- Helmet.js güvenlik başlıkları

**Anket Sistemi**
- 3 varsayılan anket (Ayaktan, Yatan, Genel Memnuniyet)
- 8 soru tipi desteği (Likert, NPS, Evet/Hayır, metin, çoktan seçmeli, tarih)
- Bölüm bazlı anket yapısı
- İlerleme çubuğu
- Zorunlu alan kontrolü
- Dinamik soru render sistemi

**Link ve QR Yönetimi**
- Tekil token üretimi (nanoid)
- Genel link seçeneği
- QR kod üretimi (server-side)
- UTM parametre desteği
- Kanal takibi (SMS, WhatsApp, E-posta, QR)
- Link süre sonu kontrolü

**Raporlama**
- Dashboard KPI'ları (toplam, değişim %, ort. memnuniyet, ort. NPS)
- Cevap listesi
- Detay görüntüleme
- Filtreleme (tarih, anket, departman, doktor, kanal)
- Analitik fonksiyonları

**Yönetim Paneli**
- Admin authentication
- Anket listesi ve yönetimi
- Cevap listesi
- Ayarlar sayfası
- Departman yönetimi
- Doktor yönetimi

**API Endpoints**
- `/api/auth/*` - Authentication
- `/api/surveys/*` - Anket CRUD
- `/api/responses/*` - Cevap listesi ve istatistikler
- `/api/links/*` - Link/QR üretimi
- `/api/settings/*` - Ayarlar
- `/api/public/*` - Public anket erişimi

**Dokümantasyon**
- README.md - Genel bakış
- QUICKSTART.md - Hızlı başlangıç rehberi
- FEATURES.md - Detaylı özellik listesi
- API.md - API dokümantasyonu
- TESTING.md - Test senaryoları
- DEPLOYMENT.md - Production deployment rehberi
- PROJECT_SUMMARY.md - Proje özeti

**Geliştirme Araçları**
- Seed script (varsayılan veriler)
- Mock Firestore (geliştirme modu)
- Environment variable yönetimi
- Axios interceptors (token refresh)
- Error handling middleware

#### Teknik Detaylar

**Frontend**
- React 18.2.0
- React Router 6.21.1
- TailwindCSS 3.4.1
- Axios 1.6.5
- Vite 5.0.11

**Backend**
- Node.js + Express 4.18.2
- Firebase Admin SDK 12.0.0
- JWT authentication
- bcryptjs password hashing
- QRCode generation
- Rate limiting

**Veritabanı**
- Firebase Firestore
- 8 koleksiyon (templates, links, responses, items, users, departments, doctors, settings)

#### Bilinen Sınırlamalar

- CSV/XLSX/PDF export henüz implement edilmedi
- Grafik görselleştirmeleri (Recharts) hazır ama kullanılmıyor
- SMS-OTP doğrulama ayar olarak var ama implement edilmedi
- E-posta bildirimleri implement edilmedi
- Anket oluşturucu UI basit (drag & drop yok)

#### Sonraki Sürüm İçin Planlanan

- [ ] CSV/XLSX/PDF export
- [ ] Grafik görselleştirmeleri
- [ ] SMS-OTP entegrasyonu
- [ ] E-posta bildirimleri
- [ ] Gelişmiş anket oluşturucu
- [ ] Metin analizi (anahtar kelime)
- [ ] Webhook entegrasyonları
- [ ] Çoklu dil desteği

---

## Versiyon Notları

### Semantic Versioning
Bu proje [Semantic Versioning](https://semver.org/) kullanır:
- MAJOR: Geriye uyumsuz değişiklikler
- MINOR: Geriye uyumlu yeni özellikler
- PATCH: Geriye uyumlu hata düzeltmeleri

### Değişiklik Kategorileri
- ✨ **Eklenen**: Yeni özellikler
- 🔧 **Değiştirilen**: Mevcut özelliklerde değişiklikler
- 🐛 **Düzeltilen**: Hata düzeltmeleri
- 🗑️ **Kaldırılan**: Kaldırılan özellikler
- 🔒 **Güvenlik**: Güvenlik güncellemeleri
- 📝 **Dokümantasyon**: Dokümantasyon değişiklikleri
