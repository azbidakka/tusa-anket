# TUSA Anket Deployment Script
# Windows PowerShell için

Write-Host "🚀 TUSA Anket Deployment Başlıyor..." -ForegroundColor Green
Write-Host ""

# Sunucu bilgileri
$SERVER_IP = Read-Host "Sunucu IP adresini girin"
$SERVER_USER = "root"

Write-Host ""
Write-Host "📦 Deployment paketi hazırlanıyor..." -ForegroundColor Yellow

# Geçici klasör oluştur
$TEMP_DIR = "tusa-anket-deploy"
if (Test-Path $TEMP_DIR) {
    Remove-Item -Recurse -Force $TEMP_DIR
}
New-Item -ItemType Directory -Path $TEMP_DIR | Out-Null

# Gerekli dosyaları kopyala
Write-Host "  ✓ Backend dosyaları kopyalanıyor..."
Copy-Item -Path "backend" -Destination "$TEMP_DIR/backend" -Recurse -Exclude "node_modules"

Write-Host "  ✓ Frontend dosyaları kopyalanıyor..."
Copy-Item -Path "frontend" -Destination "$TEMP_DIR/frontend" -Recurse -Exclude "node_modules","dist"

Write-Host "  ✓ Shared dosyaları kopyalanıyor..."
Copy-Item -Path "shared" -Destination "$TEMP_DIR/shared" -Recurse -Exclude "node_modules"

Write-Host "  ✓ Konfigürasyon dosyaları kopyalanıyor..."
Copy-Item -Path "package.json" -Destination "$TEMP_DIR/"
Copy-Item -Path "README.md" -Destination "$TEMP_DIR/"

# Zip oluştur
Write-Host ""
Write-Host "📦 Zip dosyası oluşturuluyor..." -ForegroundColor Yellow
$ZIP_FILE = "tusa-anket-deploy.zip"
if (Test-Path $ZIP_FILE) {
    Remove-Item -Force $ZIP_FILE
}
Compress-Archive -Path "$TEMP_DIR/*" -DestinationPath $ZIP_FILE

# Geçici klasörü sil
Remove-Item -Recurse -Force $TEMP_DIR

Write-Host "  ✓ Paket hazır: $ZIP_FILE" -ForegroundColor Green
$ZIP_SIZE = (Get-Item $ZIP_FILE).Length / 1MB
Write-Host "  ✓ Boyut: $([math]::Round($ZIP_SIZE, 2)) MB" -ForegroundColor Green

Write-Host ""
Write-Host "📤 Sunucuya yükleniyor..." -ForegroundColor Yellow
Write-Host "  → $SERVER_USER@$SERVER_IP" -ForegroundColor Cyan

# SCP ile yükle
scp $ZIP_FILE "${SERVER_USER}@${SERVER_IP}:/tmp/"

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Dosya yüklendi!" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "🔧 Sunucuda kurulum yapılıyor..." -ForegroundColor Yellow
    
    # SSH ile sunucuda komutları çalıştır
    $COMMANDS = @"
cd /tmp
rm -rf /var/www/tusa-anket.backup
if [ -d /var/www/tusa-anket ]; then
    mv /var/www/tusa-anket /var/www/tusa-anket.backup
fi
mkdir -p /var/www/tusa-anket
unzip -q tusa-anket-deploy.zip -d /var/www/tusa-anket
rm tusa-anket-deploy.zip
cd /var/www/tusa-anket
echo '✓ Dosyalar açıldı'
"@

    $COMMANDS | ssh "${SERVER_USER}@${SERVER_IP}" "bash -s"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Kurulum tamamlandı!" -ForegroundColor Green
        Write-Host ""
        Write-Host "✅ Deployment başarılı!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📋 Sonraki adımlar:" -ForegroundColor Cyan
        Write-Host "  1. SSH ile sunucuya bağlanın: ssh $SERVER_USER@$SERVER_IP"
        Write-Host "  2. Backend kurulumu için: cd /var/www/tusa-anket/backend && npm install"
        Write-Host "  3. .env dosyasını oluşturun: nano /var/www/tusa-anket/backend/.env"
        Write-Host "  4. PM2 ile başlatın: pm2 start src/server.js --name tusa-backend"
        Write-Host "  5. Frontend build: cd /var/www/tusa-anket/frontend && npm install && npm run build"
        Write-Host "  6. Nginx config yapın ve SSL kurun"
        Write-Host ""
        Write-Host "Detaylı talimatlar için: DIGITALOCEAN_DEPLOYMENT.md" -ForegroundColor Yellow
    } else {
        Write-Host "  ✗ Kurulum hatası!" -ForegroundColor Red
    }
} else {
    Write-Host "  ✗ Yükleme hatası!" -ForegroundColor Red
}

Write-Host ""
Write-Host "Yerel zip dosyası: $ZIP_FILE" -ForegroundColor Gray
Write-Host "Silmek için: Remove-Item $ZIP_FILE" -ForegroundColor Gray
"@