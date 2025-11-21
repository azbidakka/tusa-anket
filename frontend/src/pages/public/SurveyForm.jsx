import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import axios from '../../config/axios';
import QuestionRenderer from '../../components/QuestionRenderer';
import { KVKK_AYDINLATMA_METNI } from '../../../../shared/index.js';

const SurveyForm = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [kvkkConsent, setKvkkConsent] = useState(false);
  const [answers, setAnswers] = useState({});
  const [currentSection, setCurrentSection] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [logoExists, setLogoExists] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [showKvkkModal, setShowKvkkModal] = useState(false);

  useEffect(() => {
    // Logo varlığını kontrol et
    const img = new Image();
    img.onload = () => setLogoExists(true);
    img.onerror = () => setLogoExists(false);
    img.src = '/src/assets/tusa-logo.png';
  }, []);

  useEffect(() => {
    loadSurvey();
  }, [slug]);

  // Section değiştiğinde sayfayı en üste scroll et
  useEffect(() => {
    // Scroll işlemini biraz geciktir (DOM güncellemesini bekle)
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      // Alternatif olarak document.body'yi de scroll et
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 50);
  }, [currentSection]);

  const loadSurvey = async () => {
    try {
      console.log('🔍 Loading survey:', slug);
      const response = await axios.get(`/api/public/survey/${slug}`);
      console.log('✅ Survey loaded:', response.data);
      setSurvey(response.data);
    } catch (err) {
      console.error('❌ Survey load error:', err);
      const errorData = err.response?.data;
      console.log('Error data:', errorData);
      setError(errorData?.error || 'Anket yüklenemedi');
      if (errorData?.alreadySubmitted) {
        setAlreadySubmitted(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!kvkkConsent) {
      setError('KVKK onayı gereklidir');
      return;
    }
    
    setSubmitting(true);
    try {
      await axios.post(`/api/public/survey/${slug}/submit`, {
        kvkk_consent: kvkkConsent,
        answers
      });
      navigate('/thank-you', { state: { autoRedirect: true } });
    } catch (err) {
      setError(err.response?.data?.error || 'Gönderim başarısız');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;
  }

  if (error && !survey) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card max-w-md text-center">
          {logoExists && (
            <img 
              src="/src/assets/tusa-logo.png" 
              alt="TUSA Hastanesi" 
              className="h-16 w-auto mx-auto mb-4"
            />
          )}
          {alreadySubmitted ? (
            <>
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-semibold text-primary mb-2">Teşekkür Ederiz!</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <p className="text-sm text-gray-500">Görüşleriniz bizim için çok değerli.</p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">⚠️</div>
              <p className="text-red-600 mb-2">{error}</p>
              <p className="text-sm text-gray-500">Lütfen geçerli bir anket linki kullanın.</p>
            </>
          )}
        </div>
      </div>
    );
  }

  const sections = survey.sections || [];
  const currentQuestions = survey.questions.filter(
    q => q.section_title === sections[currentSection]?.title
  );
  const progress = ((currentSection + 1) / sections.length) * 100;

  return (
    <>
      {/* KVKK Modal */}
      {showKvkkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-semibold text-primary">
                📋 Kişisel Verilerin Korunması Aydınlatma Metni
              </h2>
              <button
                onClick={() => setShowKvkkModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <div className="prose prose-sm sm:prose max-w-none">
                {KVKK_AYDINLATMA_METNI.split('\n').map((line, idx) => {
                  // Başlıklar
                  if (line.startsWith('# ')) {
                    return <h1 key={idx} className="text-xl sm:text-2xl font-bold text-primary mt-4 mb-3">{line.substring(2)}</h1>;
                  } else if (line.startsWith('## ')) {
                    return <h2 key={idx} className="text-lg sm:text-xl font-semibold text-primary mt-4 mb-2">{line.substring(3)}</h2>;
                  } 
                  // Liste öğeleri
                  else if (line.startsWith('- ')) {
                    return <li key={idx} className="ml-4 text-sm sm:text-base text-gray-700">{line.substring(2)}</li>;
                  } 
                  // Kalın metin içeren satırlar (örn: **Başlık:** içerik)
                  else if (line.includes('**')) {
                    const parts = line.split('**');
                    return (
                      <p key={idx} className="text-sm sm:text-base text-gray-700 mt-2">
                        {parts.map((part, i) => 
                          i % 2 === 1 ? <strong key={i} className="font-semibold text-gray-900">{part}</strong> : part
                        )}
                      </p>
                    );
                  }
                  // İtalik metin
                  else if (line.startsWith('*') && line.endsWith('*')) {
                    return <p key={idx} className="italic text-xs sm:text-sm text-gray-500 mt-2">{line.replace(/\*/g, '')}</p>;
                  } 
                  // Ayırıcı çizgi
                  else if (line.trim() === '---') {
                    return <hr key={idx} className="my-4 border-gray-300" />;
                  } 
                  // Normal metin
                  else if (line.trim()) {
                    return <p key={idx} className="text-sm sm:text-base text-gray-700 mt-2">{line}</p>;
                  }
                  return null;
                })}
              </div>
            </div>
            <div className="p-4 sm:p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowKvkkModal(false)}
                className="btn-secondary"
              >
                Kapat
              </button>
              <button
                onClick={() => {
                  setKvkkConsent(true);
                  setShowKvkkModal(false);
                }}
                className="btn-primary"
              >
                Okudum, Onaylıyorum
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-bg-light py-4 sm:py-8 px-3 sm:px-4">
        <div className="max-w-2xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-4 sm:mb-8">
          {logoExists ? (
            <img 
              src="/src/assets/tusa-logo.png" 
              alt="TUSA Hastanesi" 
              className="h-12 sm:h-16 w-auto mx-auto mb-3 sm:mb-4"
            />
          ) : (
            <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-3 sm:mb-4">TUSA Hastanesi</h1>
          )}
        </div>

        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-3xl font-semibold text-primary mb-2 leading-tight">{survey.name}</h1>
          <p className="text-sm sm:text-base text-gray-600">{survey.description}</p>
        </div>

        <div className="mb-6">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-primary rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-2">{sections[currentSection]?.title}</h2>
            {sections[currentSection]?.description && (
              <p className="text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm">{sections[currentSection].description}</p>
            )}
            
            {currentQuestions.map((question, idx) => (
              <div key={idx} className="mb-5 sm:mb-6">
                <label className="block text-sm sm:text-base font-medium mb-2 sm:mb-3 leading-snug">
                  {question.text}
                  {question.is_required && <span className="text-red-500 ml-1">*</span>}
                </label>
                
                <QuestionRenderer
                  question={question}
                  value={answers[question.id]}
                  onChange={(value) => setAnswers({ ...answers, [question.id]: value })}
                />
              </div>
            ))}
          </div>

          {/* KVKK Onayı - Sadece son sayfada göster */}
          {currentSection === sections.length - 1 && (
            <div className="card mb-4 sm:mb-6 border-2 border-primary">
              <div className="bg-primary bg-opacity-5 p-3 sm:p-4 rounded-button mb-3 sm:mb-4">
                <h3 className="text-sm sm:text-base font-semibold text-primary mb-2">📋 Kişisel Verilerin Korunması</h3>
                <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3">
                  Paylaştığınız veriler hizmet kalitemizi geliştirmek amacıyla anonim olarak değerlendirilecektir.
                </p>
              </div>
              <label className="flex items-start cursor-pointer hover:bg-gray-50 p-2 sm:p-3 rounded-button transition-colors">
                <input
                  type="checkbox"
                  checked={kvkkConsent}
                  onChange={(e) => setKvkkConsent(e.target.checked)}
                  className="mt-0.5 sm:mt-1 mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0"
                  required
                />
                <span className="text-xs sm:text-sm text-gray-700">
                  <button
                    type="button"
                    onClick={() => setShowKvkkModal(true)}
                    className="text-primary underline hover:text-primary-dark font-semibold"
                  >
                    Aydınlatma metnini
                  </button>
                  {' '}okuyup anladım. Verilerimin yukarıda belirtilen amaçlarla işlenmesini onaylıyorum.
                  {!kvkkConsent && <span className="text-red-500 ml-1">*</span>}
                </span>
              </label>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-button mb-4">
              ⚠️ {error}
            </div>
          )}

          <div className="flex justify-between">
            {currentSection > 0 && (
              <button
                type="button"
                onClick={() => {
                  setError(''); // Hata mesajını temizle
                  setCurrentSection(currentSection - 1);
                  // Hemen scroll et
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'instant' });
                    document.documentElement.scrollTop = 0;
                  }, 0);
                }}
                className="btn-secondary"
              >
                Geri
              </button>
            )}
            
            {currentSection < sections.length - 1 ? (
              <button
                type="button"
                onClick={() => {
                  // Mevcut bölümdeki zorunlu alanları kontrol et
                  const requiredQuestions = currentQuestions.filter(q => q.is_required);
                  const missingAnswers = requiredQuestions.filter(q => !answers[q.id] || answers[q.id] === '');
                  
                  if (missingAnswers.length > 0) {
                    setError(`Lütfen tüm zorunlu alanları doldurun. (${missingAnswers.length} alan eksik)`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                  }
                  
                  // Hata varsa temizle
                  setError('');
                  setCurrentSection(currentSection + 1);
                  // Hemen scroll et
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'instant' });
                    document.documentElement.scrollTop = 0;
                  }, 0);
                }}
                className="btn-primary ml-auto"
              >
                İlerle
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary ml-auto"
              >
                {submitting ? 'Gönderiliyor...' : 'Gönder'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default SurveyForm;
