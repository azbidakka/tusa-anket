import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// OpenAI API kullanımı (opsiyonel - yoksa mock response)
let openai = null;
try {
  const OpenAIModule = await import('openai');
  const OpenAI = OpenAIModule.default;
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here') {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    console.log('✅ OpenAI API aktif - GPT-4o-mini kullanılacak');
  } else {
    console.log('⚠️  OpenAI API key bulunamadı - mock mode aktif');
  }
} catch (error) {
  console.log('⚠️  OpenAI paketi yüklü değil - mock mode aktif:', error.message);
}

// AI Analiz ve Yorumlama
router.post('/analyze', authenticateToken, async (req, res) => {
  console.log('🤖 AI Analiz isteği alındı');
  try {
    const { stats } = req.body;
    
    if (!stats) {
      console.log('❌ Stats verisi eksik');
      return res.status(400).json({ error: 'İstatistik verisi gerekli' });
    }

    console.log('📊 Stats:', JSON.stringify(stats, null, 2));
    let analysis = null;

    // OpenAI varsa gerçek analiz yap
    if (openai) {
      console.log('🌟 OpenAI ile analiz başlatılıyor...');
      try {
        const prompt = `Sen bir hasta memnuniyeti analiz uzmanısın. Aşağıdaki sağlık kurumu anket verilerini analiz et ve Türkçe olarak detaylı yorumla:

📊 İstatistikler:
- Toplam Anket: ${stats.totalResponses}
- Ortalama Memnuniyet: ${stats.avgSatisfaction}/5.0
- Net Promoter Score (NPS): ${stats.avgNPS}/10
- Aktif Anket Sayısı: ${stats.activeSurveys}

${stats.satisfactionDistribution ? `
⭐ Memnuniyet Dağılımı:
${stats.satisfactionDistribution.map(s => `- ${s.label}: ${s.adet} anket`).join('\n')}
` : ''}

${stats.channelDistribution ? `
📱 Kanal Dağılımı:
${stats.channelDistribution.map(c => `- ${c.kanal}: ${c.adet} anket`).join('\n')}
` : ''}

Lütfen şu başlıklar altında analiz yap:

1. **Genel Durum**: Mevcut performansın genel değerlendirmesi
2. **Güçlü Yönler**: Başarılı olan alanlar
3. **Gelişim Alanları**: İyileştirilmesi gereken noktalar
4. **Öneriler**: Somut ve uygulanabilir 3-4 öneri
5. **Trend Yorumu**: Verilerin gösterdiği eğilimler
6. **📋 Yönetici Özeti**: Tüm analizin özeti (Genel Performans, NPS Skoru, En Güçlü Yön, Öncelikli Alan, Aksiyon Önceliği formatında)

Yanıtını profesyonel ama anlaşılır bir dille, madde işaretleri kullanarak ver. Yönetici özetini "**Alan:** Değer" formatında yaz.`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { 
              role: 'system', 
              content: 'Sen TUSA Hastanesi için hasta memnuniyeti analiz yapan bir uzmansın. Verilen istatistikleri yorumlayıp somut öneriler sunuyorsun.' 
            },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 1500
        });

        analysis = {
          text: completion.choices[0].message.content,
          timestamp: new Date().toISOString(),
          model: 'gpt-4o-mini',
          isReal: true
        };
        console.log('✅ OpenAI analizi tamamlandı');
      } catch (error) {
        console.error('❌ OpenAI API hatası:', error.message);
        // Hata durumunda mock'a düş
        console.log('🔄 Mock analize geçiliyor...');
        analysis = generateMockAnalysis(stats);
      }
    } else {
      // OpenAI yoksa mock analiz
      console.log('🔧 Mock analiz kullanılıyor');
      analysis = generateMockAnalysis(stats);
    }

    console.log('✅ Analiz gönderiliyor');
    res.json(analysis);
  } catch (error) {
    console.error('❌ AI analiz hatası:', error);
    res.status(500).json({ error: 'Analiz oluşturulamadı: ' + error.message });
  }
});

