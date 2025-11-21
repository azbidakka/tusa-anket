# ⚡ Hızlı Deployment Özeti
## anket.tusahastanesi.com

---

## 🎯 HIZLI ADIMLAR

### 1. DigitalOcean Droplet
```
Region: Frankfurt
OS: Ubuntu 22.04 LTS
Size: 2GB RAM, 2 vCPU ($12/ay)
IP: [NOT ALIN]
```

### 2. Cloudflare DNS
```
Type: A
Name: anket
IP: [Droplet IP]
Proxy: ON (turuncu bulut)
```

### 3. Sunucuya Bağlan
```bash
ssh root@[DROPLET_IP]
```

### 4. Kurulum Script'i
```bash
# Sistem güncelleme
apt update && apt upgrade -y

# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Gerekli paketler
apt install -y nginx certbot python3-certbot-nginx git
npm install -g pm2

# Proje klasörü
mkdir -p /var/www
cd /var/www
```

### 5. Proje Yükleme

**Yöntem A: Git (Önerilen)**
```bash
git clone https://github.com/[kullanici]/tusa-anket.git
cd tusa-anket
```

**Yöntem B: SCP**
```powershell
# Windows'ta
scp -r C:\Users\aydos\OneDrive\Masaüstü\tusaanket root@[IP]:/var/www/tusa-anket
```

### 6. Backend Kurulum
```bash
cd /var/www/tusa-anket/backend
npm install --production

# .env dosyası oluştur
nano .env
```

**.env içeriği:**
```env
NODE_ENV=production
PORT=5000
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@...
JWT_SECRET=super-gizli-random-32-karakter-string
OPENAI_API_KEY=sk-proj-xxxxxxxx
FRONTEND_URL=https://anket.tusahastanesi.com
```

**PM2 ile başlat:**
```bash
pm2 start src/server.js --name tusa-backend
pm2 save
pm2 startup
```

### 7. Frontend Build
```bash
cd /var/www/tusa-anket/frontend

# axios config güncelle
nano src/config/axios.js
# baseURL: 'https://anket.tusahastanesi.com/api'

npm install
npm run build
```

### 8. Nginx Config
```bash
nano /etc/nginx/sites-available/anket.tusahastanesi.com
```

**Kopyala yapıştır:** (DIGITALOCEAN_DEPLOYMENT.md'den nginx config)

```bash
ln -s /etc/nginx/sites-available/anket.tusahastanesi.com /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
```

### 9. SSL Kurulumu
```bash
certbot --nginx -d anket.tusahastanesi.com
# Email: info@tusahastanesi.com
# Agree: Y
# Redirect: 2
```

### 10. Firewall
```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

---

## ✅ TEST

```bash
# Backend
curl http://localhost:5000/health

# Frontend
curl -I https://anket.tusahastanesi.com

# PM2
pm2 status

# Nginx
systemctl status nginx
```

**Tarayıcıda:** https://anket.tusahastanesi.com

---

## 🔧 YAYIN SONRASI

### Monitoring
```bash
pm2 monit
pm2 logs tusa-backend
tail -f /var/log/nginx/access.log
```

### Güncelleme
```bash
cd /var/www/tusa-anket
git pull
cd backend && npm install && pm2 restart tusa-backend
cd ../frontend && npm install && npm run build
systemctl reload nginx
```

### Yedekleme
```bash
tar -czf ~/tusa-anket-backup-$(date +%Y%m%d).tar.gz /var/www/tusa-anket
```

---

## 🆘 SORUN GİDERME

**502 Bad Gateway:**
```bash
pm2 restart tusa-backend
systemctl restart nginx
```

**SSL Hatası:**
```bash
certbot renew --force-renewal
systemctl restart nginx
```

**Logları Kontrol:**
```bash
pm2 logs tusa-backend --lines 100
tail -f /var/log/nginx/error.log
```

---

## 📱 İLETİŞİM

**Admin Panel:** https://anket.tusahastanesi.com/admin
**Login:** admin@tusa.com / admin123

**Sunucu:** ssh root@[DROPLET_IP]

---

**Detaylı bilgi için:** `DIGITALOCEAN_DEPLOYMENT.md`
