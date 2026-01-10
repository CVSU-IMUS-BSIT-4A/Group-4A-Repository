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
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isbn: '',
    publicationYear: new Date().getFullYear(),
    pageCount: 0,
    coverImage: '',
    price: 0,
    isAvailable: true,
    authorId: 0,
    categoryId: 0,
  });
  const [authorFormData, setAuthorFormData] = useState({
    name: '',
    nationality: '',
    birthDate: '',
  });
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [authorFormError, setAuthorFormError] = useState<string | null>(null);
  const [categoryFormError, setCategoryFormError] = useState<string | null>(null);

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

  const handleDeleteBook = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/books/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete book');
      }

      await fetchData();
      alert('Book deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting book:', error);
      alert(error.message || 'Failed to delete book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAuthor = async (id: number) => {
    // Check if author has books
    const authorBooks = books.filter((book: any) => book.authorId === id || book.author?.id === id);
    
    if (authorBooks.length > 0) {
      alert(`Cannot delete this author because they have ${authorBooks.length} book(s) associated with them. Please delete or reassign those books first.`);
      return;
    }

    if (!window.confirm('Are you sure you want to delete this author?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/authors/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete author');
      }

      await fetchData();
      alert('Author deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting author:', error);
      alert(error.message || 'Failed to delete author. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    // Check if category has books
    const categoryBooks = books.filter((book: any) => book.categoryId === id || book.category?.id === id);
    
    if (categoryBooks.length > 0) {
      alert(`Cannot delete this category because it has ${categoryBooks.length} book(s) associated with it. Please delete or reassign those books first.`);
      return;
    }

    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/categories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete category');
      }

      await fetchData();
      alert('Category deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting category:', error);
      alert(error.message || 'Failed to delete category. Please try again.');
    } finally {
      setLoading(false);
    }
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
    setFilterText('');
    setSortOrder('asc');
    if (view === 'addBook') {
      setFormData({
        title: '',
        description: '',
        isbn: '',
        publicationYear: new Date().getFullYear(),
        pageCount: 0,
        coverImage: '',
        price: 0,
        isAvailable: true,
        authorId: 0,
        categoryId: 0,
      });
      setFormError(null);
    }
    if (view === 'addAuthor') {
      setAuthorFormData({
        name: '',
        nationality: '',
        birthDate: '',
      });
      setAuthorFormError(null);
    }
    if (view === 'addCategory') {
      setCategoryFormData({
        name: '',
        description: '',
      });
      setCategoryFormError(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? (value === '' ? 0 : Number(value)) : 
              (name === 'authorId' || name === 'categoryId') ? Number(value) :
              value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    if (!formData.title.trim()) {
      setFormError('Title is required');
      return;
    }
    if (!formData.isbn.trim()) {
      setFormError('ISBN is required');
      return;
    }
    const isbnClean = formData.isbn.replace(/[-\s]/g, '');
    if (isbnClean.length !== 10 && isbnClean.length !== 13) {
      setFormError('ISBN must be 10 or 13 digits (e.g., 978-0-306-40615-7 or 0-306-40615-2)');
      return;
    }
    if (!formData.authorId || formData.authorId === 0) {
      setFormError('Please select an author');
      return;
    }
    if (!formData.categoryId || formData.categoryId === 0) {
      setFormError('Please select a category');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || 'Failed to create book';
        throw new Error(errorMessage);
      }

      await fetchData();
      handleViewChange('books');
    } catch (error: any) {
      console.error('Error creating book:', error);
      setFormError(error.message || 'Failed to create book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAuthorFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAuthorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthorFormError(null);
    
    if (!authorFormData.name.trim()) {
      setAuthorFormError('Name is required');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/authors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authorFormData),
      });

      if (!response.ok) {
        throw new Error('Failed to create author');
      }

      await fetchData();
      handleViewChange('authors');
    } catch (error) {
      console.error('Error creating author:', error);
      setAuthorFormError('Failed to create author. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCategoryFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCategoryFormError(null);
    
    if (!categoryFormData.name.trim()) {
      setCategoryFormError('Name is required');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryFormData),
      });

      if (!response.ok) {
        throw new Error('Failed to create category');
      }

      await fetchData();
      handleViewChange('categories');
    } catch (error) {
      console.error('Error creating category:', error);
      setCategoryFormError('Failed to create category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderDashboard = () => (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <h1 style={{ margin: '0' }}>📚 Bookshelf Manager</h1>
        <p style={{ margin: '5px 0 0 0' }}>Manage your digital library with ease</p>
      </div>
      
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
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button onClick={() => handleViewChange('books')} className="btn btn-primary">
              View Books
            </button>
            <button onClick={() => handleViewChange('addBook')} className="btn btn-secondary">
              + Add Book
            </button>
          </div>
        </div>
        <div className="card">
          <h3>✍️ Authors</h3>
          <p>Manage author information</p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button onClick={() => handleViewChange('authors')} className="btn btn-primary">
              View Authors
            </button>
            <button onClick={() => handleViewChange('addAuthor')} className="btn btn-secondary">
              + Add Author
            </button>
          </div>
        </div>
        <div className="card">
          <h3>🏷️ Categories</h3>
          <p>Organize books by category</p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button onClick={() => handleViewChange('categories')} className="btn btn-primary">
              View Categories
            </button>
            <button onClick={() => handleViewChange('addCategory')} className="btn btn-secondary">
              + Add Category
            </button>
          </div>
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
                    <th>Actions</th>
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
                      <td>
                        <button 
                          onClick={() => handleDeleteBook(book.id)}
                          className="btn btn-danger btn-sm"
                          title="Delete book"
                        >
                          🗑️ Delete
                        </button>
                      </td>
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
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAuthors.map((author: any) => (
                    <tr key={author.id}>
                      <td><strong>{author.name}</strong></td>
                      <td>{author.nationality || '-'}</td>
                      <td>{author.birthDate || '-'}</td>
                      <td>{author.books?.length || 0}</td>
                      <td>
                        <button 
                          onClick={() => handleDeleteAuthor(author.id)}
                          className="btn btn-danger btn-sm"
                          title="Delete author"
                        >
                          🗑️ Delete
                        </button>
                      </td>
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
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((category: any) => (
                    <tr key={category.id}>
                      <td><strong>{category.name}</strong></td>
                      <td>{category.description || '-'}</td>
                      <td>{category.books?.length || 0}</td>
                      <td>
                        <button 
                          onClick={() => handleDeleteCategory(category.id)}
                          className="btn btn-danger btn-sm"
                          title="Delete category"
                        >
                          🗑️ Delete
                        </button>
                      </td>
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

  const renderAddBook = () => (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>📚 Add New Book</h2>
          <button onClick={() => handleViewChange('dashboard')} className="btn btn-secondary">
            Back to Dashboard
          </button>
        </div>

        {formError && (
          <div style={{ 
            padding: '12px', 
            marginBottom: '20px', 
            backgroundColor: '#fee', 
            border: '1px solid #fcc',
            borderRadius: '4px',
            color: '#c33'
          }}>
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ flex: '1 1 200px', marginBottom: '0' }}>
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group" style={{ flex: '1 1 150px', marginBottom: '0' }}>
              <label htmlFor="authorId">Author *</label>
              <select
                id="authorId"
                name="authorId"
                value={formData.authorId}
                onChange={handleInputChange}
                className="form-input"
                required
              >
                <option value="0">Select author</option>
                {authors.map((author: any) => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ flex: '1 1 150px', marginBottom: '0' }}>
              <label htmlFor="categoryId">Category *</label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="form-input"
                required
              >
                <option value="0">Select category</option>
                {categories.map((category: any) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ flex: '1 1 100px', marginBottom: '0' }}>
              <label htmlFor="publicationYear">Year *</label>
              <input
                type="number"
                id="publicationYear"
                name="publicationYear"
                value={formData.publicationYear}
                onChange={handleInputChange}
                className="form-input"
                min="1000"
                max={new Date().getFullYear() + 1}
                required
              />
            </div>

            <div className="form-group" style={{ flex: '1 1 150px', marginBottom: '0' }}>
              <label htmlFor="isbn">ISBN *</label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '0' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Adding...' : 'Add Book'}
              </button>
              <button 
                type="button" 
                onClick={() => handleViewChange('dashboard')} 
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  const renderAddAuthor = () => (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>✍️ Add New Author</h2>
          <button onClick={() => handleViewChange('dashboard')} className="btn btn-secondary">
            Back to Dashboard
          </button>
        </div>

        {authorFormError && (
          <div style={{ 
            padding: '12px', 
            marginBottom: '20px', 
            backgroundColor: '#fee', 
            border: '1px solid #fcc',
            borderRadius: '4px',
            color: '#c33'
          }}>
            {authorFormError}
          </div>
        )}

        <form onSubmit={handleAuthorSubmit}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ flex: '1 1 200px', marginBottom: '0' }}>
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={authorFormData.name}
                onChange={handleAuthorInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group" style={{ flex: '1 1 150px', marginBottom: '0' }}>
              <label htmlFor="nationality">Nationality</label>
              <input
                type="text"
                id="nationality"
                name="nationality"
                value={authorFormData.nationality}
                onChange={handleAuthorInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ flex: '1 1 150px', marginBottom: '0' }}>
              <label htmlFor="birthDate">Birth Date</label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={authorFormData.birthDate}
                onChange={handleAuthorInputChange}
                className="form-input"
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '0' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Adding...' : 'Add Author'}
              </button>
              <button 
                type="button" 
                onClick={() => handleViewChange('dashboard')} 
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  const renderAddCategory = () => (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>🏷️ Add New Category</h2>
          <button onClick={() => handleViewChange('dashboard')} className="btn btn-secondary">
            Back to Dashboard
          </button>
        </div>

        {categoryFormError && (
          <div style={{ 
            padding: '12px', 
            marginBottom: '20px', 
            backgroundColor: '#fee', 
            border: '1px solid #fcc',
            borderRadius: '4px',
            color: '#c33'
          }}>
            {categoryFormError}
          </div>
        )}

        <form onSubmit={handleCategorySubmit}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ flex: '1 1 200px', marginBottom: '0' }}>
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={categoryFormData.name}
                onChange={handleCategoryInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group" style={{ flex: '1 1 300px', marginBottom: '0' }}>
              <label htmlFor="description">Description</label>
              <input
                type="text"
                id="description"
                name="description"
                value={categoryFormData.description}
                onChange={handleCategoryInputChange}
                className="form-input"
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '0' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Adding...' : 'Add Category'}
              </button>
              <button 
                type="button" 
                onClick={() => handleViewChange('dashboard')} 
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

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
        {currentView === 'addBook' && renderAddBook()}
        {currentView === 'addAuthor' && renderAddAuthor()}
        {currentView === 'addCategory' && renderAddCategory()}
      </main>
    </div>
  );
}

export default App;