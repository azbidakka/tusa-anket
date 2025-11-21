import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [responses, setResponses] = useState([]);
  const [allResponses, setAllResponses] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtreleme state'leri
  const [dateFilter, setDateFilter] = useState('thisMonth');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedSurvey, setSelectedSurvey] = useState('all');
  
  // AI Analiz state'i
  const [aiAnalysis, setAiAnalysis] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [dateFilter, startDate, endDate, selectedSurvey, allResponses]);

  const loadData = async () => {
    try {
      const [statsRes, responsesRes, surveysRes] = await Promise.all([
        axios.get('/api/responses/stats/dashboard'),
        axios.get('/api/responses'),
        axios.get('/api/surveys')
      ]);
      setStats(statsRes.data);
      setAllResponses(responsesRes.data);
      setResponses(responsesRes.data);
      setSurveys(surveysRes.data);
    } catch (error) {
      console.error('Stats load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allResponses];
    
    // Tarih filtresi
    const now = new Date();
    if (dateFilter === 'today') {
      const today = now.toISOString().split('T')[0];
      filtered = filtered.filter(r => r.submitted_at?.startsWith(today));
    } else if (dateFilter === 'thisWeek') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(r => new Date(r.submitted_at) >= weekAgo);
    } else if (dateFilter === 'thisMonth') {
      const monthKey = now.toISOString().slice(0, 7);
      filtered = filtered.filter(r => r.submitted_at?.startsWith(monthKey));
    } else if (dateFilter === 'last3Months') {
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      filtered = filtered.filter(r => new Date(r.submitted_at) >= threeMonthsAgo);
    } else if (dateFilter === 'custom' && startDate && endDate) {
      filtered = filtered.filter(r => {
        const date = r.submitted_at?.split('T')[0];
        return date >= startDate && date <= endDate;
      });
    }
    
    // Anket filtresi
    if (selectedSurvey !== 'all') {
      filtered = filtered.filter(r => r.template_id === selectedSurvey);
    }
    
    setResponses(filtered);
  };

  // Aylık trend verisi - filtrelenmiş veriye göre
  const getMonthlyTrend = () => {
    const last6Months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toISOString().slice(0, 7);
      const monthName = date.toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' });
      
      const count = allResponses.filter(r => r.submitted_at?.startsWith(monthKey)).length;
      last6Months.push({ 
        ay: monthName,
        cevapSayisi: count 
      });
    }
    
    return last6Months;
  };

  // Anket bazında dağılım
  const getSurveyDistribution = () => {
    return surveys.map(survey => {
      const count = responses.filter(r => r.template_id === survey.id).length;
      // Anket adını kısalt
      const shortName = survey.name.replace('Anketi', '').trim();
      return {
        anket: shortName,
        cevap: count
      };
    }).filter(item => item.cevap > 0); // Sadece cevabı olanları göster
  };

  // Kanal dağılımı
  const getChannelDistribution = () => {
    const channels = ['SMS', 'WhatsApp', 'E-posta', 'QR'];
    return channels.map(channel => {
      const count = responses.filter(r => r.channel === channel).length;
      return {
        kanal: channel,
        adet: count
      };
    }).filter(item => item.adet > 0); // Sadece kullanılanları göster
  };

  // NPS dağılımı
  const getNPSDistribution = () => {
    const withNPS = responses.filter(r => r.nps !== null && r.nps !== undefined);
    const detractors = withNPS.filter(r => r.nps >= 0 && r.nps <= 6).length;
    const passives = withNPS.filter(r => r.nps >= 7 && r.nps <= 8).length;
    const promoters = withNPS.filter(r => r.nps >= 9 && r.nps <= 10).length;
    
    return [
      { kategori: 'Eleştirmen', adet: detractors, color: '#EF4444' },
      { kategori: 'Pasif', adet: passives, color: '#F59E0B' },
      { kategori: 'Destekleyen', adet: promoters, color: '#10B981' }
    ].filter(item => item.adet > 0);
  };

  // Memnuniyet dağılımı - ortalamaya göre sıralı
  const getSatisfactionDistribution = () => {
    const withScore = responses.filter(r => r.overall_score);
    const distribution = [
      { puan: 1, label: '1 Yıldız', adet: withScore.filter(r => r.overall_score >= 1 && r.overall_score < 2).length },
      { puan: 2, label: '2 Yıldız', adet: withScore.filter(r => r.overall_score >= 2 && r.overall_score < 3).length },
      { puan: 3, label: '3 Yıldız', adet: withScore.filter(r => r.overall_score >= 3 && r.overall_score < 4).length },
      { puan: 4, label: '4 Yıldız', adet: withScore.filter(r => r.overall_score >= 4 && r.overall_score < 5).length },
      { puan: 5, label: '5 Yıldız', adet: withScore.filter(r => r.overall_score >= 4.5).length }
    ];
    
    // Ortalama hesapla
    const totalScore = distribution.reduce((sum, item) => sum + (item.puan * item.adet), 0);
    const totalCount = distribution.reduce((sum, item) => sum + item.adet, 0);
    const avgScore = totalCount > 0 ? (totalScore / totalCount).toFixed(1) : 0;
    
    return { distribution, avgScore };
  };

  const COLORS = ['#0A6A39', '#1E7D4E', '#10B981', '#34D399', '#6EE7B7'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Yükleniyor...</div>
      </div>
    );
  }

  const monthlyData = getMonthlyTrend();
  const surveyData = getSurveyDistribution();
  const channelData = getChannelDistribution();
  const npsData = getNPSDistribution();
  const { distribution: satisfactionData, avgScore: satisfactionAvg } = getSatisfactionDistribution();
  
  // Filtrelenmiş istatistikler
  const filteredStats = {
    totalResponses: responses.length,
    avgSatisfaction: responses.filter(r => r.overall_score).length > 0 
      ? (responses.reduce((sum, r) => sum + (r.overall_score || 0), 0) / responses.filter(r => r.overall_score).length).toFixed(1)
      : 0,
    avgNPS: responses.filter(r => r.nps !== null && r.nps !== undefined).length > 0
      ? (responses.reduce((sum, r) => sum + (r.nps || 0), 0) / responses.filter(r => r.nps !== null && r.nps !== undefined).length).toFixed(1)
      : 0
  };

  // Rapor indirme fonksiyonları
  const downloadExcelReport = () => {
    const dateStr = new Date().toLocaleDateString('tr-TR').replace(/\./g, '-');
    const filterInfo = dateFilter === 'custom' ? `${startDate}_${endDate}` : dateFilter;
    
    // CSV formatında veri hazırla
    let csv = '\uFEFF'; // UTF-8 BOM for Excel
    csv += 'TUSA HASTANESİ - ANKET RAPORU\n';
    csv += `Rapor Tarihi: ${new Date().toLocaleString('tr-TR')}\n`;
    csv += `Filtre: ${getFilterLabel()}\n\n`;
    
    // Özet İstatistikler
    csv += 'ÖZET İSTATİSTİKLER\n';
    csv += 'Metrik,Değer\n';
    csv += `Toplam Anket,${filteredStats.totalResponses}\n`;
    csv += `Ortalama Memnuniyet,${filteredStats.avgSatisfaction}/5.0\n`;
    csv += `Net Promoter Score,${filteredStats.avgNPS}/10\n`;
    csv += `Aktif Anketler,${surveys.filter(s => s.is_active).length}\n\n`;
    
    // Memnuniyet Dağılımı
    csv += 'MEMNUNİYET DAĞILIMI\n';
    csv += 'Yıldız,Anket Sayısı\n';
    satisfactionData.forEach(item => {
      csv += `${item.label},${item.adet}\n`;
    });
    csv += '\n';
    
    // Anket Bazında Dağılım
    csv += 'ANKET BAZINDA DAĞILIM\n';
    csv += 'Anket Adı,Cevap Sayısı\n';
    surveyData.forEach(item => {
      csv += `${item.anket},${item.cevap}\n`;
    });
    csv += '\n';
    
    // Kanal Dağılımı
    csv += 'KANAL DAĞILIMI\n';
    csv += 'Kanal,Adet\n';
    channelData.forEach(item => {
      csv += `${item.kanal},${item.adet}\n`;
    });
    csv += '\n';
    
    // AI Analizi (varsa)
    if (aiAnalysis) {
      csv += 'AI ANALİZİ VE ÖNERİLER\n';
      csv += `Model: ${aiAnalysis.isReal ? 'OpenAI GPT-4o-mini' : 'Mock Analyzer'}\n`;
      csv += `Tarih: ${new Date(aiAnalysis.timestamp).toLocaleString('tr-TR')}\n\n`;
      
      // Analiz metnini temizle ve ekle
      const cleanText = aiAnalysis.text
        .replace(/##/g, '')
        .replace(/\*\*/g, '')
        .replace(/•/g, '-')
        .trim();
      csv += cleanText + '\n';
    }
    
    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `TUSA_Anket_Raporu_${dateStr}_${filterInfo}.csv`;
    link.click();
  };

  const downloadPDFReport = () => {
    // HTML formatında güzel bir rapor oluştur
    const dateStr = new Date().toLocaleDateString('tr-TR');
    const timeStr = new Date().toLocaleTimeString('tr-TR');
    
    let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>TUSA Anket Raporu</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
    .header { text-align: center; border-bottom: 3px solid #0A6A39; padding-bottom: 20px; margin-bottom: 30px; }
    .header img { max-width: 200px; height: auto; margin-bottom: 15px; }
    .header h1 { color: #0A6A39; margin: 0; font-size: 28px; }
    .header p { color: #666; margin: 5px 0; }
    .section { margin: 30px 0; page-break-inside: avoid; }
    .section h2 { color: #0A6A39; border-bottom: 2px solid #0A6A39; padding-bottom: 10px; font-size: 20px; }
    .kpi-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
    .kpi-card { border: 2px solid #0A6A39; border-radius: 8px; padding: 20px; text-align: center; }
    .kpi-card .label { color: #666; font-size: 14px; margin-bottom: 10px; }
    .kpi-card .value { color: #0A6A39; font-size: 32px; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #0A6A39; color: white; padding: 12px; text-align: left; }
    td { padding: 10px; border-bottom: 1px solid #ddd; }
    tr:hover { background: #f5f5f5; }
    .footer { text-align: center; margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
    @media print { body { margin: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <img src="/src/assets/tusa-logo.png" alt="TUSA Hastanesi" style="max-width: 250px; height: auto; margin-bottom: 20px;">
    <h2 style="margin-top: 10px;">Hasta Memnuniyeti Anket Raporu</h2>
    <p>Rapor Tarihi: ${dateStr} ${timeStr}</p>
    <p>Filtre: ${getFilterLabel()}</p>
  </div>

  <div class="section">
    <h2>📊 Özet İstatistikler</h2>
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="label">Toplam Yapılan Anket</div>
        <div class="value">${filteredStats.totalResponses}</div>
      </div>
      <div class="kpi-card">
        <div class="label">Ortalama Memnuniyet</div>
        <div class="value">${filteredStats.avgSatisfaction}/5.0</div>
      </div>
      <div class="kpi-card">
        <div class="label">Net Promoter Score</div>
        <div class="value">${filteredStats.avgNPS}/10</div>
      </div>
      <div class="kpi-card">
        <div class="label">Aktif Anketler</div>
        <div class="value">${surveys.filter(s => s.is_active).length}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>⭐ Memnuniyet Dağılımı</h2>
    <table>
      <thead>
        <tr>
          <th>Yıldız Seviyesi</th>
          <th>Anket Sayısı</th>
          <th>Yüzde</th>
        </tr>
      </thead>
      <tbody>
        ${satisfactionData.map(item => {
          const total = satisfactionData.reduce((sum, i) => sum + i.adet, 0);
          const percent = total > 0 ? ((item.adet / total) * 100).toFixed(1) : 0;
          return `
            <tr>
              <td>${item.label}</td>
              <td>${item.adet}</td>
              <td>${percent}%</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2>📋 Anket Bazında Dağılım</h2>
    <table>
      <thead>
        <tr>
          <th>Anket Adı</th>
          <th>Cevap Sayısı</th>
        </tr>
      </thead>
      <tbody>
        ${surveyData.map(item => `
          <tr>
            <td>${item.anket}</td>
            <td>${item.cevap}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2>📱 Kanal Dağılımı</h2>
    <table>
      <thead>
        <tr>
          <th>Kanal</th>
          <th>Kullanım Sayısı</th>
        </tr>
      </thead>
      <tbody>
        ${channelData.map(item => `
          <tr>
            <td>${item.kanal}</td>
            <td>${item.adet}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  ${aiAnalysis ? `
  <div class="section" style="page-break-before: always;">
    <h2>🤖 AI Analizi ve Öneriler</h2>
    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
      <p style="margin: 0; color: #666; font-size: 13px;">
        <strong>Model:</strong> ${aiAnalysis.isReal ? '🌟 OpenAI GPT-4o-mini' : '🔧 Mock Analyzer'} | 
        <strong>Tarih:</strong> ${new Date(aiAnalysis.timestamp).toLocaleString('tr-TR')}
      </p>
    </div>
    <div style="line-height: 1.8; white-space: pre-wrap; font-size: 14px;">
      ${formatAIAnalysisForPDF(aiAnalysis.text)}
    </div>
  </div>
  ` : ''}

  <div class="footer">
    <p>Bu rapor TUSA Anket Sistemi tarafından otomatik olarak oluşturulmuştur.</p>
    <p>© ${new Date().getFullYear()} TUSA Hastanesi - Tüm hakları saklıdır.</p>
  </div>
</body>
</html>
    `;
    
    // Yeni pencerede aç ve yazdır
    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    
    // Yazdırma dialogunu aç
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const getFilterLabel = () => {
    if (dateFilter === 'today') return 'Bugün';
    if (dateFilter === 'thisWeek') return 'Bu Hafta';
    if (dateFilter === 'thisMonth') return 'Bu Ay';
    if (dateFilter === 'last3Months') return 'Son 3 Ay';
    if (dateFilter === 'custom') return `${startDate} - ${endDate}`;
    return 'Tüm Veriler';
  };

  const formatAIAnalysisForPDF = (text) => {
    return text
      .split('\n')
      .map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '<br>';
        
        // Başlıklar
        if (trimmed.startsWith('###')) {
          const title = trimmed.replace(/###/g, '').trim();
          return `<h3 style="color: #0A6A39; margin-top: 20px; margin-bottom: 10px; font-size: 18px;">${title}</h3>`;
        }
        if (trimmed.startsWith('##')) {
          const title = trimmed.replace(/##/g, '').trim();
          return `<h2 style="color: #0A6A39; margin-top: 25px; margin-bottom: 12px; font-size: 20px; border-bottom: 2px solid #0A6A39; padding-bottom: 8px;">${title}</h2>`;
        }
        
        // Liste öğeleri
        if (trimmed.startsWith('- ')) {
          const content = trimmed.replace('- ', '').replace(/\*\*/g, '<strong>').replace(/\*\*/g, '</strong>');
          return `<div style="margin-left: 20px; margin-bottom: 8px;">▸ ${content}</div>`;
        }
        
        // Ayırıcı
        if (trimmed === '---') {
          return '<hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">';
        }
        
        // Normal paragraf
        const formatted = trimmed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        return `<p style="margin-bottom: 10px;">${formatted}</p>`;
      })
      .join('');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-text-dark">Dashboard</h1>
          <p className="text-gray-600 mt-1">Anket performans özeti ve analizler</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={downloadExcelReport}
            className="btn-secondary text-sm flex items-center gap-2"
            title="Excel formatında indir"
          >
            📊 Excel İndir
          </button>
          <button 
            onClick={downloadPDFReport}
            className="btn-secondary text-sm flex items-center gap-2"
            title="PDF formatında yazdır"
          >
            📄 PDF Yazdır
          </button>
          <button onClick={loadData} className="btn-secondary text-sm">
            🔄 Yenile
          </button>
        </div>
      </div>

      {/* Filtreleme Paneli */}
      <div className="card mb-6 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tarih Filtresi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">📅 Tarih Aralığı</label>
            <select 
              value={dateFilter} 
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="today">Bugün</option>
              <option value="thisWeek">Bu Hafta</option>
              <option value="thisMonth">Bu Ay</option>
              <option value="last3Months">Son 3 Ay</option>
              <option value="custom">Özel Tarih</option>
            </select>
          </div>

          {/* Özel Tarih Seçimi */}
          {dateFilter === 'custom' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Başlangıç</label>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bitiş</label>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </>
          )}

          {/* Anket Filtresi */}
          <div className={dateFilter === 'custom' ? 'md:col-span-3' : ''}>
            <label className="block text-sm font-medium text-gray-700 mb-2">📋 Anket Seçimi</label>
            <select 
              value={selectedSurvey} 
              onChange={(e) => setSelectedSurvey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">Tüm Anketler</option>
              {surveys.map(survey => (
                <option key={survey.id} value={survey.id}>{survey.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* KPI Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-primary to-primary-dark text-white relative group">
          <div className="absolute top-3 right-3 cursor-help">
            <div className="w-5 h-5 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-xs">ℹ️</div>
            <div className="absolute right-0 top-6 w-64 bg-gray-900 text-white text-xs p-3 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              Seçili tarih aralığında ve filtrelere göre toplam doldurulan anket sayısı. Bu metrik, hasta katılım oranını gösterir.
            </div>
          </div>
          <div className="text-sm opacity-90 mb-2">Bu Ay Toplam Yapılan Anket</div>
          <div className="text-4xl font-bold mb-2">{filteredStats.totalResponses}</div>
          <div className="text-sm opacity-75">
            Toplam {allResponses.length} cevap
          </div>
        </div>
        
        <div className="card border-2 border-primary relative group">
          <div className="absolute top-3 right-3 cursor-help">
            <div className="w-5 h-5 bg-primary bg-opacity-20 rounded-full flex items-center justify-center text-xs">ℹ️</div>
            <div className="absolute right-0 top-6 w-64 bg-gray-900 text-white text-xs p-3 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              Tüm anketlerdeki yıldız puanlarının ortalaması (1-5 arası). 4 ve üzeri mükemmel, 3-4 arası iyi, 3'ün altı geliştirilmesi gereken alanları gösterir.
            </div>
          </div>
          <div className="text-sm text-gray-600 mb-2">Ort. Memnuniyet</div>
          <div className="text-4xl font-bold text-primary mb-2">{filteredStats.avgSatisfaction}</div>
          <div className="flex items-center">
            {[1,2,3,4,5].map(star => (
              <span key={star} className={`text-2xl ${star <= Math.round(filteredStats.avgSatisfaction || 0) ? 'text-yellow-400' : 'text-gray-300'}`}>
                ★
              </span>
            ))}
          </div>
        </div>
        
        <div className="card border-2 border-accent relative group">
          <div className="absolute top-3 right-3 cursor-help">
            <div className="w-5 h-5 bg-accent bg-opacity-20 rounded-full flex items-center justify-center text-xs">ℹ️</div>
            <div className="absolute right-0 top-6 w-64 bg-gray-900 text-white text-xs p-3 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              Net Promoter Score: Hastaların sizi tavsiye etme olasılığı (0-10). 9-10 destekleyenler, 7-8 pasifler, 0-6 eleştirmenler olarak değerlendirilir. Yüksek NPS müşteri sadakatini gösterir.
            </div>
          </div>
          <div className="text-sm text-gray-600 mb-2">Net Promoter Score</div>
          <div className="text-4xl font-bold text-accent mb-2">{filteredStats.avgNPS}</div>
          <div className="text-sm text-gray-500">
            {(filteredStats.avgNPS || 0) >= 9 ? '🎉 Mükemmel' : 
             (filteredStats.avgNPS || 0) >= 7 ? '👍 İyi' : '⚠️ Gelişmeli'}
          </div>
        </div>
        
        <div className="card bg-gray-50 relative group">
          <div className="absolute top-3 right-3 cursor-help">
            <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center text-xs">ℹ️</div>
            <div className="absolute right-0 top-6 w-64 bg-gray-900 text-white text-xs p-3 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              Şu anda yayında olan ve hasta cevaplarına açık anket sayısı. Pasif anketler bu sayıya dahil değildir.
            </div>
          </div>
          <div className="text-sm text-gray-600 mb-2">Aktif Anketler</div>
          <div className="text-4xl font-bold text-gray-800 mb-2">{surveys.filter(s => s.is_active).length}</div>
          <div className="text-sm text-gray-500">Toplam {surveys.length} anket</div>
        </div>
      </div>

      {/* Grafikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Aylık Trend */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">📈 Aylık Cevap Trendi</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="ay" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB' }}
                labelStyle={{ color: '#0B1320' }}
              />
              <Line 
                type="monotone" 
                dataKey="cevapSayisi" 
                name="Cevap Sayısı"
                stroke="#0A6A39" 
                strokeWidth={3} 
                dot={{ fill: '#0A6A39', r: 5 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Anket Dağılımı */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">📊 Anket Bazında Dağılım</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={surveyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="anket" stroke="#6B7280" style={{ fontSize: '11px' }} />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB' }}
              />
              <Bar dataKey="cevap" name="Cevap Sayısı" fill="#0A6A39" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Kanal Dağılımı */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">📱 Kanal Dağılımı</h3>
          {channelData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ kanal, adet }) => `${kanal}: ${adet}`}
                  outerRadius={80}
                  dataKey="adet"
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-500">
              Henüz kanal verisi yok
            </div>
          )}
        </div>
      </div>

      {/* Memnuniyet Detayı */}
      <div className="card mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">⭐ Memnuniyet Dağılımı</h3>
          <div className="text-sm text-gray-600">
            Ortalama: <span className="font-bold text-primary text-lg">{satisfactionAvg}</span> / 5.0
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={satisfactionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="label" stroke="#6B7280" style={{ fontSize: '12px' }} />
            <YAxis stroke="#6B7280" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB' }}
              formatter={(value, name) => [value, 'Anket Sayısı']}
            />
            <Bar dataKey="adet" fill="#F59E0B" radius={[8, 8, 0, 0]}>
              {satisfactionData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.puan >= 4 ? '#10B981' : entry.puan >= 3 ? '#F59E0B' : '#EF4444'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* AI Analiz ve Yorumlama */}
      <AIAnalysis 
        stats={{
          totalResponses: filteredStats.totalResponses,
          avgSatisfaction: filteredStats.avgSatisfaction,
          avgNPS: filteredStats.avgNPS,
          activeSurveys: surveys.filter(s => s.is_active).length,
          satisfactionDistribution: satisfactionData,
          channelDistribution: channelData
        }}
        onAnalysisComplete={setAiAnalysis}
      />

      {/* Son Aktiviteler */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">🕐 Son Cevaplar</h3>
        <div className="space-y-3">
          {responses.slice(0, 5).map((response, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-button">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                  {idx + 1}
                </div>
                <div>
                  <div className="font-medium text-sm">
                    {surveys.find(s => s.id === response.template_id)?.name || 'Anket'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(response.submitted_at).toLocaleString('tr-TR')}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                  {response.channel}
                </span>
                {response.overall_score && (
                  <span className="font-semibold text-primary">
                    {response.overall_score.toFixed(1)} ⭐
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// AI Analiz Bileşeni
const AIAnalysis = ({ stats, onAnalysisComplete }) => {
  const [analysis, setAnalysis] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [error, setError] = React.useState(null);

  const generateAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/ai/analyze', { stats });
      setAnalysis(response.data);
      setExpanded(true);
      // Parent component'e analizi gönder
      if (onAnalysisComplete) {
        onAnalysisComplete(response.data);
      }
    } catch (error) {
      console.error('AI analiz hatası:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Analiz oluşturulamadı';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const formatAnalysisText = (text) => {
    // Markdown formatını HTML'e çevir
    const lines = text.split('\n');
    const elements = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      
      // Boş satırları atla
      if (!trimmed) continue;
      
      // ### Başlıklar (H3)
      if (trimmed.startsWith('### ')) {
        const title = trimmed.replace('### ', '');
        const isSummary = title.includes('📋');
        
        if (isSummary) {
          elements.push(
            <div key={i} className="mt-6 mb-4 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border-l-4 border-primary">
              <h3 className="text-xl font-bold text-primary">{title}</h3>
            </div>
          );
        } else {
          elements.push(
            <h3 key={i} className="text-lg font-bold text-primary mt-6 mb-3 pb-2 border-b-2 border-primary/30">
              {title}
            </h3>
          );
        }
        continue;
      }
      
      // ## Başlıklar (H2)
      if (trimmed.startsWith('## ')) {
        const title = trimmed.replace('## ', '');
        elements.push(
          <h2 key={i} className="text-xl font-bold text-primary mt-6 mb-3 pb-2 border-b-2 border-primary/30">
            {title}
          </h2>
        );
        continue;
      }
      
      // Ayırıcı çizgi
      if (trimmed === '---') {
        elements.push(<hr key={i} className="my-5 border-gray-300" />);
        continue;
      }
      
      // Liste öğeleri (- ile başlayan)
      if (trimmed.startsWith('- ')) {
        const content = trimmed.replace('- ', '');
        const formatted = formatInlineMarkdown(content);
        elements.push(
          <li key={i} className="ml-6 mb-2 text-gray-700 flex items-start gap-2 list-none">
            <span className="text-primary mt-1 flex-shrink-0">▸</span>
            <span className="flex-1">{formatted}</span>
          </li>
        );
        continue;
      }
      
      // İtalik text (timestamp)
      if (trimmed.startsWith('*') && trimmed.endsWith('*') && !trimmed.includes('**')) {
        elements.push(
          <p key={i} className="text-xs text-gray-500 italic mt-4 text-center bg-gray-50 py-2 rounded">
            {trimmed.replace(/\*/g, '')}
          </p>
        );
        continue;
      }
      
      // Normal paragraf
      const formatted = formatInlineMarkdown(trimmed);
      elements.push(
        <p key={i} className="text-gray-700 mb-2 leading-relaxed">
          {formatted}
        </p>
      );
    }
    
    return elements;
  };
  
  // Inline markdown formatları (bold, italic)
  const formatInlineMarkdown = (text) => {
    const parts = [];
    let currentText = text;
    let key = 0;
    
    // **bold** formatını işle
    const boldRegex = /\*\*(.+?)\*\*/g;
    let lastIndex = 0;
    let match;
    
    while ((match = boldRegex.exec(text)) !== null) {
      // Bold'dan önceki text
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${key++}`}>
            {text.substring(lastIndex, match.index)}
          </span>
        );
      }
      
      // Bold text
      parts.push(
        <strong key={`bold-${key++}`} className="font-bold text-gray-900">
          {match[1]}
        </strong>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Kalan text
    if (lastIndex < text.length) {
      parts.push(
        <span key={`text-${key++}`}>
          {text.substring(lastIndex)}
        </span>
      );
    }
    
    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="card mb-8 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl">
            🤖
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">AI Destekli Analiz ve Öneriler</h3>
            <p className="text-sm text-gray-600">Verilerinizi yapay zeka ile yorumlayın</p>
          </div>
        </div>
        <button 
          onClick={generateAnalysis}
          disabled={loading}
          className="btn-primary flex items-center gap-2"
        >
          {loading ? (
            <>
              <span className="animate-spin">⚙️</span>
              Analiz Ediliyor...
            </>
          ) : (
            <>
              ✨ Analiz Oluştur
            </>
          )}
        </button>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-sm animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-4 bg-gradient-to-r from-purple-200 to-blue-200 rounded"></div>
            <div className="w-32 h-4 bg-gradient-to-r from-purple-200 to-blue-200 rounded"></div>
          </div>
          <div className="space-y-3">
            <div className="h-6 bg-gradient-to-r from-purple-100 to-blue-100 rounded w-3/4"></div>
            <div className="h-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded w-full"></div>
            <div className="h-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded w-5/6"></div>
            <div className="h-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded w-4/5"></div>
            <div className="mt-4 h-6 bg-gradient-to-r from-purple-100 to-blue-100 rounded w-2/3"></div>
            <div className="h-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded w-full"></div>
            <div className="h-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded w-11/12"></div>
            <div className="h-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded w-5/6"></div>
            <div className="mt-4 h-6 bg-gradient-to-r from-purple-100 to-blue-100 rounded w-1/2"></div>
            <div className="h-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded w-full"></div>
            <div className="h-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded w-4/5"></div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-purple-600">
            <span className="animate-bounce">🤖</span>
            <span>AI analiz yapıyor, lütfen bekleyin...</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && !loading && (
        <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <h4 className="font-semibold text-red-800 mb-1">Analiz Oluşturulamadı</h4>
              <p className="text-sm text-red-600 mb-2">{error}</p>
              <button 
                onClick={generateAnalysis}
                className="text-sm text-red-700 underline hover:text-red-900"
              >
                Tekrar Dene
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Result */}
      {analysis && expanded && !loading && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className={`px-2 py-1 rounded text-xs ${analysis.isReal ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                {analysis.isReal ? '🌟 OpenAI GPT-4' : '🔧 Mock Analyzer'}
              </span>
              <span>{new Date(analysis.timestamp).toLocaleString('tr-TR')}</span>
            </div>
            <button 
              onClick={() => setExpanded(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <div className="prose max-w-none">
            {formatAnalysisText(analysis.text)}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!analysis && !loading && !error && (
        <div className="text-center py-8 text-gray-500">
          <p className="mb-2">📊 Mevcut verilerinizi AI ile analiz edin</p>
          <p className="text-sm">Güçlü yönlerinizi, gelişim alanlarınızı ve somut öneriler alın</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
