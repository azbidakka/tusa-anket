# TUSA Anket Sistemi - Özellikler

## ✅ Tamamlanan Özellikler

### Tema ve Marka
- ✅ TUSA renk paleti (#0A6A39, #084F2A, #1E7D4E)
- ✅ Poppins font ailesi
- ✅ Responsive tasarım (320px - 1440px)
- ✅ Mobil öncelikli yaklaşım
- ✅ 12px border-radius butonlar

### Güvenlik
- ✅ JWT tabanlı admin authentication
- ✅ Refresh token desteği
- ✅ Tekil token sistemi (anket başına)
- ✅ IP bazlı rate limiting (24s, 5 deneme)
- ✅ KVKK onay mekanizması
- ✅ Tekrar doldurma engeli

### Anket Sistemi
- ✅ 3 varsayılan anket (Ayaktan, Yatan, Genel)
- ✅ 8 soru tipi desteği:
  - Likert 1-5
  - NPS 0-10
  - Evet/Hayır
  - Kısa metin
  - Uzun metin
  - Tek seçim
  - Çoklu seçim
  - Tarih
- ✅ Bölüm bazlı anket yapısı
- ✅ İlerleme çubuğu
- ✅ Zorunlu alan kontrolü

### Link ve QR Yönetimi
- ✅ Tekil token üretimi
- ✅ Genel link seçeneği
- ✅ QR kod üretimi
- ✅ UTM parametre desteği
- ✅ Kanal takibi (SMS, WhatsApp, E-posta, QR)
- ✅ Link süre sonu kontrolü

### Raporlama
- ✅ Dashboard KPI'ları
  - Toplam doldurma
  - Aylık değişim %
  - Ortalama memnuniyet
  - Ortalama NPS
- ✅ Cevap listesi
- ✅ Filtreleme (tarih, anket, departman, doktor, kanal)
- ✅ Detay görüntüleme

### Yönetim Paneli
- ✅ Admin girişi
- ✅ Anket listesi
- ✅ Cevap listesi
- ✅ Ayarlar sayfası
- ✅ Departman yönetimi
- ✅ Doktor yönetimi

## 🚧 Geliştirilecek Özellikler

### Raporlama (İleri Seviye)
- ⏳ Grafik görselleştirmeleri (Recharts)
  - Aylık trend çizgi grafiği
  - Şablon bazlı dağılım
  - Topic tag ısı haritası
- ⏳ CSV/XLSX/PDF export
- ⏳ Metin analizi (anahtar kelime frekansı)
- ⏳ E-posta özeti (haftalık)

### Anket Oluşturucu
- ⏳ Drag & drop soru ekleme
- ⏳ Görünürlük koşulları
- ⏳ Anket önizleme
- ⏳ Anket kopyalama

### Güvenlik (Opsiyonel)
- ⏳ SMS-OTP doğrulama
- ⏳ reCAPTCHA v3 entegrasyonu
- ⏳ localStorage cihaz işareti

### Diğer
- ⏳ Logo yükleme (Firebase Storage)
- ⏳ Çoklu dil desteği
- ⏳ E-posta bildirimleri
- ⏳ Webhook entegrasyonları

## 📊 Teknik Detaylar

### Backend
- Node.js + Express
- Firebase Firestore
- JWT authentication
- Rate limiting
- QR kod üretimi

### Frontend
- React 18
- React Router v6
- TailwindCSS
- Axios
- Recharts (grafik için)

### Veritabanı Koleksiyonları
- `admin_users` - Yönetici kullanıcılar
- `survey_templates` - Anket şablonları
- `survey_links` - Anket linkleri
- `survey_responses` - Anket cevapları
- `response_items` - Cevap detayları
- `departments` - Departmanlar
- `doctors` - Doktorlar
- `settings` - Sistem ayarları

## 🎯 Kullanım Senaryoları

1. **Ayaktan Hasta**: QR kod ile hızlı anket
2. **Yatan Hasta**: SMS ile taburculuk sonrası anket
3. **Genel Memnuniyet**: E-posta ile periyodik anket
4. **Departman Bazlı**: Doktor ve departman kırılımı
5. **Kanal Analizi**: Hangi kanaldan daha çok dönüş var?
