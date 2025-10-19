import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [booksRes, authorsRes, categoriesRes] = await Promise.all([
        fetch('http://localhost:3000/books?page=1&limit=100').then(res => res.json()),
        fetch('http://localhost:3000/authors?page=1&limit=100').then(res => res.json()),
        fetch('http://localhost:3000/categories?page=1&limit=100').then(res => res.json()),
      ]);
      setBooks(booksRes.data || []);
      setAuthors(authorsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortData = (data: any[], key: string) => {
    return [...data].sort((a, b) => {
      const aVal = a[key]?.toLowerCase() || '';
      const bVal = b[key]?.toLowerCase() || '';
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
  };

  const filterData = (data: any[], searchKey: string) => {
    if (!filterText) return data;
    return data.filter(item => 
      item[searchKey]?.toLowerCase().includes(filterText.toLowerCase())
    );
  };

  const getFilteredBooks = () => {
    const filtered = filterData(books, 'title');
    return sortData(filtered, 'title');
  };

  const getFilteredAuthors = () => {
    const filtered = filterData(authors, 'name');
    return sortData(filtered, 'name');
  };

  const getFilteredCategories = () => {
    const filtered = filterData(categories, 'name');
    return sortData(filtered, 'name');
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    setFilterText(''); // Clear filter when switching views
    setSortOrder('asc'); // Reset sort order
  };

  const renderDashboard = () => (
    <div>
      <h1>📚 Bookshelf Manager</h1>
      <p>Manage your digital library with ease</p>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{books.length}</div>
          <div className="stat-label">Total Books</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{authors.length}</div>
          <div className="stat-label">Authors</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{categories.length}</div>
          <div className="stat-label">Categories</div>
        </div>
      </div>

      <div className="grid grid-3">
        <div className="card">
          <h3>📚 Books</h3>
          <p>Manage your book collection</p>
          <button onClick={() => handleViewChange('books')} className="btn btn-primary">
            View Books
          </button>
        </div>
        <div className="card">
          <h3>✍️ Authors</h3>
          <p>Manage author information</p>
          <button onClick={() => handleViewChange('authors')} className="btn btn-primary">
            View Authors
          </button>
        </div>
        <div className="card">
          <h3>🏷️ Categories</h3>
          <p>Organize books by category</p>
          <button onClick={() => handleViewChange('categories')} className="btn btn-primary">
            View Categories
          </button>
        </div>
      </div>
    </div>
  );

  const renderBooks = () => {
    const filteredBooks = getFilteredBooks();
    
    return (
      <div>
        <div className="card">
          <div className="card-header">
            <h2>📚 Books ({filteredBooks.length})</h2>
          <button onClick={() => handleViewChange('dashboard')} className="btn btn-secondary">
            Back to Dashboard
          </button>
          </div>
          
          {/* Filter and Sort Controls */}
          <div style={{ marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search books by title..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="form-input"
              style={{ flex: '1', minWidth: '200px' }}
            />
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="btn btn-secondary"
            >
              {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
            </button>
          </div>

          {loading ? (
            <div className="loading">Loading books...</div>
          ) : filteredBooks.length === 0 ? (
            <p>No books found.</p>
          ) : (
            <div className="table-container" style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Year</th>
                    <th>ISBN</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map((book: any) => (
                    <tr key={book.id}>
                      <td><strong>{book.title}</strong></td>
                      <td>{book.author?.name || 'Unknown'}</td>
                      <td>{book.category?.name || 'Uncategorized'}</td>
                      <td>{book.publicationYear}</td>
                      <td style={{ fontFamily: 'monospace' }}>{book.isbn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAuthors = () => {
    const filteredAuthors = getFilteredAuthors();
    
    return (
      <div>
        <div className="card">
          <div className="card-header">
            <h2>✍️ Authors ({filteredAuthors.length})</h2>
          <button onClick={() => handleViewChange('dashboard')} className="btn btn-secondary">
            Back to Dashboard
          </button>
          </div>
          
          {/* Filter and Sort Controls */}
          <div style={{ marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search authors by name..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="form-input"
              style={{ flex: '1', minWidth: '200px' }}
            />
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="btn btn-secondary"
            >
              {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
            </button>
          </div>

          {loading ? (
            <div className="loading">Loading authors...</div>
          ) : filteredAuthors.length === 0 ? (
            <p>No authors found.</p>
          ) : (
            <div className="table-container" style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Nationality</th>
                    <th>Birth Date</th>
                    <th>Books Count</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAuthors.map((author: any) => (
                    <tr key={author.id}>
                      <td><strong>{author.name}</strong></td>
                      <td>{author.nationality || '-'}</td>
                      <td>{author.birthDate || '-'}</td>
                      <td>{author.books?.length || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCategories = () => {
    const filteredCategories = getFilteredCategories();
    
    return (
      <div>
        <div className="card">
          <div className="card-header">
            <h2>🏷️ Categories ({filteredCategories.length})</h2>
          <button onClick={() => handleViewChange('dashboard')} className="btn btn-secondary">
            Back to Dashboard
          </button>
          </div>
          
          {/* Filter and Sort Controls */}
          <div style={{ marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search categories by name..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="form-input"
              style={{ flex: '1', minWidth: '200px' }}
            />
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="btn btn-secondary"
            >
              {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
            </button>
          </div>

          {loading ? (
            <div className="loading">Loading categories...</div>
          ) : filteredCategories.length === 0 ? (
            <p>No categories found.</p>
          ) : (
            <div className="table-container" style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Books Count</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((category: any) => (
                    <tr key={category.id}>
                      <td><strong>{category.name}</strong></td>
                      <td>{category.description || '-'}</td>
                      <td>{category.books?.length || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">📚 Bookshelf Manager</h1>
          <nav className="nav">
              <button onClick={() => handleViewChange('dashboard')} className="nav-link">
                Dashboard
              </button>
              <button onClick={() => handleViewChange('books')} className="nav-link">
                Books
              </button>
              <button onClick={() => handleViewChange('authors')} className="nav-link">
                Authors
              </button>
              <button onClick={() => handleViewChange('categories')} className="nav-link">
                Categories
              </button>
          </nav>
        </div>
      </header>
      
      <main className="main-content">
        {currentView === 'dashboard' && renderDashboard()}
        {currentView === 'books' && renderBooks()}
        {currentView === 'authors' && renderAuthors()}
        {currentView === 'categories' && renderCategories()}
      </main>
    </div>
  );
}

export default App;