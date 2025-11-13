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
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const navigate = useNavigate();

  // Password validation function
  const validatePassword = (pwd: string) => {
    const validations = {
      length: pwd.length >= 8 && pwd.length <= 20,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    };
    return validations;
  };

  const passwordValidations = validatePassword(password);
  const isPasswordValid = Object.values(passwordValidations).every(Boolean);
  const passwordsMatch = confirmPassword === password && confirmPassword !== '';
  const isValidGmail = email.endsWith('@gmail.com');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!isValidGmail) {
      setError('Email must be a valid Gmail address (@gmail.com)');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!isPasswordValid) {
      setError('Password does not meet all requirements');
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
                onBlur={() => setEmailTouched(true)}
                required
                autoComplete="email"
              />
              
              {emailTouched && email && !isValidGmail && (
                <div className="password-error">
                  Email must be a valid Gmail address (@gmail.com)
                </div>
              )}
              
              <input
                type="password"
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setPasswordTouched(true)}
                required
                minLength={6}
                autoComplete="new-password"
              />
              
              {passwordTouched && password && (
                <div className="password-requirements">
                  <div className={passwordValidations.length ? 'valid' : 'invalid'}>
                    {passwordValidations.length ? '✓' : '✗'} 8-20 characters
                  </div>
                  <div className={passwordValidations.uppercase ? 'valid' : 'invalid'}>
                    {passwordValidations.uppercase ? '✓' : '✗'} At least one uppercase letter
                  </div>
                  <div className={passwordValidations.lowercase ? 'valid' : 'invalid'}>
                    {passwordValidations.lowercase ? '✓' : '✗'} At least one lowercase letter
                  </div>
                  <div className={passwordValidations.number ? 'valid' : 'invalid'}>
                    {passwordValidations.number ? '✓' : '✗'} At least one number
                  </div>
                  <div className={passwordValidations.special ? 'valid' : 'invalid'}>
                    {passwordValidations.special ? '✓' : '✗'} At least one special character (!@#$%^&*...)
                  </div>
                </div>
              )}
              
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => setConfirmPasswordTouched(true)}
                required
                autoComplete="new-password"
              />
              
              {confirmPasswordTouched && confirmPassword && !passwordsMatch && (
                <div className="password-error">
                  Passwords do not match
                </div>
              )}
              
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