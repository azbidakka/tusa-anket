#!/bin/bash

# TUSA Anket Sistemi - İlk Sunucu Kurulum Script
# Ubuntu 20.04+ için

set -e

echo "🚀 TUSA Anket Sistemi - Sunucu Kurulumu"

# Renkler
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Root kontrolü
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Bu script root olarak çalıştırılmalı (sudo)${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 1. Sistem güncelleniyor...${NC}"
apt update && apt upgrade -y
echo -e "${GREEN}✅ Sistem güncellendi${NC}"

echo -e "${YELLOW}📦 2. Node.js kurulumu...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node --version
npm --version
echo -e "${GREEN}✅ Node.js kuruldu${NC}"

echo -e "${YELLOW}📦 3. PM2 kurulumu...${NC}"
npm install -g pm2
pm2 --version
echo -e "${GREEN}✅ PM2 kuruldu${NC}"

echo -e "${YELLOW}📦 4. Nginx kurulumu...${NC}"
apt install -y nginx
systemctl enable nginx
systemctl start nginx
echo -e "${GREEN}✅ Nginx kuruldu${NC}"

echo -e "${YELLOW}📦 5. Certbot kurulumu (SSL)...${NC}"
apt install -y certbot python3-certbot-nginx
echo -e "${GREEN}✅ Certbot kuruldu${NC}"

echo -e "${YELLOW}📦 6. Git kurulumu...${NC}"
apt install -y git
echo -e "${GREEN}✅ Git kuruldu${NC}"

echo -e "${YELLOW}📁 7. Proje klasörü oluşturuluyor...${NC}"
mkdir -p /var/www/tusa-anket
chown -R $SUDO_USER:$SUDO_USER /var/www/tusa-anket
echo -e "${GREEN}✅ Proje klasörü hazır: /var/www/tusa-anket${NC}"

echo -e "${YELLOW}🔥 8. Firewall ayarları...${NC}"
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
echo -e "${GREEN}✅ Firewall yapılandırıldı${NC}"

echo ""
echo -e "${GREEN}✅ Sunucu kurulumu tamamlandı!${NC}"
echo ""
echo -e "${YELLOW}📝 Sonraki adımlar:${NC}"
echo "1. Proje dosyalarını /var/www/tusa-anket klasörüne yükleyin"
echo "2. Backend .env dosyasını düzenleyin"
echo "3. ./deploy.sh script'ini çalıştırın"
echo "4. SSL sertifikası alın: sudo certbot --nginx -d anket.tusahastanesi.com"
echo ""
echo -e "${GREEN}🎉 Hazırsınız!${NC}"
