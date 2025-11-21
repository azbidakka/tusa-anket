import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Public pages
import SurveyForm from './pages/public/SurveyForm';
import ThankYou from './pages/public/ThankYou';
import Login from './pages/auth/Login';
import LoginDebug from './pages/auth/LoginDebug';

// Admin pages
import Dashboard from './pages/admin/Dashboard';
import Surveys from './pages/admin/Surveys';
import Responses from './pages/admin/Responses';
import Settings from './pages/admin/Settings';
import AdminLayout from './components/AdminLayout';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/survey/:slug" element={<SurveyForm />} />
        <Route path="/s/:slug" element={<SurveyForm />} /> {/* Kısa link desteği */}
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/login" element={<Login />} />
        <Route path="/debug" element={<LoginDebug />} />
        
        {/* Admin routes */}
        <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="surveys" element={<Surveys />} />
          <Route path="responses" element={<Responses />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
