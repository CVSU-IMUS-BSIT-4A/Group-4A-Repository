import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authorsAPI, Author } from '../api/client';

const AuthorForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    biography: '',
    birthDate: '',
    nationality: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit) {
      fetchAuthor();
    }
  }, [id]);

  const fetchAuthor = async () => {
    try {
      setLoading(true);
      const response = await authorsAPI.getById(Number(id));
      const author = response.data;
      setFormData({
        name: author.name,
        biography: author.biography || '',
        birthDate: author.birthDate || '',
        nationality: author.nationality || '',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch author');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEdit) {
        await authorsAPI.update(Number(id), formData);
      } else {
        await authorsAPI.create(formData);
      }
      navigate('/authors');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save author');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading && isEdit) {
    return <div className="loading">Loading author...</div>;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            {isEdit ? 'Edit Author' : 'Add New Author'}
          </h2>
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nationality</label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Birth Date</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Biography</label>
            <textarea
              name="biography"
              value={formData.biography}
              onChange={handleChange}
              className="form-textarea"
              rows={4}
              placeholder="Tell us about the author's life and work..."
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : (isEdit ? 'Update Author' : 'Add Author')}
            </button>
            <button
              type="button"
              onClick={() => navigate('/authors')}
              className="btn btn-secondary"
              style={{ marginLeft: '0.5rem' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthorForm;
