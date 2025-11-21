# ✅ Production Checklist - anket.tusahastanesi.com

## 🔐 Güvenlik

### Environment Variables
- [ ] JWT_SECRET değiştirildi (64+ karakter, random)
- [ ] JWT_REFRESH_SECRET değiştirildi (64+ karakter, random)
- [ ] Firebase production credentials eklendi
- [ ] OpenAI API key eklendi (opsiyonel)
- [ ] NODE_ENV=production ayarlandı

### Firebase
- [ ] Production Firebase projesi oluşturuldu
- [ ] Service account key indirildi
- [ ] Firestore Database oluşturuldu
- [ ] Security rules ayarlandı
- [ ] Backup aktif

### SSL/HTTPS
- [ ] Domain DNS ayarları yapıldı
- [ ] SSL sertifikası kuruldu (Let's Encrypt)
- [ ] HTTPS redirect aktif
- [ ] Mixed content yok

### Güvenlik Ayarları
- [ ] Rate limiting aktif
- [ ] CORS doğru yapılandırıldı
- [ ] Helmet middleware aktif
- [ ] IP bazlı koruma aktif
- [ ] KVKK onayı zorunlu

## 🚀 Deployment

### Sunucu
- [ ] Node.js v20+ kurulu
- [ ] PM2 kurulu ve yapılandırıldı
- [ ] Nginx kurulu ve yapılandırıldı
- [ ] Firewall ayarları (80, 443, 3000)
- [ ] Disk alanı yeterli (min 10GB)
- [ ] RAM yeterli (min 2GB)

### Backend
- [ ] Dependencies yüklendi (`npm ci --production`)
- [ ] .env dosyası oluşturuldu
- [ ] PM2 ile başlatıldı
- [ ] Loglar çalışıyor
- [ ] Health check çalışıyor (/health)
- [ ] Auto-restart aktif

### Frontend
- [ ] Build alındı (`npm run build`)
- [ ] Dist klasörü Nginx'e kopyalandı
- [ ] Static files serve ediliyor
- [ ] SPA routing çalışıyor
- [ ] Assets yükleniyor

### Database
- [ ] Firebase bağlantısı test edildi
- [ ] Seed data yüklendi (opsiyonel)
- [ ] Indexes oluşturuldu
- [ ] Backup ayarlandı

## 🧪 Test

### Fonksiyonel Testler
- [ ] Login çalışıyor
- [ ] Dashboard yükleniyor
- [ ] Anket oluşturma çalışıyor
- [ ] Anket doldurma çalışıyor
- [ ] Cevaplar kaydediliyor
- [ ] AI analiz çalışıyor
- [ ] Rapor indirme çalışıyor
- [ ] Audit log çalışıyor

### Güvenlik Testler
- [ ] Token olmadan admin paneline erişilemiyor
- [ ] Rate limiting çalışıyor
- [ ] IP bazlı koruma çalışıyor
- [ ] KVKK onayı zorunlu
- [ ] Tekrar anket doldurma engellenmiş

### Performance Testler
- [ ] Sayfa yükleme < 3 saniye
- [ ] API response < 1 saniye
- [ ] AI analiz < 30 saniye
- [ ] Concurrent users test edildi

### Mobil Testler
- [ ] iOS Safari test edildi
- [ ] Android Chrome test edildi
- [ ] Responsive tasarım çalışıyor
- [ ] Touch events çalışıyor
- [ ] Likert seçenekleri okunuyor

### Browser Testler
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## 📱 Domain Ayarları

### DNS Records
```
Type: A
Name: anket
Value: <sunucu-ip-adresi>
TTL: 3600
```

### SSL Kurulumu
```bash
sudo certbot --nginx -d anket.tusahastanesi.com
```

## 🔄 Monitoring & Maintenance

### Günlük Kontroller
- [ ] PM2 process durumu
- [ ] Nginx error logs
- [ ] Disk kullanımı
- [ ] Memory kullanımı
- [ ] Response times

### Haftalık Kontroller
- [ ] Backup kontrolü
- [ ] Security updates
- [ ] Log rotation
- [ ] Performance metrics

### Aylık Kontroller
- [ ] SSL sertifika yenileme
- [ ] Dependency updates
- [ ] Security audit
- [ ] User feedback review

## 🆘 Acil Durum

### Backend Çöktü
```bash
pm2 restart tusa-anket-backend
pm2 logs --lines 100
```

### Database Bağlantı Sorunu
- Firebase Console kontrol et
- Credentials doğrula
- Network bağlantısı kontrol et

### Yüksek Trafik
```bash
# PM2 instance sayısını artır
pm2 scale tusa-anket-backend +2
```

### Rollback
```bash
git checkout <previous-commit>
npm install
pm2 restart all
```

## 📊 Metrics

### Takip Edilmesi Gerekenler
- Günlük anket sayısı
- Response time
- Error rate
- Uptime percentage
- Memory/CPU usage
- Disk usage

### Alerting
- Uptime monitoring (UptimeRobot, Pingdom)
- Error tracking (Sentry)
- Performance monitoring (New Relic, DataDog)

## 🎯 Go-Live Sonrası

### İlk 24 Saat
- [ ] Sürekli monitoring
- [ ] Log takibi
- [ ] Performance metrikleri
- [ ] User feedback

### İlk Hafta
- [ ] Günlük backup kontrolü
- [ ] Performance optimizasyonu
- [ ] Bug fixes
- [ ] User training

### İlk Ay
- [ ] Feature requests
- [ ] Performance tuning
- [ ] Security audit
- [ ] Documentation update

## 🎉 Başarı Kriterleri

- ✅ %99.9 uptime
- ✅ < 2 saniye sayfa yükleme
- ✅ Sıfır güvenlik açığı
- ✅ Pozitif user feedback
- ✅ Günlük backup
- ✅ 24/7 monitoring

---

**Hazırlayan:** Kiro AI
**Tarih:** 21 Kasım 2024
**Versiyon:** 1.0.0
