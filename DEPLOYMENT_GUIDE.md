# 🚀 TUSA Anket Sistemi - Deployment Rehberi

## 📋 Genel Bakış

Sistem `anket.tusahastanesi.com` subdomain'ine deploy edilecek.

## 🏗️ Mimari

```
anket.tusahastanesi.com
├── Frontend (React + Vite)
├── Backend (Node.js + Express)
└── Database (Firebase Firestore)
```

## 📦 Gereksinimler

### Sunucu Gereksinimleri
- **Node.js:** v18+ (önerilen: v20 LTS)
- **RAM:** Minimum 2GB (önerilen: 4GB)
- **Disk:** Minimum 10GB
- **OS:** Ubuntu 20.04+ / CentOS 8+ / Windows Server 2019+

### Domain Ayarları
- **Subdomain:** anket.tusahastanesi.com
- **SSL:** Let's Encrypt (ücretsiz) veya mevcut wildcard sertifika
- **DNS:** A kaydı sunucu IP'sine yönlendirilmeli

## 🔧 Deployment Seçenekleri

### Seçenek 1: VPS/Dedicated Server (Önerilen)

#### 1. Sunucu Hazırlığı

```bash
# Sistem güncellemesi
sudo apt update && sudo apt upgrade -y

# Node.js kurulumu (v20 LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# PM2 kurulumu (process manager)
sudo npm install -g pm2

# Nginx kurulumu (reverse proxy)
sudo apt install -y nginx

# Certbot kurulumu (SSL)
sudo apt install -y certbot python3-certbot-nginx
```

#### 2. Proje Kurulumu

```bash
# Proje klasörü oluştur
sudo mkdir -p /var/www/tusa-anket
cd /var/www/tusa-anket

# Git clone (veya dosyaları upload et)
git clone <repository-url> .

# Backend kurulum
cd backend
npm install --production
cp .env.example .env
nano .env  # Ayarları düzenle

# Frontend build
cd ../frontend
npm install
npm run build

# Shared kurulum
cd ../shared
npm install
```

#### 3. Environment Variables (.env)

```env
# Backend .env
PORT=3000
NODE_ENV=production

# JWT Secrets (GÜVENLİ ŞİFRELER KULLAN!)
JWT_SECRET=<güvenli-random-string-64-karakter>
JWT_REFRESH_SECRET=<güvenli-random-string-64-karakter>

# Firebase (Production)
FIREBASE_PROJECT_ID=<firebase-project-id>
FIREBASE_PRIVATE_KEY="<firebase-private-key>"
FIREBASE_CLIENT_EMAIL=<firebase-client-email>

# Domain
FRONTEND_URL=https://anket.tusahastanesi.com
SURVEY_DOMAIN=https://anket.tusahastanesi.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=86400000
RATE_LIMIT_MAX_REQUESTS=5

# OpenAI (Opsiyonel)
OPENAI_API_KEY=<openai-api-key>
```

#### 4. PM2 ile Backend Başlatma

```bash
cd /var/www/tusa-anket/backend

# PM2 ecosystem dosyası oluştur
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'tusa-anket-backend',
    script: 'src/server.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
}
EOF

# Log klasörü oluştur
mkdir -p logs

# PM2 ile başlat
pm2 start ecosystem.config.js

# Otomatik başlatma
pm2 startup
pm2 save
```

#### 5. Nginx Konfigürasyonu

```bash
sudo nano /etc/nginx/sites-available/tusa-anket
```

