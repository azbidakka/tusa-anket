# 🏥 TUSA Hastanesi Logo Entegrasyonu

## ✅ Tamamlandı

Logo entegrasyonu tüm sayfalara başarıyla eklendi.

## 📁 Logo Dosyası Yükleme

### Dosya Konumu
```
frontend/src/assets/tusa-logo.png
```

### Önerilen Özellikler

**Dosya Adı:** `tusa-logo.png`

**Format:** PNG (şeffaf arka plan önerilir) veya SVG

**Boyutlar:**
- **Genişlik:** 180-200px
- **Yükseklik:** 50-60px
- **Çözünürlük:** 2x (Retina için 360x100px)

**Alternatif:** `tusa-logo.svg` (vektörel, her boyutta keskin)

## 🎯 Logo Kullanım Yerleri

### 1. Admin Paneli Header
- **Dosya:** `frontend/src/components/AdminLayout.jsx`
- **Boyut:** h-10 (40px yükseklik)
- **Konum:** Sol üst köşe, navigasyon menüsünün yanında
- **Fallback:** "TUSA Hastanesi" metni

### 2. Anket Formu
- **Dosya:** `frontend/src/pages/public/SurveyForm.jsx`
- **Boyut:** h-16 (64px yükseklik)
- **Konum:** Sayfa üst kısmı, ortalanmış
- **Fallback:** "TUSA Hastanesi" başlık

### 3. Login Sayfası
- **Dosya:** `frontend/src/pages/auth/Login.jsx`
- **Boyut:** h-20 (80px yükseklik)
- **Konum:** Giriş formunun üstünde, ortalanmış
- **Fallback:** "TUSA Hastanesi" başlık

### 4. PDF Raporları
- **Dosya:** `frontend/src/pages/admin/Dashboard.jsx`
- **Boyut:** max-width: 200px
- **Konum:** Rapor başlığında, ortalanmış
- **Fallback:** Logo görünmez (onerror)

## 🔄 Otomatik Yükleme

Logo dosyasını yükledikten sonra:

1. **Tarayıcıyı yenileyin** (Ctrl+F5 veya Cmd+Shift+R)
2. Logo otomatik olarak tüm sayfalarda görünecek
3. Fallback mekanizması sayesinde logo yoksa metin gösterilir

## 📝 Marka Güncellemeleri

Tüm "TUSA Sağlık Grubu" metinleri "TUSA Hastanesi" olarak güncellendi:

- ✅ Admin paneli
- ✅ Anket formları
- ✅ Login sayfası
- ✅ PDF raporları
- ✅ Excel raporları
- ✅ AI analiz sistemi
- ✅ Footer metinleri

## 🎨 Tasarım Notları

### Şeffaf Arka Plan
PNG formatında şeffaf arka plan kullanmanız önerilir. Bu sayede logo her arka plan renginde düzgün görünür.

### Responsive Tasarım
Logo boyutları responsive olarak ayarlanmıştır:
- Mobil: Otomatik küçülür
- Tablet: Orta boyut
- Desktop: Tam boyut

### Renk Uyumu
Logo TUSA marka renkleriyle uyumlu olmalıdır:
- **Primary:** #0A6A39 (Yeşil)
- **Accent:** #D4AF37 (Altın)

## 🔍 Test Etme

Logo yüklendikten sonra kontrol edin:

1. **Admin Paneli:** http://localhost:5173/admin
2. **Login Sayfası:** http://localhost:5173/login
3. **Anket Formu:** Herhangi bir anket linki
4. **PDF Rapor:** Dashboard'dan "PDF Yazdır"

## ⚠️ Sorun Giderme

### Logo Görünmüyor
1. Dosya adını kontrol edin: `tusa-logo.png`
2. Dosya konumunu kontrol edin: `frontend/src/assets/`
3. Tarayıcı cache'ini temizleyin (Ctrl+F5)
4. Console'da hata var mı kontrol edin (F12)

### Logo Bulanık
1. Daha yüksek çözünürlükte logo yükleyin (2x boyut)
2. SVG formatı kullanın (vektörel)

### Logo Çok Büyük/Küçük
1. Önerilen boyutlara uyun
2. Gerekirse CSS'de `h-10`, `h-16`, `h-20` değerlerini ayarlayın

## 📞 Destek

Logo entegrasyonu ile ilgili sorunlar için:
- Dosya konumunu kontrol edin
- Tarayıcı console'unu inceleyin
- Fallback metin görünüyorsa logo yüklenmemiştir
