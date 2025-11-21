# 🚀 ŞİMDİ DEPLOY ET!

## Yöntem 1: Otomatik Script (Önerilen)

### PowerShell'de çalıştırın:
```powershell
.\deploy-to-server.ps1
```

Sunucu IP'nizi girin ve bekleyin!

---

## Yöntem 2: Manuel Adımlar

### ADIM 1: Projeyi Zipleyın
```powershell
# PowerShell'de
$folders = @("backend", "frontend", "shared")
$files = @("package.json", "README.md")

# Geçici klasör
New-Item -ItemType Directory -Path "deploy-temp" -Force
foreach ($folder in $folders) {
    Copy-Item -Path $folder -Destination "deploy-temp/$folder" -Recurse -Exclude "node_modules","dist"
}
foreach ($file in $files) {
    Copy-Item -Path $file -Destination "deploy-temp/"
}

# Zip oluştur
Compress-Archive -Path "deploy-temp/*" -DestinationPath "tusa-anket.zip" -Force
Remove-Item -Recurse -Force "deploy-temp"

Write-Host "✅ tusa-anket.zip hazır!"
```

### ADIM 2: Sunucuya Yükleyin
```powershell
# IP adresinizi yazın
$IP = "SUNUCU_IP_BURAYA"

# Yükle
scp tusa-anket.zip root@${IP}:/tmp/
```

### ADIM 3: SSH ile Bağlanın
```powershell
ssh root@SUNUCU_IP_BURAYA
```

### ADIM 4: Sunucuda Kurulum
```bash
# Zip'i aç
cd /tmp
unzip tusa-anket.zip -d /var/www/tusa-anket
cd /var/www/tusa-anket

# Backend kurulum
cd backend
npm install --production

# .env dosyası oluştur
nano .env
```

**.env içeriği (kopyala-yapıştır):**
```env
NODE_ENV=production
PORT=5000

# Firebase (Firebase Console'dan alın)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# JWT (rastgele 32+ karakter)
JWT_SECRET=super-gizli-random-string-buraya-32-karakter-min

# OpenAI
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx

# Frontend URL
FRONTEND_URL=https://anket.tusahastanesi.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=86400000
RATE_LIMIT_MAX_REQUESTS=5
```

**Kaydet:** `Ctrl+X` > `Y` > `Enter`

```bash
# PM2 ile başlat
pm2 start src/server.js --name tusa-backend
pm2 save
pm2 startup

# Test et
curl http://localhost:5000/health
# Beklenen: {"status":"ok"}
```

### ADIM 5: Frontend Build
```bash
cd /var/www/tusa-anket/frontend

# Axios config güncelle
nano src/config/axios.js
```

**baseURL'i değiştir:**
```javascript
baseURL: 'https://anket.tusahastanesi.com/api',
```

**Kaydet:** `Ctrl+X` > `Y` > `Enter`

```bash
# Build al
npm install
npm run build

# Build klasörü oluşmalı
ls -la dist/
```

### ADIM 6: Nginx Konfigürasyonu
```bash
nano /etc/nginx/sites-available/anket.tusahastanesi.com
```

**Aşağıdaki config'i yapıştır:**
```nginx
upstream backend {
    server 127.0.0.1:5000;
    keepalive 64;
}

server {
    listen 80;
    listen [::]:80;
    server_name anket.tusahastanesi.com;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name anket.tusahastanesi.com;

    # SSL (Certbot tarafından eklenecek)
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;

    root /var/www/tusa-anket/frontend/dist;
    index index.html;

    # Frontend
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static files cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Backend API
    location /api/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /health {
        proxy_pass http://backend;
        access_log off;
    }
}
```

**Kaydet:** `Ctrl+X` > `Y` > `Enter`

```bash
# Aktifleştir
ln -s /etc/nginx/sites-available/anket.tusahastanesi.com /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

# Test et
nginx -t

# Başlat
systemctl restart nginx
```

### ADIM 7: SSL Kurulumu
```bash
certbot --nginx -d anket.tusahastanesi.com

# Sorular:
# Email: info@tusahastanesi.com
# Terms: A (Agree)
# Share email: Y veya N
# Redirect: 2 (Redirect HTTP to HTTPS)
```

### ADIM 8: Firewall
```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
ufw status
```

---

## ✅ TEST

### Backend Test
```bash
curl http://localhost:5000/health
# Beklenen: {"status":"ok"}
```

### Frontend Test
```bash
curl -I https://anket.tusahastanesi.com
# Beklenen: HTTP/2 200
```

### PM2 Status
```bash
pm2 status
pm2 logs tusa-backend --lines 20
```

### Nginx Status
```bash
systemctl status nginx
tail -f /var/log/nginx/access.log
```

---

## 🌐 Tarayıcıda Test

1. **https://anket.tusahastanesi.com** adresine gidin
2. Login sayfası görünmeli
3. **admin@tusa.com** / **admin123** ile giriş yapın
4. Dashboard açılmalı

---

## 🔧 Monitoring

### Logları İzle
```bash
# Backend logs
pm2 logs tusa-backend

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Sistem kaynakları
htop
```

### Yeniden Başlatma
```bash
# Backend
pm2 restart tusa-backend

# Nginx
systemctl restart nginx

# Tümü
pm2 restart all && systemctl restart nginx
```

---

## 🆘 Sorun Giderme

### 502 Bad Gateway
```bash
# Backend çalışıyor mu?
pm2 status
pm2 logs tusa-backend --lines 50

# Yeniden başlat
pm2 restart tusa-backend
```

### SSL Hatası
```bash
# Sertifika kontrol
certbot certificates

# Yenile
certbot renew --force-renewal
systemctl restart nginx
```

### Site Açılmıyor
```bash
# DNS kontrol
nslookup anket.tusahastanesi.com

# Nginx kontrol
nginx -t
systemctl status nginx

# Firewall kontrol
ufw status
```

---

## 📊 Başarı Kontrol Listesi

- [ ] Backend çalışıyor (pm2 status)
- [ ] Frontend build alındı (dist/ klasörü var)
- [ ] Nginx çalışıyor (systemctl status nginx)
- [ ] SSL kuruldu (https:// çalışıyor)
- [ ] Firewall aktif (ufw status)
- [ ] Site açılıyor (tarayıcıda test)
- [ ] Login çalışıyor (admin girişi)
- [ ] Dashboard yükleniyor

---

## 🎉 Tebrikler!

Siteniz artık canlıda: **https://anket.tusahastanesi.com**

**İlk yapılacaklar:**
1. Admin şifresini değiştirin
2. Anketlerinizi oluşturun
3. Link'leri paylaşın
4. Cevapları izleyin

**Destek için:** DIGITALOCEAN_DEPLOYMENT.md