```nginx
# Frontend + Backend Reverse Proxy
server {
    listen 80;
    server_name anket.tusahastanesi.com;

    # Frontend (Static Files)
    root /var/www/tusa-anket/frontend/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Frontend routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

```bash
# Nginx konfigürasyonu aktifleştir
sudo ln -s /etc/nginx/sites-available/tusa-anket /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6. SSL Sertifikası (Let's Encrypt)

```bash
# Otomatik SSL kurulumu
sudo certbot --nginx -d anket.tusahastanesi.com

# Otomatik yenileme testi
sudo certbot renew --dry-run
```

### Seçenek 2: Docker Deployment

#### Dockerfile (Backend)

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .

EXPOSE 3000

CMD ["node", "src/server.js"]
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    env_file:
      - ./backend/.env
    restart: unless-stopped
    volumes:
      - ./backend/logs:/app/logs

  frontend:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./frontend/dist:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend
    restart: unless-stopped
```

```bash
# Docker ile başlat
docker-compose up -d

# Logları izle
docker-compose logs -f
```

### Seçenek 3: Cloud Platforms

#### Vercel (Frontend)
```bash
cd frontend
npm install -g vercel
vercel --prod
```

#### Railway / Render (Backend)
- GitHub repository bağla
- Environment variables ekle
- Auto-deploy aktif

## 🔒 Güvenlik Kontrol Listesi

- [ ] JWT secrets güçlü ve benzersiz
- [ ] Firebase credentials güvenli
- [ ] HTTPS/SSL aktif
- [ ] Rate limiting aktif
- [ ] CORS doğru yapılandırılmış
- [ ] Environment variables production'da
- [ ] Firewall kuralları ayarlandı
- [ ] Backup stratejisi oluşturuldu
- [ ] Monitoring kuruldu

## 📊 Monitoring

### PM2 Monitoring

```bash
# Process durumu
pm2 status

# Logları izle
pm2 logs tusa-anket-backend

# Restart
pm2 restart tusa-anket-backend

# Memory/CPU kullanımı
pm2 monit
```

### Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

## 🔄 Güncelleme Prosedürü

```bash
# 1. Yeni kodu çek
cd /var/www/tusa-anket
git pull origin main

# 2. Backend güncelle
cd backend
npm install --production
pm2 restart tusa-anket-backend

# 3. Frontend build
cd ../frontend
npm install
npm run build

# 4. Nginx reload
sudo systemctl reload nginx
```

## 💾 Backup Stratejisi

### Firebase Backup
- Firebase Console → Firestore → Export
- Günlük otomatik backup ayarla
- Cloud Storage'a kaydet

### Kod Backup
- Git repository (GitHub/GitLab)
- Günlük commit
- Tag'ler ile versiyon yönetimi

## 🐛 Troubleshooting

### Backend çalışmıyor
```bash
pm2 logs tusa-anket-backend --lines 100
pm2 restart tusa-anket-backend
```

### Frontend 404 hatası
```bash
# Nginx config kontrol
sudo nginx -t
sudo systemctl restart nginx
```

### SSL sorunu
```bash
sudo certbot renew --force-renewal
sudo systemctl restart nginx
```

### Port kullanımda
```bash
# Port 3000 kontrol
sudo lsof -i :3000
sudo kill -9 <PID>
```

## 📞 Destek

Deployment sırasında sorun yaşarsanız:
1. Logları kontrol edin
2. Environment variables'ı doğrulayın
3. Firewall/port ayarlarını kontrol edin
4. DNS propagation bekleyin (24-48 saat)

## ✅ Deployment Checklist

- [ ] Sunucu hazır
- [ ] Node.js kurulu
- [ ] Domain DNS ayarları yapıldı
- [ ] SSL sertifikası alındı
- [ ] Firebase production credentials
- [ ] Environment variables ayarlandı
- [ ] Backend PM2 ile çalışıyor
- [ ] Frontend build edildi
- [ ] Nginx konfigüre edildi
- [ ] Test edildi (login, anket, dashboard)
- [ ] Monitoring aktif
- [ ] Backup stratejisi hazır

## 🎉 Go Live!

Tüm adımlar tamamlandıktan sonra:

1. https://anket.tusahastanesi.com adresini ziyaret edin
2. Admin paneline giriş yapın
3. Test anketi oluşturun
4. Mobil ve desktop'ta test edin
5. Canlıya alın! 🚀
