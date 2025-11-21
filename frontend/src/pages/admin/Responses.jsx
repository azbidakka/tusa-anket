import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';

const Responses = () => {
  const [responses, setResponses] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filters, setFilters] = useState({
    template_id: '',
    start_date: '',
    end_date: '',
    channel: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [responsesRes, surveysRes] = await Promise.all([
        axios.get('/api/responses'),
        axios.get('/api/surveys')
      ]);
      setResponses(responsesRes.data);
      setSurveys(surveysRes.data);
    } catch (error) {
      console.error('Load error:', error);
      alert('Veriler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const loadResponseDetail = async (responseId) => {
    try {
      console.log('Loading response detail for:', responseId);
      const response = await axios.get(`/api/responses/${responseId}`);
      const responseData = response.data;
      console.log('Response data:', responseData);
      console.log('Items count:', responseData.items?.length);
      
      // Anket template'ini de çek (soru metinleri için)
      if (responseData.template_id) {
        const surveyResponse = await axios.get(`/api/surveys/${responseData.template_id}`);
        responseData.survey = surveyResponse.data;
        console.log('Survey loaded:', responseData.survey.name);
        console.log('Questions count:', responseData.survey.questions?.length);
      }
      
      setSelectedResponse(responseData);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Detail load error:', error);
      alert('Detay yüklenemedi: ' + (error.response?.data?.error || error.message));
    }
  };

  const exportToCSV = () => {
    const filteredResponses = getFilteredResponses();
    
    if (filteredResponses.length === 0) {
      alert('Dışa aktarılacak veri yok');
      return;
    }

    const headers = ['Tarih', 'Anket', 'Kanal', 'Memnuniyet', 'NPS', 'Departman', 'Doktor'];
    const rows = filteredResponses.map(r => [
      new Date(r.submitted_at).toLocaleString('tr-TR'),
      getSurveyName(r.template_id),
      r.channel || '-',
      r.overall_score ? r.overall_score.toFixed(1) : '-',
      r.nps || '-',
      r.department || '-',
      r.doctor || '-'
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `anket-cevaplari-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getSurveyName = (templateId) => {
    const survey = surveys.find(s => s.id === templateId);
    return survey?.name || 'Bilinmeyen';
  };

  const getFilteredResponses = () => {
    return responses.filter(r => {
      if (filters.template_id && r.template_id !== filters.template_id) return false;
      if (filters.channel && r.channel !== filters.channel) return false;
      if (filters.start_date && r.submitted_at < filters.start_date) return false;
      if (filters.end_date && r.submitted_at > filters.end_date) return false;
      return true;
    });
  };

  const filteredResponses = getFilteredResponses();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-text-dark">Cevaplar</h1>
          <p className="text-gray-600 mt-2">
            {filteredResponses.length} cevap {filters.template_id || filters.channel ? '(filtrelenmiş)' : ''}
          </p>
        </div>
        <button onClick={exportToCSV} className="btn-primary">
          📥 CSV İndir
        </button>
      </div>

      {/* Filtreler */}
      <div className="card mb-6">
        <h3 className="font-semibold mb-4">Filtreler</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Anket</label>
            <select
              value={filters.template_id}
              onChange={(e) => setFilters({...filters, template_id: e.target.value})}
              className="input-field text-sm"
            >
              <option value="">Tümü</option>
              {surveys.map(survey => (
                <option key={survey.id} value={survey.id}>{survey.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Kanal</label>
            <select
              value={filters.channel}
              onChange={(e) => setFilters({...filters, channel: e.target.value})}
              className="input-field text-sm"
            >
              <option value="">Tümü</option>
              <option value="SMS">SMS</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="E-posta">E-posta</option>
              <option value="QR">QR</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Başlangıç</label>
            <input
              type="date"
              value={filters.start_date}
              onChange={(e) => setFilters({...filters, start_date: e.target.value})}
              className="input-field text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Bitiş</label>
            <input
              type="date"
              value={filters.end_date}
              onChange={(e) => setFilters({...filters, end_date: e.target.value})}
              className="input-field text-sm"
            />
          </div>
        </div>
        {(filters.template_id || filters.channel || filters.start_date || filters.end_date) && (
          <button
            onClick={() => setFilters({ template_id: '', channel: '', start_date: '', end_date: '' })}
            className="text-sm text-primary hover:underline mt-3"
          >
            🔄 Filtreleri Temizle
          </button>
        )}
      </div>
      
      {/* Tablo */}
      <div className="card">
        {filteredResponses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Henüz cevap bulunmuyor</p>
            <p className="text-sm text-gray-500">Anket doldurulduğunda burada görünecek</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-border bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold">Tarih</th>
                  <th className="text-left py-3 px-4 font-semibold">Anket</th>
                  <th className="text-left py-3 px-4 font-semibold">Kanal</th>
                  <th className="text-left py-3 px-4 font-semibold">Memnuniyet</th>
                  <th className="text-left py-3 px-4 font-semibold">NPS</th>
                  <th className="text-left py-3 px-4 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {filteredResponses.map(response => (
                  <tr key={response.id} className="border-b border-border hover:bg-bg-light transition-colors">
                    <td className="py-3 px-4 text-sm">
                      {new Date(response.submitted_at).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3 px-4 text-sm">{getSurveyName(response.template_id)}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        {response.channel || 'QR'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {response.overall_score ? (
                        <span className={`font-semibold ${
                          response.overall_score >= 4 ? 'text-green-600' :
                          response.overall_score >= 3 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {response.overall_score.toFixed(1)} / 5
                        </span>
                      ) : '-'}
                    </td>
                    <td className="py-3 px-4">
                      {response.nps !== null && response.nps !== undefined ? (
                        <span className={`font-semibold ${
                          response.nps >= 9 ? 'text-green-600' :
                          response.nps >= 7 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {response.nps} / 10
                        </span>
                      ) : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => loadResponseDetail(response.id)}
                        className="text-primary hover:underline text-sm font-medium"
                      >
                        📋 Detay
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detay Modal */}
      {showDetailModal && selectedResponse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Cevap Detayı</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(selectedResponse.submitted_at).toLocaleString('tr-TR')}
                </p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Özet Bilgiler */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded-button">
                <div className="text-xs text-gray-600 mb-1">Anket</div>
                <div className="font-semibold text-sm">{getSurveyName(selectedResponse.template_id)}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-button">
                <div className="text-xs text-gray-600 mb-1">Kanal</div>
                <div className="font-semibold text-sm">{selectedResponse.channel || 'QR'}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-button">
                <div className="text-xs text-gray-600 mb-1">Memnuniyet</div>
                <div className="font-semibold text-sm">
                  {selectedResponse.overall_score ? `${selectedResponse.overall_score.toFixed(1)} / 5` : '-'}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-button">
                <div className="text-xs text-gray-600 mb-1">NPS</div>
                <div className="font-semibold text-sm">
                  {selectedResponse.nps !== null ? `${selectedResponse.nps} / 10` : '-'}
                </div>
              </div>
            </div>

            {/* Cevaplar */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-3">Sorular ve Cevaplar</h3>
              {selectedResponse.items && selectedResponse.items.length > 0 ? (
                selectedResponse.items.map((item, idx) => {
                  // Soru metnini bul
                  const question = selectedResponse.survey?.questions?.find(q => q.id === item.question_id);
                  
                  return (
                    <div key={idx} className="bg-gray-50 rounded-button p-4 border-l-4 border-primary">
                      <div className="text-sm font-semibold text-gray-800 mb-2">
                        {question ? question.text : `Soru ${idx + 1}`}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Cevap:</span>
                        <span className="text-sm font-medium text-primary">
                          {typeof item.value === 'object' ? JSON.stringify(item.value) : item.value}
                        </span>
                        {question?.type === 'likert_5' && (
                          <span className="text-xs text-gray-500">
                            ({item.value === 5 ? 'Tamamen Katılıyorum' :
                              item.value === 4 ? 'Katılıyorum' :
                              item.value === 3 ? 'Kararsızım' :
                              item.value === 2 ? 'Katılmıyorum' :
                              'Kesinlikle Katılmıyorum'})
                          </span>
                        )}
                        {question?.type === 'nps_0_10' && (
                          <span className="text-xs text-gray-500">
                            ({item.value >= 9 ? 'Destekleyen' :
                              item.value >= 7 ? 'Pasif' :
                              'Eleştirmen'})
                          </span>
                        )}
                      </div>
                      {question?.topic_tag && (
                        <div className="mt-2">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {question.topic_tag}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-2">Cevap detayları bulunamadı</p>
                  <p className="text-xs text-gray-400">
                    Response ID: {selectedResponse.id}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="btn-secondary"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Responses;