// Mock analiz üretici
function generateMockAnalysis(stats) {
  const satisfaction = parseFloat(stats.avgSatisfaction) || 0;
  const nps = parseFloat(stats.avgNPS) || 0;
  const total = stats.totalResponses || 0;

  let generalStatus = '';
  let strengths = [];
  let improvements = [];
  let recommendations = [];
  let trends = '';

  // Genel durum
  if (satisfaction >= 4.0 && nps >= 8.0) {
    generalStatus = '🎉 **Mükemmel Performans**: Hasta memnuniyeti ve sadakati çok yüksek seviyede. Mevcut kalite standartlarınız sektör ortalamasının üzerinde.';
  } else if (satisfaction >= 3.5 && nps >= 6.0) {
    generalStatus = '👍 **İyi Performans**: Genel memnuniyet olumlu ancak iyileştirme potansiyeli mevcut. Bazı alanlarda odaklanma gerekiyor.';
  } else {
    generalStatus = '⚠️ **Gelişim Gerekli**: Hasta memnuniyeti beklenen seviyelerin altında. Acil aksiyonlar ve iyileştirmeler öncelikli.';
  }

  // Güçlü yönler
  if (total > 50) {
    strengths.push('Yüksek katılım oranı - Hastalarınız geri bildirim vermeye istekli');
  }
  if (satisfaction >= 4.0) {
    strengths.push('Memnuniyet skoru sektör ortalamasının üzerinde');
  }
  if (nps >= 8.0) {
    strengths.push('Güçlü hasta sadakati ve tavsiye eğilimi');
  }
  if (stats.activeSurveys >= 3) {
    strengths.push('Çeşitli anket türleriyle kapsamlı veri toplama');
  }

  // Gelişim alanları
  if (satisfaction < 4.0) {
    improvements.push('Genel memnuniyet skorunu artırmak için hizmet kalitesi iyileştirmeleri');
  }
  if (nps < 7.0) {
    improvements.push('Hasta sadakatini artıracak deneyim iyileştirmeleri');
  }
  if (total < 30) {
    improvements.push('Anket katılım oranını artırmak için teşvik mekanizmaları');
  }
  
  const lowScores = stats.satisfactionDistribution?.filter(s => s.puan <= 2 && s.adet > 0) || [];
  if (lowScores.length > 0) {
    improvements.push('Düşük puan veren hastaların şikayetlerini analiz etme');
  }

  // Öneriler
  if (satisfaction < 4.0) {
    recommendations.push('**Hızlı Aksiyon**: Düşük puan veren hastaları arayıp sorunları dinleyin ve çözüm sunun');
    recommendations.push('**Personel Eğitimi**: Hasta iletişimi ve empati konusunda ekip eğitimleri düzenleyin');
  }
  
  recommendations.push('**Kanal Optimizasyonu**: En çok kullanılan kanalları güçlendirin, düşük performanslı kanalları gözden geçirin');
  recommendations.push('**Periyodik Takip**: Aylık trend analizleri yaparak iyileştirmelerin etkisini ölçün');
  
  if (total > 100) {
    recommendations.push('**Segmentasyon**: Farklı hasta gruplarının (yaş, bölüm, tedavi türü) memnuniyetini ayrı ayrı analiz edin');
  }

  // Trend yorumu
  if (total > 50) {
    trends = `Toplam ${total} anket verisi, istatistiksel olarak anlamlı sonuçlar çıkarmak için yeterli. `;
  } else {
    trends = `Daha güvenilir trendler için veri sayısını artırmanız önerilir. `;
  }

  if (satisfaction >= 4.0) {
    trends += 'Mevcut yüksek memnuniyet seviyesini korumak için sürekli iyileştirme kültürü oluşturun.';
  } else {
    trends += 'Düşük skorların temel nedenlerini belirleyip hızlı aksiyonlar alın.';
  }

  // Özet oluştur
  const summary = {
    status: satisfaction >= 4.0 && nps >= 8.0 ? 'Mükemmel' : satisfaction >= 3.5 && nps >= 6.0 ? 'İyi' : 'Gelişmeli',
    score: satisfaction,
    nps: nps,
    totalResponses: total,
    keyStrength: strengths[0] || 'Veri toplama başlatıldı',
    keyImprovement: improvements[0] || 'Daha fazla veri gerekli',
    priority: satisfaction < 3.5 ? 'Yüksek' : satisfaction < 4.0 ? 'Orta' : 'Düşük'
  };

  const analysisText = `
## 1. Genel Durum
${generalStatus}

## 2. Güçlü Yönler
${strengths.length > 0 ? strengths.map(s => `• ${s}`).join('\n') : '• Veri toplama sürecinde ilk adımlar atılıyor'}

## 3. Gelişim Alanları
${improvements.length > 0 ? improvements.map(i => `• ${i}`).join('\n') : '• Daha fazla veri toplandıkça netleşecek'}

## 4. Öneriler
${recommendations.map(r => `• ${r}`).join('\n')}

## 5. Trend Yorumu
${trends}

---

## 📋 Yönetici Özeti

**Genel Performans:** ${summary.status} (${summary.score}/5.0)
**NPS Skoru:** ${summary.nps}/10
**Toplam Katılım:** ${summary.totalResponses} anket
**En Güçlü Yön:** ${summary.keyStrength}
**Öncelikli Alan:** ${summary.keyImprovement}
**Aksiyon Önceliği:** ${summary.priority}

---
*Bu analiz ${new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} tarihinde oluşturulmuştur.*
  `.trim();

  return {
    text: analysisText,
    timestamp: new Date().toISOString(),
    model: 'mock-analyzer',
    isReal: false
  };
}

export default router;
