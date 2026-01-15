import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { booksAPI, Book } from '../api/client';

const BooksList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchBooks();
  }, [page]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await booksAPI.getAll(page, limit);
      setBooks(response.data.data);
      setTotal(response.data.total);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await booksAPI.delete(id);
        fetchBooks();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete book');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading books...</div>;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📚 Books</h2>
          <Link to="/books/new" className="btn btn-primary">
            Add New Book
          </Link>
        </div>

        {error && <div className="error">{error}</div>}

        {books.length === 0 ? (
          <p>No books found. <Link to="/books/new">Add your first book</Link></p>
        ) : (
          <>
            <div className="table-container" style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Year</th>
                    <th>ISBN</th>
                    <th>Available</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book.id}>
                      <td>
                        <strong>{book.title}</strong>
                        {book.description && (
                          <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>
                            {book.description.substring(0, 100)}...
                          </div>
                        )}
                      </td>
                      <td>{book.author?.name || 'Unknown'}</td>
                      <td>{book.category?.name || 'Uncategorized'}</td>
                      <td>{book.publicationYear}</td>
                      <td style={{ fontFamily: 'monospace' }}>{book.isbn}</td>
                      <td>
                        <span style={{ 
                          color: book.isAvailable ? '#28a745' : '#dc3545',
                          fontWeight: 'bold'
                        }}>
                          {book.isAvailable ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td>
                        <Link to={`/books/edit/${book.id}`} className="btn btn-sm btn-secondary">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(book.id)}
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

export default BooksList;
