import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import CalendarPage from './pages/CalendarPage';
import FeaturesPage from './pages/FeaturesPage';
import MobileAppsPage from './pages/MobileAppsPage';
import AboutPage from './pages/AboutPage';
import SettingsPage from './pages/SettingsPage';
import TestConnectionPage from './pages/TestConnectionPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import NotificationToast from './components/NotificationToast';

// Protected Route component
const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  return user ? element : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/mobile" element={<MobileAppsPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/test-connection" element={<TestConnectionPage />} />
      <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />
      <Route path="/calendar" element={<ProtectedRoute element={<CalendarPage />} />} />
      <Route path="/settings" element={<ProtectedRoute element={<SettingsPage />} />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <AppRoutes />
          <NotificationToast />
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App; 