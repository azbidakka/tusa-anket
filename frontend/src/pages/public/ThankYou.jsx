import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ThankYou = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(5);
  const autoRedirect = location.state?.autoRedirect;

  useEffect(() => {
    if (autoRedirect) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            window.location.href = 'https://tusahastanesi.com';
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [autoRedirect]);

  return (
    <div className="min-h-screen bg-bg-light flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="card">
          <div className="mb-6">
            <svg className="w-20 h-20 text-primary mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-semibold text-text-dark mb-4">
            Teşekkür Ederiz!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Görüşleriniz bizim için çok değerli. Anketimize katıldığınız için teşekkür ederiz.
          </p>
          
          <p className="text-sm text-gray-500 mb-4">
            Hizmet kalitemizi geliştirmek için çalışmaya devam edeceğiz.
          </p>

          {autoRedirect && countdown > 0 && (
            <div className="mt-6 p-4 bg-primary bg-opacity-10 rounded-button">
              <p className="text-sm text-primary font-medium">
                {countdown} saniye içinde anasayfaya yönlendirileceksiniz...
              </p>
              <button
                onClick={() => window.location.href = 'https://tusahastanesi.com'}
                className="mt-3 text-sm text-primary hover:underline"
              >
                Hemen git →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
