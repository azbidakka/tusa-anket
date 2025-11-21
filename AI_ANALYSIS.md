# 🤖 AI Destekli Dashboard Analizi

## Özellikler

Dashboard'a yapay zeka destekli analiz ve yorumlama sistemi eklendi. Sistem, anket verilerinizi otomatik olarak analiz edip somut öneriler sunar.

## Nasıl Çalışır?

### 1. Mock Mode (Varsayılan)
OpenAI API key olmadan çalışır. Akıllı algoritmalarla verilerinizi analiz eder:
- Memnuniyet skorlarına göre durum değerlendirmesi
- Güçlü yönlerin tespiti
- Gelişim alanlarının belirlenmesi
- Somut ve uygulanabilir öneriler
- Trend yorumları

### 2. OpenAI Mode (Opsiyonel)
OpenAI API key eklendiğinde GPT-4o-mini ile gerçek AI analizi:
- Daha detaylı ve bağlamsal yorumlar
- Sektör standartlarıyla karşılaştırma
- Özelleştirilmiş öneriler
- Profesyonel raporlama

## Kurulum

### OpenAI API Kullanımı (Opsiyonel)

1. **OpenAI Paketi Yükle**
```bash
cd backend
npm install openai
```

2. **API Key Ekle**
`.env` dosyasına ekleyin:
```env
OPENAI_API_KEY=sk-your-actual-api-key-here
```

3. **Backend'i Yeniden Başlat**
```bash
npm run dev
```

## Kullanım

1. Dashboard sayfasına gidin
2. Filtreleri ayarlayın (tarih, anket seçimi)
3. "AI Destekli Analiz ve Öneriler" kartında **"✨ Analiz Oluştur"** butonuna tıklayın
4. Analiz sonuçlarını okuyun

## Analiz İçeriği

### 1. Genel Durum
Mevcut performansın genel değerlendirmesi ve sektör karşılaştırması

### 2. Güçlü Yönler
- Yüksek katılım oranı
- İyi memnuniyet skorları
- Etkili kanallar
- Başarılı anket türleri

### 3. Gelişim Alanları
- İyileştirilmesi gereken metrikler
- Düşük performans gösteren alanlar
- Katılım artırma fırsatları

### 4. Öneriler
Somut ve uygulanabilir aksiyonlar:
- Hızlı müdahale gerektiren konular
- Personel eğitimi önerileri
- Kanal optimizasyonu
- Periyodik takip stratejileri

### 5. Trend Yorumu
Verilerin gösterdiği eğilimler ve gelecek öngörüleri

## API Endpoint

### POST `/api/ai/analyze`
**Auth Required:** ✅ Yes (JWT Token)

**Request Body:**
```json
{
  "stats": {
    "totalResponses": 150,
    "avgSatisfaction": 4.2,
    "avgNPS": 8.5,
    "activeSurveys": 4,
    "satisfactionDistribution": [...],
    "channelDistribution": [...]
  }
}
```

**Response:**
```json
{
  "text": "## 1. Genel Durum\n...",
  "timestamp": "2024-11-21T10:30:00.000Z",
  "model": "gpt-4o-mini",
  "isReal": true
}
```

## Maliyet (OpenAI Mode)

GPT-4o-mini kullanımı:
- Input: ~$0.15 / 1M tokens
- Output: ~$0.60 / 1M tokens
- Ortalama analiz: ~1000 token
- **Tahmini maliyet: ~$0.001 per analiz** (çok düşük)

## Güvenlik

- ✅ JWT authentication gerekli
- ✅ API key .env dosyasında güvenli
- ✅ Rate limiting koruması
- ✅ Hata durumunda mock mode'a düşer

## Özelleştirme

`backend/src/routes/ai.js` dosyasında:
- Prompt'u düzenleyebilirsiniz
- Model değiştirebilirsiniz (gpt-4, gpt-3.5-turbo)
- Temperature ayarlayabilirsiniz
- Max token limitini değiştirebilirsiniz

## Notlar

- Mock mode ücretsiz ve sınırsız kullanım
- OpenAI mode opsiyonel, daha detaylı analizler için
- Analiz sonuçları cache'lenmez, her seferinde yeni oluşturulur
- Filtrelere göre dinamik analiz yapılır
