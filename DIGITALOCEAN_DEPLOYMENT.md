# 🚀 DigitalOcean Deployment Rehberi
## anket.tusahastanesi.com için Adım Adım Kurulum

---

## 📋 ÖN HAZIRLIK

### Gereksinimler
- ✅ DigitalOcean hesabı
- ✅ Cloudflare hesabı (DNS yönetimi için)
- ✅ Firebase projesi (Firestore + Admin SDK)
- ✅ OpenAI API Key
- ✅ Domain: tusahastanesi.com (Cloudflare'da)

---

## 1️⃣ DIGITALOCEAN DROPLET OLUŞTURMA

### Droplet Özellikleri
```
İşletim Sistemi: Ubuntu 22.04 LTS
Plan: Basic
CPU: 2 vCPU
RAM: 2 GB
Disk: 50 GB SSD
Fiyat: ~$12/ay
Datacenter: Frankfurt (Türkiye'ye en yakın)
```

### Droplet Oluşturma Adımları

1. **DigitalOcean'a giriş yapın**
   - https://cloud.digitalocean.com/

2. **Create > Droplets**
   - Choose Region: **Frankfurt**
   - Choose an image: **Ubuntu 22.04 LTS**
   - Choose Size: **Basic - $12/mo (2GB RAM, 2 vCPU)**
   - Choose Authentication: **SSH Key** (önerilen) veya **Password**
   - Hostname: **tusa-anket-server**

3. **Create Droplet** butonuna tıklayın

4. **IP Adresini not alın** (örn: 159.89.123.45)

---

## 2️⃣ CLOUDFLARE DNS AYARLARI

### A Record Ekleme

1. **Cloudflare Dashboard'a gidin**
   - https://dash.cloudflare.com/

2. **tusahastanesi.com domain'ini seçin**

3. **DNS > Records > Add record**
   ```
   Type: A
   Name: anket
   IPv4 address: [DigitalOcean Droplet IP'niz]
   Proxy status: Proxied (turuncu bulut) ✅
   TTL: Auto
   ```

4. **Save** butonuna tıklayın

5. **DNS propagation kontrolü** (5-10 dakika sürebilir)
   ```bash
   # Windows'ta
   nslookup anket.tusahastanesi.com
   
   # Veya online araç
   # https://dnschecker.org/
   ```

### Cloudflare SSL/TLS Ayarları

1. **SSL/TLS > Overview**
   - Encryption mode: **Full (strict)** seçin

2. **SSL/TLS > Edge Certificates**
   - Always Use HTTPS: **On**
   - Automatic HTTPS Rewrites: **On**
   - Minimum TLS Version: **TLS 1.2**

---

## 3️⃣ SUNUCUYA BAĞLANMA

### SSH ile Bağlantı

**Windows (PowerShell veya CMD):**
```powershell
ssh root@[DROPLET_IP]
# Örnek: ssh root@159.89.123.45
```

**İlk bağlantıda:**
```
The authenticity of host '159.89.123.45' can't be established.
Are you sure you want to continue connecting (yes/no)? yes
```

---

## 4️⃣ SUNUCU KURULUMU

### Sistem Güncellemesi
```bash
apt update && apt upgrade -y
```

### Node.js Kurulumu (v20 LTS)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node --version  # v20.x.x olmalı
npm --version   # 10.x.x olmalı
```

### PM2 Kurulumu (Process Manager)
```bash
npm install -g pm2
pm2 --version
```

### Nginx Kurulumu
```bash
apt install -y nginx
systemctl status nginx  # Active olmalı
```

### Certbot Kurulumu (SSL için)
```bash
apt install -y certbot python3-certbot-nginx
```

### Git Kurulumu
```bash
apt install -y git
git --version
```

---

## 5️⃣ PROJE DOSYALARINI YÜKLEME

### Yöntem 1: Git ile (Önerilen)

**GitHub'a proje yükleyin:**
```bash
# Local bilgisayarınızda
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/[kullanici-adi]/tusa-anket.git
git push -u origin main
```

**Sunucuda klonlayın:**
```bash
cd /var/www
git clone https://github.com/[kullanici-adi]/tusa-anket.git
cd tusa-anket
```

### Yöntem 2: SCP ile (Alternatif)

**Windows'ta (PowerShell):**
```powershell
# Projeyi zip'leyin
Compress-Archive -Path C:\Users\aydos\OneDrive\Masaüstü\tusaanket\* -DestinationPath tusa-anket.zip

# Sunucuya yükleyin
scp tusa-anket.zip root@[DROPLET_IP]:/var/www/

# Sunucuda
ssh root@[DROPLET_IP]
cd /var/www
apt install -y unzip
unzip tusa-anket.zip -d tusa-anket
cd tusa-anket
```

---

## 6️⃣ BACKEND KURULUMU

### Backend Bağımlılıkları
```bash
cd /var/www/tusa-anket/backend
npm install --production
```

### Environment Dosyası (.env)
```bash
nano .env
```

**Aşağıdaki içeriği yapıştırın:**
```env
# Server
NODE_ENV=production
PORT=5000

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# JWT
JWT_SECRET=super-gizli-random-string-buraya-yazin-min-32-karakter

# OpenAI
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# CORS
FRONTEND_URL=https://anket.tusahastanesi.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=86400000
RATE_LIMIT_MAX_REQUESTS=5
```

**Kaydet ve çık:** `Ctrl+X` > `Y` > `Enter`

### Firebase Admin SDK Key Alma

1. **Firebase Console'a gidin**
   - https://console.firebase.google.com/

2. **Projenizi seçin**

3. **Project Settings (⚙️) > Service Accounts**

4. **Generate New Private Key** butonuna tıklayın

5. **JSON dosyasını indirin**

6. **JSON içeriğini .env'ye ekleyin:**
   ```bash
   # JSON'dan kopyalayın:
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@...
   ```

### PM2 ile Backend Başlatma
```bash
cd /var/www/tusa-anket/backend
pm2 start src/server.js --name tusa-backend
pm2 save
pm2 startup
```

**Kontrol:**
```bash
pm2 status
pm2 logs tusa-backend
curl http://localhost:5000/health  # {"status":"ok"} dönmeli
```

---

## 7️⃣ FRONTEND BUILD

### Frontend Bağımlılıkları
```bash
cd /var/www/tusa-anket/frontend
npm install
```

### Axios Config Güncelleme
```bash
nano src/config/axios.js
```

**baseURL'i güncelleyin:**
```javascript
const instance = axios.create({
  baseURL: 'https://anket.tusahastanesi.com/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});
```

### Production Build
```bash
npm run build
```

**Build klasörü oluşacak:** `/var/www/tusa-anket/frontend/dist`

---

## 8️⃣ NGINX KONFIGÜRASYONU

### Nginx Config Dosyası
```bash
nano /etc/nginx/sites-available/anket.tusahastanesi.com
```

**Aşağıdaki içeriği yapıştırın:**
```nginx
# Backend API
upstream backend {
    server 127.0.0.1:5000;
    keepalive 64;
}

# HTTP -> HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name anket.tusahastanesi.com;
    
    # Let's Encrypt için
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    # Diğer tüm istekleri HTTPS'e yönlendir
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name anket.tusahastanesi.com;

    # SSL Certificates (Certbot tarafından eklenecek)
    # ssl_certificate /etc/letsencrypt/live/anket.tusahastanesi.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/anket.tusahastanesi.com/privkey.pem;

    # SSL Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml+rss;

    # Root directory
    root /var/www/tusa-anket/frontend/dist;
    index index.html;

    # Frontend - React SPA
    location / {
        try_files $uri $uri/ /index.html;
        expires 1h;
        add_header Cache-Control "public, must-revalidate";
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
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
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Health check
    location /health {
        proxy_pass http://backend;
        access_log off;
    }
}
```

**Kaydet ve çık:** `Ctrl+X` > `Y` > `Enter`

### Nginx Config Aktifleştirme
```bash
# Symlink oluştur
ln -s /etc/nginx/sites-available/anket.tusahastanesi.com /etc/nginx/sites-enabled/

# Default config'i kaldır (opsiyonel)
rm /etc/nginx/sites-enabled/default

# Syntax kontrolü
nginx -t

# Nginx'i yeniden başlat
systemctl restart nginx
systemctl status nginx
```

---

## 9️⃣ SSL SERTİFİKASI (Let's Encrypt)

### Certbot ile SSL Kurulumu
```bash
# Certbot çalıştır
certbot --nginx -d anket.tusahastanesi.com

# Sorular:
# Email: info@tusahastanesi.com
# Terms of Service: (A)gree
# Share email: (Y)es veya (N)o
# Redirect HTTP to HTTPS: 2 (Redirect)
```

### Otomatik Yenileme Testi
```bash
certbot renew --dry-run
```

**Sertifika 90 günde bir otomatik yenilenir.**

---

## 🔟 GÜVENLİK AYARLARI

### Firewall (UFW) Kurulumu
```bash
# UFW'yi etkinleştir
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
ufw status
```

**Çıktı:**
```
Status: active

To                         Action      From
--                         ------      ----
OpenSSH                    ALLOW       Anywhere
Nginx Full                 ALLOW       Anywhere
```

### Fail2Ban Kurulumu (Brute Force Koruması)
```bash
apt install -y fail2ban
systemctl enable fail2ban
systemctl start fail2ban
```

### Root Login Devre Dışı (Önerilen)
```bash
# Yeni kullanıcı oluştur
adduser tusa
usermod -aG sudo tusa

# SSH config düzenle
nano /etc/ssh/sshd_config

# Değiştir:
PermitRootLogin no
PasswordAuthentication no  # SSH key kullanıyorsanız

# SSH'yi yeniden başlat
systemctl restart sshd
```

---

## 1️⃣1️⃣ TEST VE DOĞRULAMA

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

### Tarayıcıdan Test
1. **https://anket.tusahastanesi.com** adresine gidin
2. **Login sayfası** görünmeli
3. **Admin girişi yapın:** admin@tusa.com / admin123
4. **Dashboard** açılmalı

### SSL Test
- https://www.ssllabs.com/ssltest/analyze.html?d=anket.tusahastanesi.com
- **A veya A+ rating** almalısınız

---

## 1️⃣2️⃣ İZLEME VE BAKIM

### PM2 Monitoring
```bash
pm2 monit              # Canlı monitoring
pm2 logs tusa-backend  # Logları görüntüle
pm2 restart tusa-backend  # Yeniden başlat
pm2 stop tusa-backend  # Durdur
pm2 delete tusa-backend  # Sil
```

### Nginx Logları
```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Disk Kullanımı
```bash
df -h
du -sh /var/www/tusa-anket
```

### Sistem Kaynakları
```bash
htop  # Kurulum: apt install htop
free -h  # RAM kullanımı
```

---

## 1️⃣3️⃣ GÜNCELLEME SÜRECİ

### Kod Güncellemesi (Git ile)
```bash
cd /var/www/tusa-anket

# Backend güncelleme
git pull origin main
cd backend
npm install --production
pm2 restart tusa-backend

# Frontend güncelleme
cd ../frontend
npm install
npm run build
systemctl reload nginx
```

### Manuel Güncelleme (SCP ile)
```bash
# Local'de zip oluştur
# Sunucuya yükle
# Eski dosyaları yedekle
mv /var/www/tusa-anket /var/www/tusa-anket.backup
# Yeni dosyaları aç
# PM2 ve Nginx'i yeniden başlat
```

---

## 1️⃣4️⃣ YEDEKLEME

### Otomatik Yedekleme Script'i
```bash
nano /root/backup-anket.sh
```

**İçerik:**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/root/backups"
mkdir -p $BACKUP_DIR

# Kod yedekleme
tar -czf $BACKUP_DIR/tusa-anket-$DATE.tar.gz /var/www/tusa-anket

# Eski yedekleri sil (30 günden eski)
find $BACKUP_DIR -name "tusa-anket-*.tar.gz" -mtime +30 -delete

echo "Backup completed: tusa-anket-$DATE.tar.gz"
```

**Çalıştırılabilir yap:**
```bash
chmod +x /root/backup-anket.sh
```

**Cron job ekle (her gün 03:00):**
```bash
crontab -e

# Ekle:
0 3 * * * /root/backup-anket.sh >> /var/log/backup-anket.log 2>&1
```

---

## 🆘 SORUN GİDERME

### Site Açılmıyor
```bash
# Nginx durumu
systemctl status nginx
nginx -t

# Backend durumu
pm2 status
pm2 logs tusa-backend --lines 50

# DNS kontrolü
nslookup anket.tusahastanesi.com
```

### 502 Bad Gateway
```bash
# Backend çalışıyor mu?
pm2 status
curl http://localhost:5000/health

# Nginx config doğru mu?
nginx -t

# Logları kontrol et
tail -f /var/log/nginx/error.log
```

### SSL Hatası
```bash
# Sertifika kontrolü
certbot certificates

# Yenileme
certbot renew --force-renewal

# Nginx yeniden başlat
systemctl restart nginx
```

### Yavaş Performans
```bash
# Sistem kaynakları
htop
free -h

# PM2 cluster mode (2 vCPU için)
pm2 delete tusa-backend
pm2 start src/server.js --name tusa-backend -i 2
pm2 save
```

---

## 📊 PERFORMANS OPTİMİZASYONU

### Cloudflare Ayarları

1. **Speed > Optimization**
   - Auto Minify: JS, CSS, HTML ✅
   - Brotli: On ✅
   - Early Hints: On ✅

2. **Caching > Configuration**
   - Caching Level: Standard
   - Browser Cache TTL: 4 hours

3. **Speed > Optimization > Image Optimization**
   - Polish: Lossless
   - Mirage: On

### PM2 Cluster Mode
```bash
pm2 delete tusa-backend
pm2 start src/server.js --name tusa-backend -i max
pm2 save
```

---

## ✅ DEPLOYMENT CHECKLIST

- [ ] DigitalOcean Droplet oluşturuldu
- [ ] Cloudflare DNS A record eklendi
- [ ] SSH ile sunucuya bağlanıldı
- [ ] Node.js, PM2, Nginx kuruldu
- [ ] Proje dosyaları yüklendi
- [ ] Backend .env dosyası yapılandırıldı
- [ ] Backend PM2 ile başlatıldı
- [ ] Frontend build alındı
- [ ] Nginx konfigürasyonu yapıldı
- [ ] SSL sertifikası kuruldu
- [ ] Firewall ayarlandı
- [ ] Site test edildi
- [ ] Monitoring kuruldu
- [ ] Yedekleme script'i oluşturuldu

---

## 📞 DESTEK

**Sorun yaşarsanız:**
1. Logları kontrol edin
2. Hata mesajlarını not alın
3. Google/Stack Overflow'da arayın
4. DigitalOcean Community'ye sorun

**Faydalı Linkler:**
- DigitalOcean Docs: https://docs.digitalocean.com/
- Nginx Docs: https://nginx.org/en/docs/
- PM2 Docs: https://pm2.keymetrics.io/docs/
- Certbot Docs: https://certbot.eff.org/

---

**🎉 Tebrikler! Anket sisteminiz artık canlıda!**

**URL:** https://anket.tusahastanesi.com
