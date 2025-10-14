import { useEffect, useState } from 'react'
import { BrowserRouter, Link, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import './App.css'
import api from './api/client'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    console.log('Attempting login with:', { email, password: '***' });
    try {
      const res = await api.post('/auth/login', { email, password });
      console.log('Login response:', res.data);
      localStorage.setItem('token', res.data.access_token);
      // Force page reload to update authentication state
      window.location.href = '/';
    } catch (err: any) {
      console.error('Login error:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Login failed');
    }
  };
  return (
    <div className="login-wrap">
      <div>
        <div className="login-brand" style={{ color: '#3b82f6' }}>Welcome</div>
        <div className="login-sub">Sign in to continue to Activity5 Blog.</div>
      </div>
      <div className="login-card">
        <form onSubmit={onSubmit} className="stack">
          <input placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="primary">Log in</button>
          {error && <p style={{ color: '#ef4444', margin: 0 }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}

function Posts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const load = async () => {
    const res = await api.get('/posts');
    setPosts(res.data.data ?? res.data);
  };
  useEffect(() => { load(); }, []);
  const create = async () => {
    await api.post('/posts', { title, content });
    setTitle(''); setContent('');
    await load();
  };
  return (
    <div className="posts-container">
      <h2>Posts</h2>
      <div className="posts-layout">
        <div className="post-form">
          <input placeholder="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea placeholder="content" value={content} onChange={(e) => setContent(e.target.value)} rows={5} />
          <button className="primary" onClick={create}>Create</button>
        </div>
        <div className="posts-sidebar">
          <h3>Recent Posts</h3>
          <ul className="post-list">
            {posts.map((p) => (
              <li key={p.id}>
                <Link to={`/posts/${p.id}`}>
                  <h4>{p.title}</h4>
                  <p>{p.content}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function PostDetail() {
  const { id } = useParams();
  const postId = Number(id);
  const [post, setPost] = useState<any | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const load = async () => {
    const [p, c] = await Promise.all([
      api.get(`/posts/${postId}`),
      api.get(`/posts/${postId}/comments`),
    ]);
    setPost(p.data);
    setComments(c.data.data ?? c.data);
  };
  useEffect(() => { if (!Number.isNaN(postId)) { load(); } }, [postId]);
  const addComment = async () => {
    await api.post(`/posts/${postId}/comments`, { content });
    setContent('');
    await load();
  };
  if (!post) return <div>Loading...</div>;
  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <h3>Comments</h3>
      <div>
        <input placeholder="write a comment" value={content} onChange={(e) => setContent(e.target.value)} />
        <button onClick={addComment}>Add</button>
      </div>
      <ul>
        {comments.map((c) => (
          <li key={c.id}>{c.content}</li>
        ))}
      </ul>
    </div>
  );
}

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/users', { email, name, password });
      navigate('/login');
    } catch (err: any) {
      setError('Registration failed');
    }
  };
  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={onSubmit}>
        <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Register</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} 
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
