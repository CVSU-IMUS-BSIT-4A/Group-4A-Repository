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
            <div className="login-branding">
              <h1 className="login-brand">SocialApp</h1>
              <p className="login-sub">Welcome to our community!</p>
            </div>
            <div className="login-card">
              <div className="stack success-message">
                <div className="success-icon">✓</div>
                <h2>Registration Successful!</h2>
                <p>
                  Your account has been created successfully. Redirecting to login...
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
          <div className="login-branding">
            <h1 className="login-brand">SocialApp</h1>
            <p className="login-sub">Join our community and start sharing your amazing stories</p>
          </div>
          
          <div className="login-card">
            <form onSubmit={handleSubmit} className="stack">
              <h2>Create Your Account</h2>
              
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
              
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
              
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              
              <input
                type="password"
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
              />
              
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              
              <button type="submit" className="primary" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
              
              <div className="auth-link">
                <span>Already have an account? </span>
                <Link to="/login">
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