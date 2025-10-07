import { useEffect, useState } from 'react'
import { BrowserRouter, Link, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import './App.css'
import api from './api/client'

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.access_token);
      navigate('/');
    } catch (err: any) {
      setError('Login failed');
    }
  };
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
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
    <div>
      <h2>Posts</h2>
      <div>
        <input placeholder="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="content" value={content} onChange={(e) => setContent(e.target.value)} />
        <button onClick={create}>Create</button>
      </div>
      <ul>
        {posts.map((p) => (
          <li key={p.id}><Link to={`/posts/${p.id}`}>{p.title}</Link></li>
        ))}
      </ul>
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

function App() {
  const token = !!localStorage.getItem('token');
  const logout = () => { localStorage.removeItem('token'); window.location.href = '/login'; };
  return (
    <BrowserRouter>
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link to="/">Home</Link>
        {!token ? <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </> : <button onClick={logout}>Logout</button>}
      </nav>
      <Routes>
        <Route path="/" element={<Posts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/posts/:id" element={<PostDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
