import React, { useState } from 'react';

const LoginDebug = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testDirect = async () => {
    setLoading(true);
    setResult('Testing direct fetch...');
    
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'admin@tusahastanesi.com',
          password: 'TusaAdmin2024!'
        })
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('ERROR: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const testProxy = async () => {
    setLoading(true);
    setResult('Testing via proxy...');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'admin@tusahastanesi.com',
          password: 'TusaAdmin2024!'
        })
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('ERROR: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Login Debug</h1>
        
        <div className="space-y-4 mb-6">
          <button
            onClick={testDirect}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            Test Direct (localhost:3000)
          </button>
          
          <button
            onClick={testProxy}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 ml-4"
          >
            Test Proxy (/api)
          </button>
        </div>
        
        <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm whitespace-pre-wrap">
          {result || 'Click a button to test...'}
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p><strong>Backend:</strong> http://localhost:3000</p>
          <p><strong>Frontend:</strong> http://localhost:5173</p>
          <p><strong>Credentials:</strong> admin@tusahastanesi.com / TusaAdmin2024!</p>
        </div>
      </div>
    </div>
  );
};

export default LoginDebug;
