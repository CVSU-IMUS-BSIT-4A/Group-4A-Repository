import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import './register.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [formValid, setFormValid] = useState(false);
  const navigate = useNavigate();

  // Validate form on input changes
  useEffect(() => {
    validateForm();
  }, [email, password, confirmPassword]);

  const validateForm = () => {
    let isValid = true;
    
    // Email validation - must contain @gmail.com
    if (email && !email.endsWith('@gmail.com')) {
      setEmailError('Email must be a Gmail address (@gmail.com)');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    // Password validation - must contain at least 1 uppercase, 1 lowercase and 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (password && !passwordRegex.test(password)) {
      setPasswordError('Password must include at least 1 uppercase letter, 1 lowercase letter, and 1 number');
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    // Confirm password validation
    if (confirmPassword && password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }
    
    // Only set form as valid if all fields are filled and validation passes
    setFormValid(isValid && Boolean(email) && Boolean(password) && Boolean(confirmPassword));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation before submission
    if (!formValid) {
      setError('Please fix the errors before submitting.');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    try {
      await api.post('/auth/register', { email, password });
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2 className="register-title">Create Account</h2>
          <p className="register-subtitle">Enter your information to get started</p>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`form-input ${emailError ? 'input-error' : ''}`}
              required
            />
            {emailError && <div className="validation-error">{emailError}</div>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`form-input ${passwordError ? 'input-error' : ''}`}
              required
            />
            {passwordError && <div className="validation-error">{passwordError}</div>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`form-input ${confirmPasswordError ? 'input-error' : ''}`}
              required
            />
            {confirmPasswordError && <div className="validation-error">{confirmPasswordError}</div>}
          </div>
          <button
            type="submit"
            className="register-button"
            disabled={!formValid}
          >
            Create Account
          </button>
          <div className="login-prompt">
            Already have an account?{' '}
            <span 
              className="login-link"
              onClick={() => navigate('/login')}
            >
              Login here
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
