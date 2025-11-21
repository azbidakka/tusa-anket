# TUSA Anket Sistemi - Test Senaryoları

## Kabul Kriterleri Test Listesi

### 1. Admin - Anket Şablonu Oluşturma ✅

**Senaryo**: Admin yeni bir anket şablonu oluşturabilmeli

**Adımlar**:
1. Admin panele giriş yap (admin@tusahastanesi.com / TusaAdmin2024!)
2. "Anketler" menüsüne git
3. "Yeni Anket" butonuna tıkla
4. Anket bilgilerini doldur
5. Soru ekle
6. Kaydet

**Beklenen Sonuç**: Anket başarıyla oluşturulmalı ve listede görünmeli

---

### 2. Admin - Link/QR Üretimi ✅

**Senaryo**: Admin tek tıkla link ve QR üretebilmeli

**Adımlar**:
1. Anketler sayfasında bir anket seç
2. "Link Oluştur" butonuna tıkla
3. Kanal seç (SMS/WhatsApp/E-posta/QR)
4. UTM parametreleri ekle (opsiyonel)
5. Oluştur

**Beklenen Sonuç**: 
- Tekil token içeren link oluşmalı
- QR kod görüntülenmeli
- Link kopyalanabilir olmalı

---

### 3. Hasta - KVKK Onayı Kontrolü ✅

**Senaryo**: KVKK onayı olmadan anket gönderilemez

**Adımlar**:
1. Anket linkini aç
2. Soruları doldur
3. KVKK checkbox'ını işaretleme
4. "Gönder" butonuna tıkla

**Beklenen Sonuç**: "KVKK onayı gereklidir" hatası gösterilmeli

---

### 4. Hasta - Zorunlu Alan Kontrolü ✅

**Senaryo**: Zorunlu alanlar doldurulmadan gönderim yapılamaz

**Adımlar**:
1. Anket linkini aç
2. Bazı zorunlu alanları boş bırak
3. "Gönder" butonuna tıkla

**Beklenen Sonuç**: "Zorunlu alanları doldurunuz" uyarısı gösterilmeli

---

### 5. Güvenlik - Tekrar Doldurma Engeli ✅

**Senaryo**: Aynı token ile ikinci kez anket doldurulamaz

**Adımlar**:
1. Tokenlı link ile anketi doldur ve gönder
2. Aynı linki tekrar aç
3. Anketi doldurmaya çalış

**Beklenen Sonuç**: "Bu anket zaten doldurulmuş." hatası gösterilmeli

---

### 6. Güvenlik - Token Kontrolü ✅

**Senaryo**: Geçersiz token ile anket açılamaz

**Adımlar**:
1. Anket URL'sine geçersiz token ekle
2. Sayfayı aç

**Beklenen Sonuç**: "Geçersiz bağlantı" hatası gösterilmeli

---

### 7. Dashboard - KPI Hesaplamaları ✅

**Senaryo**: Dashboard'da KPI'lar doğru hesaplanmalı

**Test Verileri**:
- Bu ay: 10 cevap, ort. memnuniyet 4.2, ort. NPS 8.5
- Geçen ay: 8 cevap

**Beklenen Sonuç**:
- Toplam: 10
- Değişim: +25%
- Ort. Memnuniyet: 4.2
- Ort. NPS: 8.5

---

### 8. Raporlama - Filtreleme ✅

**Senaryo**: Cevap listesi filtrelenebilmeli

**Adımlar**:
1. Cevaplar sayfasına git
2. Tarih aralığı seç
3. Departman seç
4. Kanal seç
5. Filtrele

**Beklenen Sonuç**: Sadece filtreye uyan cevaplar listelenmeli

---

### 9. Raporlama - Dışa Aktarım ⏳

**Senaryo**: Cevaplar CSV/XLSX/PDF olarak dışa aktarılabilmeli

**Adımlar**:
1. Cevaplar sayfasında filtre uygula
2. "Dışa Aktar" butonuna tıkla
3. Format seç (CSV/XLSX/PDF)
4. İndir

**Beklenen Sonuç**: Filtrelenmiş veriler seçilen formatta indirilmeli

---

### 10. Tema - TUSA Renk Paleti ✅

**Senaryo**: Tüm sayfalarda TUSA renkleri kullanılmalı

**Kontrol Noktaları**:
- Primary: #0A6A39
- Primary Dark: #084F2A
- Accent: #1E7D4E
- Border radius: 12px
- Font: Poppins

**Beklenen Sonuç**: Tüm bileşenler tema renklerini kullanmalı

---

### 11. Responsive - Mobil Uyumluluk ✅

**Senaryo**: Tüm sayfalar mobilde düzgün görünmeli

**Test Cihazları**:
- iPhone SE (320px)
- iPhone 12 (390px)
- iPad (768px)
- Desktop (1440px)

**Beklenen Sonuç**: Tüm ekran boyutlarında kullanılabilir olmalı

---

## Manuel Test Checklist

### Hasta Tarafı
- [ ] Anket formu açılıyor
- [ ] KVKK metni görünüyor
- [ ] Likert 1-5 soruları çalışıyor
- [ ] NPS 0-10 soruları çalışıyor
- [ ] Evet/Hayır soruları çalışıyor
- [ ] Metin alanları çalışıyor
- [ ] İlerleme çubuğu güncelleniyor
- [ ] Bölümler arası geçiş çalışıyor
- [ ] Gönderim başarılı
- [ ] Teşekkür sayfası görünüyor

### Admin Tarafı
- [ ] Login çalışıyor
- [ ] Dashboard KPI'ları görünüyor
- [ ] Anket listesi yükleniyor
- [ ] Link oluşturma çalışıyor
- [ ] QR kod üretiliyor
- [ ] Cevap listesi yükleniyor
- [ ] Cevap detayı açılıyor
- [ ] Filtreler çalışıyor
- [ ] Ayarlar kaydediliyor
- [ ] Logout çalışıyor

### Güvenlik
- [ ] Token olmadan admin panele erişilemiyor
- [ ] Geçersiz token reddediliyor
- [ ] Rate limiting çalışıyor
- [ ] KVKK onayı zorunlu
- [ ] Tekrar doldurma engellenmiş

## Performans Testleri

### Yük Testi
- 100 eşzamanlı anket gönderimi
- Response time < 2 saniye
- Hata oranı < 1%

### Veritabanı
- 1000 cevap ile dashboard yükleme < 3 saniye
- Filtreleme < 1 saniye

## Güvenlik Testleri

- [ ] SQL Injection koruması
- [ ] XSS koruması
- [ ] CSRF koruması
- [ ] Rate limiting
- [ ] JWT token güvenliği
- [ ] HTTPS zorunluluğu

## Browser Uyumluluğu

- [ ] Chrome (son 2 versiyon)
- [ ] Firefox (son 2 versiyon)
- [ ] Safari (son 2 versiyon)
- [ ] Edge (son 2 versiyon)
- [ ] Mobile Safari (iOS 14+)
- [ ] Chrome Mobile (Android 10+)
