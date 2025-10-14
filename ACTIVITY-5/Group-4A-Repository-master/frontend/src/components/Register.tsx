import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api/client';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      await authAPI.register(name, email, password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="app-shell">
        <main className="stack">
          <div className="login-wrap">
            <div></div>
            <div className="login-card">
              <div className="stack" style={{ textAlign: 'center' }}>
                <h2>Registration Successful!</h2>
                <p style={{ color: 'var(--muted)' }}>
                  Your account has been created. Redirecting to login...
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <main className="stack">
        <div className="login-wrap">
          <div>
            <h1 className="login-brand">SocialApp</h1>
            <p className="login-sub">Join our community and start sharing</p>
          </div>
          
          <div className="login-card">
            <form onSubmit={handleSubmit} className="stack">
              <h2>Create Account</h2>
              
              {error && (
                <div style={{ color: '#ef4444', fontSize: '14px', padding: '8px 0' }}>
                  {error}
                </div>
              )}
              
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              <input
                type="password"
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              
              <button type="submit" className="primary" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
              
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <span style={{ color: 'var(--muted)' }}>Already have an account? </span>
                <Link to="/login" style={{ color: 'var(--primary)' }}>
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;