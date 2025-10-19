import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { booksAPI, authorsAPI, categoriesAPI } from '../api/client';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    books: 0,
    authors: 0,
    categories: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [booksRes, authorsRes, categoriesRes] = await Promise.all([
          booksAPI.getAll(1, 1),
          authorsAPI.getAll(1, 1),
          categoriesAPI.getAll(1, 1),
        ]);

        setStats({
          books: booksRes.data.total,
          authors: authorsRes.data.total,
          categories: categoriesRes.data.total,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div>
      <h1>Bookshelf Dashboard</h1>
      <p>Manage your digital library with ease</p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.books}</div>
          <div className="stat-label">Total Books</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.authors}</div>
          <div className="stat-label">Authors</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.categories}</div>
          <div className="stat-label">Categories</div>
        </div>
      </div>

      <div className="grid grid-3">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📚 Books</h3>
          </div>
          <p>Manage your book collection</p>
          <div style={{ marginTop: '1rem' }}>
            <Link to="/books" className="btn btn-primary">
              View Books
            </Link>
            <Link to="/books/new" className="btn btn-secondary" style={{ marginLeft: '0.5rem' }}>
              Add Book
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">✍️ Authors</h3>
          </div>
          <p>Manage author information</p>
          <div style={{ marginTop: '1rem' }}>
            <Link to="/authors" className="btn btn-primary">
              View Authors
            </Link>
            <Link to="/authors/new" className="btn btn-secondary" style={{ marginLeft: '0.5rem' }}>
              Add Author
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🏷️ Categories</h3>
          </div>
          <p>Organize books by category</p>
          <div style={{ marginTop: '1rem' }}>
            <Link to="/categories" className="btn btn-primary">
              View Categories
            </Link>
            <Link to="/categories/new" className="btn btn-secondary" style={{ marginLeft: '0.5rem' }}>
              Add Category
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
