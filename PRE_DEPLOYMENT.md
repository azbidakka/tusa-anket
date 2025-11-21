# 🎯 Deployment Öncesi Hazırlık

## 📋 Yapılması Gerekenler

### 1. Firebase Production Setup

#### Firebase Console'da:
1. https://console.firebase.google.com adresine git
2. Yeni proje oluştur: "tusa-anket-production"
3. Firestore Database oluştur (Production mode)
4. Service Account oluştur:
   - Project Settings → Service Accounts
   - "Generate New Private Key" tıkla
   - JSON dosyasını indir

#### JSON'dan .env'e Kopyala:
```json
{
  "project_id": "tusa-anket-prod",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...",
  "client_email": "firebase-adminsdk-xxx@tusa-anket-prod.iam.gserviceaccount.com"
}
```

Backend `.env` dosyasına:
```env
FIREBASE_PROJECT_ID=tusa-anket-prod
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@tusa-anket-prod.iam.gserviceaccount.com
```

### 2. JWT Secrets Oluştur

Güvenli random string'ler oluştur:

```bash
# Linux/Mac
openssl rand -base64 64

# veya Node.js ile
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

`.env` dosyasına ekle:
```env
JWT_SECRET=<64-karakter-random-string>
JWT_REFRESH_SECRET=<64-karakter-random-string>
```

### 3. OpenAI API Key (Opsiyonel)

1. https://platform.openai.com adresine git
2. API Keys → Create new secret key
3. Key'i kopyala ve `.env`'e ekle:
```env
OPENAI_API_KEY=sk-proj-...
```

### 4. Domain Hazırlığı

#### DNS Ayarları (Domain sağlayıcınızda):
```
Type: A
Name: anket
Value: <sunucu-ip-adresi>
TTL: 3600
```

#### Propagation Kontrolü:
```bash
# DNS yayılımını kontrol et
nslookup anket.tusahastanesi.com
dig anket.tusahastanesi.com
```

### 5. Sunucu Bilgileri

Aşağıdaki bilgileri hazır bulundurun:
- [ ] Sunucu IP adresi
- [ ] SSH kullanıcı adı
- [ ] SSH şifresi veya private key
- [ ] Root/sudo erişimi

### 6. Logo Dosyası

Logo dosyanızı hazırlayın:
- **Dosya adı:** `tusa-logo.png`
- **Boyut:** 180-200px genişlik, 50-60px yükseklik
- **Format:** PNG (şeffaf arka plan)
- **Konum:** `frontend/src/assets/tusa-logo.png`

### 7. Admin Kullanıcı

İlk admin kullanıcı bilgileri:
- **Email:** admin@tusa.com (değiştirilebilir)
- **Şifre:** admin123 (mutlaka değiştirin!)

Production'da şifreyi değiştirmeyi unutmayın!

### 8. Anket Şablonları

Varsayılan anketler:
- Ayaktan Hasta Memnuniyeti
- Yatan Hasta Memnuniyeti
- Poliklinik Memnuniyeti

Kendi anketlerinizi oluşturabilirsiniz.

## 🔧 Dosya Kontrol Listesi

Deployment öncesi bu dosyaların hazır olduğundan emin olun:

- [ ] `backend/.env` (production values)
- [ ] `frontend/src/assets/tusa-logo.png`
- [ ] `nginx.conf`
- [ ] `backend/ecosystem.config.js`
- [ ] Firebase service account JSON

## 📤 Dosya Upload Yöntemleri

### 1. Git (Önerilen)
```bash
# GitHub/GitLab'a push et
git add .
git commit -m "Production ready"
git push origin main

# Sunucuda clone et
cd /var/www
git clone <repository-url> tusa-anket
```

### 2. SCP (Secure Copy)
```bash
# Local'den sunucuya
scp -r ./tusa-anket user@server-ip:/var/www/
```

### 3. FTP/SFTP
- FileZilla veya WinSCP kullan
- `/var/www/tusa-anket` klasörüne yükle

## ⚠️ Önemli Notlar

### .env Dosyası
- **Asla** Git'e commit etmeyin
- Production'da manuel oluşturun
- Güvenli şifreler kullanın

### Firebase Credentials
- Service account JSON'u güvenli tutun
- .gitignore'da olduğundan emin olun
- Sadece .env'de kullanın

### SSL Sertifikası
- Let's Encrypt ücretsiz
- 90 günde bir yenilenir (otomatik)
- Certbot cron job kurar

## 🎬 Deployment Sırası

1. ✅ Bu checklist'i tamamla
2. ✅ Sunucuya bağlan
3. ✅ `setup-server.sh` çalıştır
4. ✅ Dosyaları upload et
5. ✅ `.env` dosyasını oluştur
6. ✅ `deploy.sh` çalıştır
7. ✅ SSL kurulumu yap
8. ✅ Test et
9. ✅ Go live! 🚀

## 📞 Destek

Deployment sırasında yardıma ihtiyacınız olursa:
- DEPLOYMENT_GUIDE.md dosyasına bakın
- Backend loglarını kontrol edin: `pm2 logs`
- Nginx loglarını kontrol edin: `sudo tail -f /var/log/nginx/error.log`

---

**Hazır olduğunuzda deployment'a başlayabilirsiniz!** 🎉
