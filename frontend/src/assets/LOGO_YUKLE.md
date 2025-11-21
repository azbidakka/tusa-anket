# 🏥 TUSA Hastanesi Logo Yükleme Talimatları

## Logo Dosyası

Logonuzu bu klasöre aşağıdaki isimle yükleyin:

**Dosya Adı:** `tusa-logo.png`

## Önerilen Boyutlar

### Header Logo (AdminLayout)
- **Genişlik:** 180-200px
- **Yükseklik:** 50-60px
- **Format:** PNG (şeffaf arka plan önerilir)
- **Çözünürlük:** 2x (Retina için 360x100px)

### Anket Formu Logo (SurveyForm)
- **Genişlik:** 150-180px
- **Yükseklik:** 50-60px
- **Format:** PNG (şeffaf arka plan önerilir)

### PDF Rapor Logo
- **Genişlik:** 200-250px
- **Yükseklik:** 60-80px
- **Format:** PNG veya JPG

## Alternatif Format

Eğer farklı bir format kullanmak isterseniz:
- SVG formatı da desteklenir (vektörel, her boyutta keskin)
- Dosya adı: `tusa-logo.svg`

## Yükleme Sonrası

Logo dosyasını yükledikten sonra:
1. Tarayıcıyı yenileyin (Ctrl+F5)
2. Logo otomatik olarak tüm sayfalarda görünecek:
   - ✅ Admin paneli header
   - ✅ Anket formu üst kısmı
   - ✅ PDF raporları
   - ✅ Login sayfası

## Yedek Logo

Logo yüklenmezse varsayılan "TUSA Hastanesi" metni gösterilir.

## Teknik Detaylar

Logo şu dosyalarda kullanılıyor:
- `frontend/src/components/AdminLayout.jsx`
- `frontend/src/pages/public/SurveyForm.jsx`
- `frontend/src/pages/auth/Login.jsx`
- `frontend/src/pages/admin/Dashboard.jsx` (PDF rapor)
