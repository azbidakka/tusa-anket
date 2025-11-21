import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';
import { QUESTION_TYPES } from '../../../../shared/index.js';

const Surveys = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');

  useEffect(() => {
    loadSurveys();
  }, []);

  const loadSurveys = async () => {
    try {
      const response = await axios.get('/api/surveys');
      setSurveys(response.data);
    } catch (error) {
      console.error('Surveys load error:', error);
      alert('Anketler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const generateLink = (survey) => {
    // Basit link oluştur - token gerektirmez
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/survey/${survey.slug}`;
    setGeneratedLink(link);
    setShowLinkModal(true);
  };

  const handleEdit = (survey) => {
    setEditingSurvey(survey);
    setShowModal(true);
  };

  const handleNew = () => {
    setEditingSurvey({
      name: '',
      slug: '',
      description: '',
      is_active: true,
      require_unique_token: true,
      allow_multiple_submissions: false,
      auto_overall_score: true,
      auto_nps: true,
      sections: [],
      questions: []
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingSurvey.id) {
        await axios.put(`/api/surveys/${editingSurvey.id}`, editingSurvey);
      } else {
        await axios.post('/api/surveys', editingSurvey);
      }
      setShowModal(false);
      setEditingSurvey(null);
      loadSurveys();
      alert('Anket kaydedildi!');
    } catch (error) {
      alert('Kaydetme başarısız: ' + (error.response?.data?.error || error.message));
    }
  };

  const toggleActive = async (survey) => {
    try {
      await axios.put(`/api/surveys/${survey.id}`, {
        ...survey,
        is_active: !survey.is_active
      });
      loadSurveys();
    } catch (error) {
      alert('Durum değiştirilemedi');
    }
  };

  const handleDelete = async (survey) => {
    if (!confirm(`"${survey.name}" anketini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!`)) {
      return;
    }
    
    try {
      await axios.delete(`/api/surveys/${survey.id}`);
      alert('Anket silindi!');
      loadSurveys();
    } catch (error) {
      alert('Silme başarısız: ' + (error.response?.data?.error || error.message));
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Link kopyalandı!');
  };

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
          <h1 className="text-3xl font-semibold text-text-dark">Anketler</h1>
          <p className="text-gray-600 mt-2">{surveys.length} anket mevcut</p>
        </div>
        <button onClick={handleNew} className="btn-primary">
          + Yeni Anket Oluştur
        </button>
      </div>
      
      {surveys.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">Henüz anket bulunmuyor</p>
          <button onClick={handleNew} className="btn-primary">
            İlk Anketi Oluştur
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {surveys.map(survey => (
            <div key={survey.id} className="card hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-text-dark">{survey.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      survey.is_active 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {survey.is_active ? 'Aktif' : 'Pasif'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{survey.description}</p>
                  <div className="flex gap-6 text-sm text-gray-500">
                    <span>📝 {survey.questions?.length || 0} soru</span>
                    <span>📂 {survey.sections?.length || 0} bölüm</span>
                    <span>🔗 Slug: /{survey.slug}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => generateLink(survey)}
                    className="btn-primary text-sm py-2 px-4 whitespace-nowrap"
                  >
                    🔗 Link Oluştur
                  </button>
                  <button 
                    onClick={() => handleEdit(survey)}
                    className="btn-secondary text-sm py-2 px-4"
                  >
                    ✏️ Düzenle
                  </button>
                  <button
                    onClick={() => toggleActive(survey)}
                    className="btn-secondary text-sm py-2 px-4"
                  >
                    {survey.is_active ? '⏸️ Pasifleştir' : '▶️ Aktifleştir'}
                  </button>
                  <button
                    onClick={() => handleDelete(survey)}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-4 rounded-button transition-colors"
                  >
                    🗑️ Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-semibold mb-4">✅ Link Oluşturuldu!</h2>
            <div className="bg-gray-50 p-4 rounded-button mb-4 break-all">
              <code className="text-sm">{generatedLink}</code>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => copyToClipboard(generatedLink)}
                className="btn-primary flex-1"
              >
                📋 Kopyala
              </button>
              <button
                onClick={() => window.open(generatedLink, '_blank')}
                className="btn-secondary flex-1"
              >
                🔗 Aç
              </button>
              <button
                onClick={() => setShowLinkModal(false)}
                className="btn-secondary"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Create Modal */}
      {showModal && editingSurvey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-6">
              {editingSurvey.id ? 'Anketi Düzenle' : 'Yeni Anket Oluştur'}
            </h2>
            
            <div className="space-y-6">
              {/* Temel Bilgiler */}
              <div>
                <label className="block text-sm font-medium mb-2">Anket Adı *</label>
                <input
                  type="text"
                  value={editingSurvey.name}
                  onChange={(e) => setEditingSurvey({...editingSurvey, name: e.target.value})}
                  className="input-field"
                  placeholder="Örn: Ayaktan Hasta Anketi"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Slug (URL) *</label>
                <input
                  type="text"
                  value={editingSurvey.slug}
                  onChange={(e) => setEditingSurvey({...editingSurvey, slug: e.target.value})}
                  className="input-field"
                  placeholder="ayaktan-hasta"
                />
                <p className="text-xs text-gray-500 mt-1">
                  URL: /s/{editingSurvey.slug || 'slug'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Açıklama</label>
                <textarea
                  value={editingSurvey.description}
                  onChange={(e) => setEditingSurvey({...editingSurvey, description: e.target.value})}
                  className="input-field"
                  rows={3}
                  placeholder="Anket hakkında kısa açıklama"
                />
              </div>

              {/* Ayarlar */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Ayarlar</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingSurvey.is_active}
                      onChange={(e) => setEditingSurvey({...editingSurvey, is_active: e.target.checked})}
                      className="mr-3"
                    />
                    <span className="text-sm">Aktif</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingSurvey.require_unique_token}
                      onChange={(e) => setEditingSurvey({...editingSurvey, require_unique_token: e.target.checked})}
                      className="mr-3"
                    />
                    <span className="text-sm">Tekil token zorunlu</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingSurvey.auto_overall_score}
                      onChange={(e) => setEditingSurvey({...editingSurvey, auto_overall_score: e.target.checked})}
                      className="mr-3"
                    />
                    <span className="text-sm">Otomatik genel skor hesapla</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingSurvey.auto_nps}
                      onChange={(e) => setEditingSurvey({...editingSurvey, auto_nps: e.target.checked})}
                      className="mr-3"
                    />
                    <span className="text-sm">Otomatik NPS hesapla</span>
                  </label>
                </div>
              </div>

              {/* Bölümler */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold">Bölümler</h3>
                  <button
                    onClick={() => {
                      const sections = editingSurvey.sections || [];
                      setEditingSurvey({
                        ...editingSurvey,
                        sections: [...sections, { title: '', description: '' }]
                      });
                    }}
                    className="text-sm text-primary hover:underline"
                  >
                    + Bölüm Ekle
                  </button>
                </div>
                <div className="space-y-3">
                  {(editingSurvey.sections || []).map((section, idx) => (
                    <div key={idx} className="flex gap-3 items-start bg-gray-50 p-3 rounded-button">
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => {
                            const sections = [...editingSurvey.sections];
                            sections[idx].title = e.target.value;
                            setEditingSurvey({...editingSurvey, sections});
                          }}
                          className="input-field text-sm"
                          placeholder="Bölüm başlığı"
                        />
                        <input
                          type="text"
                          value={section.description || ''}
                          onChange={(e) => {
                            const sections = [...editingSurvey.sections];
                            sections[idx].description = e.target.value;
                            setEditingSurvey({...editingSurvey, sections});
                          }}
                          className="input-field text-sm"
                          placeholder="Bölüm açıklaması (opsiyonel)"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const sections = editingSurvey.sections.filter((_, i) => i !== idx);
                          setEditingSurvey({...editingSurvey, sections});
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                  {(!editingSurvey.sections || editingSurvey.sections.length === 0) && (
                    <p className="text-sm text-gray-500 italic">Henüz bölüm eklenmedi</p>
                  )}
                </div>
              </div>

              {/* Sorular */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold">Sorular ({editingSurvey.questions?.length || 0})</h3>
                  <button
                    onClick={() => {
                      const questions = editingSurvey.questions || [];
                      setEditingSurvey({
                        ...editingSurvey,
                        questions: [...questions, {
                          id: `q${questions.length + 1}`,
                          section_title: editingSurvey.sections?.[0]?.title || '',
                          order: questions.length + 1,
                          type: 'likert_5',
                          text: '',
                          is_required: true,
                          options: [],
                          topic_tag: ''
                        }]
                      });
                    }}
                    className="text-sm text-primary hover:underline"
                  >
                    + Soru Ekle
                  </button>
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {(editingSurvey.questions || []).map((question, idx) => (
                    <div key={idx} className="border border-gray-200 p-4 rounded-button bg-white">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-sm font-medium text-gray-600">Soru {idx + 1}</span>
                        <button
                          onClick={() => {
                            const questions = editingSurvey.questions.filter((_, i) => i !== idx);
                            setEditingSurvey({...editingSurvey, questions});
                          }}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          🗑️ Sil
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium mb-1">Bölüm</label>
                            <select
                              value={question.section_title}
                              onChange={(e) => {
                                const questions = [...editingSurvey.questions];
                                questions[idx].section_title = e.target.value;
                                setEditingSurvey({...editingSurvey, questions});
                              }}
                              className="input-field text-sm"
                            >
                              <option value="">Bölüm seçin</option>
                              {(editingSurvey.sections || []).map((sec, i) => (
                                <option key={i} value={sec.title}>{sec.title}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Soru Tipi</label>
                            <select
                              value={question.type}
                              onChange={(e) => {
                                const questions = [...editingSurvey.questions];
                                questions[idx].type = e.target.value;
                                setEditingSurvey({...editingSurvey, questions});
                              }}
                              className="input-field text-sm"
                            >
                              <option value="likert_5">Likert 1-5</option>
                              <option value="nps_0_10">NPS 0-10</option>
                              <option value="yes_no">Evet/Hayır</option>
                              <option value="short_text">Kısa Metin</option>
                              <option value="long_text">Uzun Metin</option>
                              <option value="multiple_single">Tek Seçim</option>
                              <option value="multiple_multi">Çoklu Seçim</option>
                              <option value="date">Tarih</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium mb-1">Soru Metni *</label>
                          <textarea
                            value={question.text}
                            onChange={(e) => {
                              const questions = [...editingSurvey.questions];
                              questions[idx].text = e.target.value;
                              setEditingSurvey({...editingSurvey, questions});
                            }}
                            className="input-field text-sm"
                            rows={2}
                            placeholder="Sorunuzu yazın..."
                          />
                        </div>

                        {(question.type === 'multiple_single' || question.type === 'multiple_multi') && (
                          <div>
                            <label className="block text-xs font-medium mb-1">Seçenekler (her satıra bir seçenek)</label>
                            <textarea
                              value={(question.options || []).join('\n')}
                              onChange={(e) => {
                                const questions = [...editingSurvey.questions];
                                // Boş satırları koruyarak split yap, sadece kayıt sırasında temizle
                                questions[idx].options = e.target.value.split('\n');
                                setEditingSurvey({...editingSurvey, questions});
                              }}
                              onBlur={(e) => {
                                // Blur olduğunda boş satırları temizle
                                const questions = [...editingSurvey.questions];
                                questions[idx].options = e.target.value.split('\n').map(o => o.trim()).filter(o => o);
                                setEditingSurvey({...editingSurvey, questions});
                              }}
                              className="input-field text-sm font-mono"
                              rows={5}
                              placeholder="Seçenek 1&#10;Seçenek 2&#10;Seçenek 3"
                              style={{ whiteSpace: 'pre-wrap' }}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              ✏️ Her satıra bir seçenek yazın. Enter tuşu ile yeni satır ekleyin.
                            </p>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium mb-1">Topic Tag</label>
                            <input
                              type="text"
                              value={question.topic_tag || ''}
                              onChange={(e) => {
                                const questions = [...editingSurvey.questions];
                                questions[idx].topic_tag = e.target.value;
                                setEditingSurvey({...editingSurvey, questions});
                              }}
                              className="input-field text-sm"
                              placeholder="hekim_iletisim"
                            />
                          </div>
                          <div className="flex items-end">
                            <label className="flex items-center text-sm">
                              <input
                                type="checkbox"
                                checked={question.is_required}
                                onChange={(e) => {
                                  const questions = [...editingSurvey.questions];
                                  questions[idx].is_required = e.target.checked;
                                  setEditingSurvey({...editingSurvey, questions});
                                }}
                                className="mr-2"
                              />
                              Zorunlu
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!editingSurvey.questions || editingSurvey.questions.length === 0) && (
                    <p className="text-sm text-gray-500 italic">Henüz soru eklenmedi</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={handleSave} className="btn-primary flex-1">
                💾 Kaydet
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingSurvey(null);
                }}
                className="btn-secondary"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Surveys;
