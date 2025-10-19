import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api/client';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(email, password);
      login(response.data.access_token, response.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <main className="stack">
        <div className="login-wrap">
          <div>
            <h1 className="login-brand">SocialApp</h1>
            <p className="login-sub">Connect with your friends and share your thoughts</p>
          </div>
          
          <div className="login-card">
            <form onSubmit={handleSubmit} className="stack">
              <h2>Sign In</h2>
              
              {error && (
                <div style={{ color: '#ef4444', fontSize: '14px', padding: '8px 0' }}>
                  {error}
                </div>
              )}
              
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              
              <button type="submit" className="primary" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
              
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <span style={{ color: 'var(--muted)' }}>Don't have an account? </span>
                <Link to="/register" style={{ color: 'var(--primary)' }}>
                  Sign up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;