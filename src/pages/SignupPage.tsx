import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (data: { email: string; password: string; name?: string }) => {
    try {
      // Ensure name is provided for signup
      if (!data.name) {
        setError('Name is required for signup');
        return;
      }
      
      setError(null);
      await register(data.name, data.email, data.password);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Signup failed:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Try logging in instead.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak. Please use a stronger password.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address. Please check your email.');
      } else {
        setError(error.message || 'Signup failed. Please try again.');
      }
    }
  };

  return (
    <AuthForm type="signup" onSubmit={handleSignup} error={error} />
  );
};

export default SignupPage; 