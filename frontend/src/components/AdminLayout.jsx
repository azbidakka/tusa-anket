import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoImage from '../assets/tusa-logo.png';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [logoExists, setLogoExists] = useState(false);

  useEffect(() => {
    // Logo varlığını kontrol et
    const img = new Image();
    img.onload = () => setLogoExists(true);
    img.onerror = () => setLogoExists(false);
    img.src = logoImage;
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', exact: true },
    { path: '/admin/surveys', label: 'Anketler' },
    { path: '/admin/responses', label: 'Cevaplar' },
    { path: '/admin/settings', label: 'Ayarlar' }
  ];

  return (
    <div className="min-h-screen bg-bg-light">
      <nav className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                {logoExists ? (
                  <img 
                    src={logoImage} 
                    alt="TUSA Hastanesi" 
                    className="h-10 w-auto"
                  />
                ) : (
                  <span className="text-2xl font-semibold text-primary">TUSA Hastanesi</span>
                )}
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                {navItems.map(item => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.exact}
                    className={({ isActive }) =>
                      `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        isActive
                          ? 'border-primary text-primary'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-4">{user?.email}</span>
              <button onClick={handleLogout} className="btn-secondary text-sm py-2">
                Çıkış
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
