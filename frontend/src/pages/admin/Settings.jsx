import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [stats, setStats] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  
  // Şifre değiştirme
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadSettings();
    loadStats();
    if (activeTab === 'data') {
      loadAuditLogs();
    }
  }, [activeTab]);

  const loadSettings = async () => {
    try {
      const response = await axios.get('/api/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Settings load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await axios.get('/api/responses/stats/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Stats load error:', error);
    }
  };

  const loadAuditLogs = async () => {
    setLoadingLogs(true);
    try {
      const response = await axios.get('/api/audit-logs?limit=50');
      setAuditLogs(response.data);
    } catch (error) {
      console.error('Audit logs load error:', error);
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put('/api/settings', settings);
      alert('✅ Ayarlar başarıyla kaydedildi');
    } catch (error) {
      alert('❌ Kaydetme başarısız: ' + (error.response?.data?.error || error.message));
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('❌ Yeni şifreler eşleşmiyor');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      alert('❌ Şifre en az 6 karakter olmalıdır');
      return;
    }
    
    try {
      await axios.post('/api/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      alert('✅ Şifre başarıyla değiştirildi');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      alert('❌ Şifre değiştirme başarısız: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleClearData = async (type) => {
    const confirmMsg = type === 'responses' 
      ? 'Tüm anket cevaplarını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!'
      : 'Tüm anketleri silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!';
    
    if (!window.confirm(confirmMsg)) return;
    
    try {
      await axios.delete(`/api/${type}`);
      alert('✅ Veriler başarıyla silindi');
      if (type === 'responses') loadStats();
    } catch (error) {
      alert('❌ Silme başarısız: ' + (error.response?.data?.error || error.message));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Yükleniyor...</div>
      </div>
    );
  }

  const tabs = [
    { id: 'general', label: '⚙️ Genel', icon: '⚙️' },
    { id: 'security', label: '🔒 Güvenlik', icon: '🔒' },
    { id: 'account', label: '👤 Hesap', icon: '👤' },
    { id: 'data', label: '🗄️ Veri Yönetimi', icon: '🗄️' },
    { id: 'system', label: '💻 Sistem', icon: '💻' }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-text-dark">Ayarlar</h1>
        <p className="text-gray-600 mt-1">Sistem ayarlarını yönetin</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-button whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-lg'
                : 'bg-white border-2 border-border hover:border-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Tab */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              🏥 Kurumsal Bilgiler
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kurum Adı
              </label>
              <input
                type="text"
                value={settings.organization_name || 'TUSA Hastanesi'}
                onChange={(e) => setSettings({ ...settings, organization_name: e.target.value })}
                className="input-field"
              />
              <p className="text-xs text-gray-500 mt-1">Anket formlarında ve raporlarda görünecek</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo URL
              </label>
              <input
                type="text"
                value={settings.logo_url || ''}
                onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                className="input-field"
                placeholder="/src/assets/tusa-logo.png"
              />
              <p className="text-xs text-gray-500 mt-1">Logo dosya yolu veya URL</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                İletişim E-posta
              </label>
              <input
                type="email"
                value={settings.contact_email || ''}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                className="input-field"
                placeholder="info@tusa.com"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefon
              </label>
              <input
                type="tel"
                value={settings.contact_phone || ''}
                onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                className="input-field"
                placeholder="+90 XXX XXX XX XX"
              />
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              🎨 Görünüm
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ana Renk
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.primary_color || '#0A6A39'}
                  onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                  className="w-16 h-10 rounded-button border-2 border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.primary_color || '#0A6A39'}
                  onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                  className="input-field flex-1"
                  placeholder="#0A6A39"
                />
              </div>
            </div>

            <label className="flex items-center p-3 border-2 border-border rounded-button hover:border-primary cursor-pointer">
              <input
                type="checkbox"
                checked={settings.show_logo_in_surveys !== false}
                onChange={(e) => setSettings({ ...settings, show_logo_in_surveys: e.target.checked })}
                className="mr-3"
              />
              <div>
                <div className="font-medium">Anketlerde Logo Göster</div>
                <div className="text-xs text-gray-500">Anket formlarının üstünde logo gösterilir</div>
              </div>
            </label>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary w-full sm:w-auto"
          >
            {saving ? 'Kaydediliyor...' : '💾 Kaydet'}
          </button>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              🔒 Güvenlik Ayarları
            </h2>
            
            <div className="space-y-3">
              <label className="flex items-start p-3 border-2 border-border rounded-button hover:border-primary cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.ip_based_protection !== false}
                  onChange={(e) => setSettings({ ...settings, ip_based_protection: e.target.checked })}
                  className="mt-1 mr-3"
                />
                <div>
                  <div className="font-medium">IP Bazlı Koruma</div>
                  <div className="text-xs text-gray-500">Her IP bir anketi sadece 1 kez doldurabilir</div>
                </div>
              </label>

              <label className="flex items-start p-3 border-2 border-border rounded-button hover:border-primary cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.require_kvkk_consent !== false}
                  onChange={(e) => setSettings({ ...settings, require_kvkk_consent: e.target.checked })}
                  className="mt-1 mr-3"
                />
                <div>
                  <div className="font-medium">KVKK Onayı Zorunlu</div>
                  <div className="text-xs text-gray-500">Anket göndermeden önce KVKK onayı alınır</div>
                </div>
              </label>

              <label className="flex items-start p-3 border-2 border-border rounded-button hover:border-primary cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enable_rate_limiting !== false}
                  onChange={(e) => setSettings({ ...settings, enable_rate_limiting: e.target.checked })}
                  className="mt-1 mr-3"
                />
                <div>
                  <div className="font-medium">Rate Limiting</div>
                  <div className="text-xs text-gray-500">Aşırı istek gönderimini engeller (5 anket/gün/IP)</div>
                </div>
              </label>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">⏱️ Oturum Ayarları</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Oturum Süresi (dakika)
              </label>
              <input
                type="number"
                value={settings.session_timeout || 60}
                onChange={(e) => setSettings({ ...settings, session_timeout: parseInt(e.target.value) })}
                className="input-field"
                min="15"
                max="1440"
              />
              <p className="text-xs text-gray-500 mt-1">Admin paneli oturum süresi</p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary w-full sm:w-auto"
          >
            {saving ? 'Kaydediliyor...' : '💾 Kaydet'}
          </button>
        </div>
      )}

      {/* Account Tab */}
      {activeTab === 'account' && (
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              👤 Hesap Bilgileri
            </h2>
            
            <div className="bg-gray-50 p-4 rounded-button mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">E-posta</div>
                  <div className="font-medium">{user?.email}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Rol</div>
                  <div className="font-medium capitalize">{user?.role}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">🔑 Şifre Değiştir</h2>
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mevcut Şifre
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yeni Şifre
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="input-field"
                  required
                  minLength="6"
                />
                <p className="text-xs text-gray-500 mt-1">En az 6 karakter</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yeni Şifre (Tekrar)
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <button type="submit" className="btn-primary w-full sm:w-auto">
                🔑 Şifreyi Değiştir
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Data Management Tab */}
      {activeTab === 'data' && (
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              📊 Veri İstatistikleri
            </h2>
            
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-button">
                  <div className="text-2xl font-bold text-primary">{stats.totalResponses || 0}</div>
                  <div className="text-sm text-gray-600">Toplam Cevap</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-button">
                  <div className="text-2xl font-bold text-primary">{stats.avgSatisfaction || 0}</div>
                  <div className="text-sm text-gray-600">Ort. Memnuniyet</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-button">
                  <div className="text-2xl font-bold text-primary">{stats.avgNPS || 0}</div>
                  <div className="text-sm text-gray-600">Ort. NPS</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-button">
                  <div className="text-2xl font-bold text-primary">{stats.activeSurveys || 0}</div>
                  <div className="text-sm text-gray-600">Aktif Anket</div>
                </div>
              </div>
            )}
          </div>

          <div className="card border-2 border-red-200 bg-red-50">
            <h2 className="text-xl font-semibold mb-4 text-red-800 flex items-center gap-2">
              ⚠️ Tehlikeli İşlemler
            </h2>
            
            <div className="bg-white p-4 rounded-button border-2 border-red-200">
              <h3 className="font-semibold mb-2">Tüm Cevapları Sil</h3>
              <p className="text-sm text-gray-600 mb-3">
                Tüm anket cevapları kalıcı olarak silinecek. Bu işlem geri alınamaz!
              </p>
              <button
                onClick={() => handleClearData('responses')}
                className="bg-red-600 text-white px-4 py-2 rounded-button hover:bg-red-700 transition-colors text-sm"
              >
                🗑️ Tüm Cevapları Sil
              </button>
            </div>
          </div>

          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                📝 İşlem Kayıtları (Audit Log)
              </h2>
              <button
                onClick={loadAuditLogs}
                className="btn-secondary text-sm"
                disabled={loadingLogs}
              >
                {loadingLogs ? 'Yükleniyor...' : '🔄 Yenile'}
              </button>
            </div>
            
            <div className="bg-blue-50 border-2 border-blue-200 p-3 rounded-button mb-4">
              <p className="text-sm text-blue-800">
                ℹ️ Tüm tehlikeli işlemler otomatik olarak kaydedilir. Bu kayıtlar silinemez ve değiştirilemez.
              </p>
            </div>

            {loadingLogs ? (
              <div className="text-center py-8 text-gray-500">Yükleniyor...</div>
            ) : auditLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Henüz kayıt yok</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 text-left">Tarih/Saat</th>
                      <th className="px-3 py-2 text-left">İşlem</th>
                      <th className="px-3 py-2 text-left">Kullanıcı</th>
                      <th className="px-3 py-2 text-left">IP Adresi</th>
                      <th className="px-3 py-2 text-left">Detaylar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log, idx) => (
                      <tr key={log.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString('tr-TR')}
                        </td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            log.action.includes('DELETE') ? 'bg-red-100 text-red-700' :
                            log.action.includes('LOGIN') ? 'bg-green-100 text-green-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-3 py-2">{log.user_email}</td>
                        <td className="px-3 py-2 font-mono text-xs">{log.ip_address}</td>
                        <td className="px-3 py-2 text-xs text-gray-600">
                          {log.details?.count && `${log.details.count} kayıt`}
                          {log.details?.reason && ` - ${log.details.reason}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* System Tab */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              💻 Sistem Bilgileri
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Versiyon</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Backend</span>
                <span className="font-medium">Node.js + Express</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Frontend</span>
                <span className="font-medium">React + Vite</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Veritabanı</span>
                <span className="font-medium">Firebase Firestore</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">AI Model</span>
                <span className="font-medium">OpenAI GPT-4o-mini</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">📝 Lisans</h2>
            <p className="text-gray-600 mb-2">© 2024 TUSA Hastanesi</p>
            <p className="text-sm text-gray-500">Tüm hakları saklıdır.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
