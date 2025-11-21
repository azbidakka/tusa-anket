#!/bin/bash

# TUSA Anket Sistemi - Quick Deployment Script
# anket.tusahastanesi.com

set -e

echo "🚀 TUSA Anket Sistemi Deployment Başlıyor..."

# Renkler
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Değişkenler
PROJECT_DIR="/var/www/tusa-anket"
DOMAIN="anket.tusahastanesi.com"

echo -e "${YELLOW}📦 1. Dependencies yükleniyor...${NC}"

# Backend
cd $PROJECT_DIR/backend
npm ci --production
echo -e "${GREEN}✅ Backend dependencies yüklendi${NC}"

# Frontend
cd $PROJECT_DIR/frontend
npm ci
echo -e "${GREEN}✅ Frontend dependencies yüklendi${NC}"

# Shared
cd $PROJECT_DIR/shared
npm ci
echo -e "${GREEN}✅ Shared dependencies yüklendi${NC}"

echo -e "${YELLOW}🏗️  2. Frontend build alınıyor...${NC}"
cd $PROJECT_DIR/frontend
npm run build
echo -e "${GREEN}✅ Frontend build tamamlandı${NC}"

echo -e "${YELLOW}🔄 3. Backend yeniden başlatılıyor...${NC}"
cd $PROJECT_DIR/backend
pm2 restart tusa-anket-backend || pm2 start ecosystem.config.js
echo -e "${GREEN}✅ Backend başlatıldı${NC}"

echo -e "${YELLOW}🌐 4. Nginx yeniden yükleniyor...${NC}"
sudo nginx -t && sudo systemctl reload nginx
echo -e "${GREEN}✅ Nginx yenilendi${NC}"

echo -e "${YELLOW}📊 5. Durum kontrol ediliyor...${NC}"
pm2 status
echo ""

echo -e "${GREEN}✅ Deployment tamamlandı!${NC}"
echo -e "${GREEN}🌐 Site: https://$DOMAIN${NC}"
echo ""
echo -e "${YELLOW}📝 Logları izlemek için:${NC}"
echo "   pm2 logs tusa-anket-backend"
echo ""
echo -e "${YELLOW}🔄 Restart için:${NC}"
echo "   pm2 restart tusa-anket-backend"
