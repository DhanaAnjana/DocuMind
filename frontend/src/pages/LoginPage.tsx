// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuthContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        if (!formData.name.trim()) {
          setError('Name is required');
          setLoading(false);
          return;
        }
        await register(formData.email, formData.password, formData.name);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await login('demo@example.com', 'password');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">DocIntel</h1>
          <h2 className="text-2xl font-semibold text-text-dark">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="text-text-light mt-2">
            {isLogin ? 'Enter your credentials to continue' : 'Start your document intelligence journey'}
          </p>
        </div>

        <div className="bg-surface rounded-xl shadow-sm border border-border p-8">
          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-dark mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-dark mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-dark mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
                placeholder={isLogin ? "Enter your password" : "Create a password (min 8 characters)"}
              />
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-dark mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
                  placeholder="Confirm your password"
                />
              </div>
            )}

            {error && (
              <div className="bg-error/10 border border-error/20 rounded-lg p-3">
                <p className="text-error text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-secondary disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="sm" className="mr-2" />
                  Please wait...
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </div>

          {isLogin && (
            <button
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full mt-4 border-2 border-primary text-primary py-3 rounded-lg font-medium hover:bg-primary/5 transition-colors disabled:opacity-50"
            >
              Try Demo Account
            </button>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ email: '', password: '', name: '', confirmPassword: '' });
              }}
              disabled={loading}
              className="text-accent hover:text-blue-600 font-medium transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;