import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      setError(null);
      console.log('Login form submitted with:', { email: data.email });
      
      await login(data.email, data.password);
      console.log('Login successful, redirecting to dashboard');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login failed:', error);
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setError('Incorrect password. Please try again.');
      } else if (error.code === 'auth/user-not-found') {
        setError('No account found with this email. Please check your email or sign up.');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many failed login attempts. Please try again later or reset your password.');
      } else {
        setError(error.message || 'Login failed. Please try again.');
      }
    }
  };

  return (
    <AuthForm type="login" onSubmit={handleLogin} error={error} />
  );
};

export default LoginPage; 