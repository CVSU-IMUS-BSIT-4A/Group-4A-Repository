import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authorsAPI, Author } from '../api/client';

const AuthorsList: React.FC = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchAuthors();
  }, [page]);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await authorsAPI.getAll(page, limit);
      setAuthors(response.data.data);
      setTotal(response.data.total);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch authors');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this author?')) {
      try {
        await authorsAPI.delete(id);
        fetchAuthors();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete author');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading authors...</div>;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">✍️ Authors</h2>
          <Link to="/authors/new" className="btn btn-primary">
            Add New Author
          </Link>
        </div>

        {error && <div className="error">{error}</div>}

        {authors.length === 0 ? (
          <p>No authors found. <Link to="/authors/new">Add your first author</Link></p>
        ) : (
          <>
            <div className="table-container" style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Nationality</th>
                    <th>Birth Date</th>
                    <th>Books Count</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {authors.map((author) => (
                    <tr key={author.id}>
                      <td>
                        <strong>{author.name}</strong>
                        {author.biography && (
                          <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>
                            {author.biography.substring(0, 100)}...
                          </div>
                        )}
                      </td>
                      <td>{author.nationality || '-'}</td>
                      <td>{author.birthDate || '-'}</td>
                      <td>{author.books?.length || 0}</td>
                      <td>
                        <Link to={`/authors/edit/${author.id}`} className="btn btn-sm btn-secondary">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(author.id)}
                          className="btn btn-sm btn-danger"
                          style={{ marginLeft: '0.5rem' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {total > limit && (
              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="btn btn-secondary"
                  style={{ marginRight: '0.5rem' }}
                >
                  Previous
                </button>
                <span style={{ margin: '0 1rem' }}>
                  Page {page} of {Math.ceil(total / limit)}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= Math.ceil(total / limit)}
                  className="btn btn-secondary"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AuthorsList;
