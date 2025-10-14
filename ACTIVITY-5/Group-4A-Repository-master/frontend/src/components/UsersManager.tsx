import React, { useState, useEffect } from 'react';
import { usersAPI } from '../api/client';
import type { User, PaginatedResponse } from '../api/client';
import Pagination from './Pagination';

const UsersManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '' });

  const limit = 10;

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAll(currentPage, limit);
      const data: PaginatedResponse<User> = response.data;
      setUsers(data.data);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setEditForm({ name: user.name, email: user.email });
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    try {
      await usersAPI.update(editingUser.id, editForm);
      setEditingUser(null);
      fetchUsers(); // Refresh users list
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDelete = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await usersAPI.delete(userId);
      fetchUsers(); // Refresh users list
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="panel">
      <h3>Users Management ({total} total)</h3>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--muted)' }}>
          Loading users...
        </div>
      ) : users.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--muted)' }}>
          No users found.
        </div>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: '14px'
            }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'var(--muted)' }}>ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'var(--muted)' }}>Name</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'var(--muted)' }}>Email</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'var(--muted)' }}>Joined</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'var(--muted)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px' }}>{user.id}</td>
                    <td style={{ padding: '12px' }}>
                      {editingUser?.id === user.id ? (
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          style={{ width: '100%', height: '32px' }}
                        />
                      ) : (
                        user.name
                      )}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {editingUser?.id === user.id ? (
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          style={{ width: '100%', height: '32px' }}
                        />
                      ) : (
                        user.email
                      )}
                    </td>
                    <td style={{ padding: '12px', color: 'var(--muted)' }}>
                      {formatDate(user.createdAt)}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {editingUser?.id === user.id ? (
                          <>
                            <button
                              onClick={handleSaveEdit}
                              style={{
                                background: 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                cursor: 'pointer'
                              }}
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingUser(null)}
                              style={{
                                background: 'transparent',
                                color: 'var(--muted)',
                                border: '1px solid var(--border)',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                cursor: 'pointer'
                              }}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(user)}
                              style={{
                                background: 'transparent',
                                color: 'var(--primary)',
                                border: '1px solid var(--border)',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                cursor: 'pointer'
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              style={{
                                background: 'transparent',
                                color: '#ef4444',
                                border: '1px solid var(--border)',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                cursor: 'pointer'
                              }}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default UsersManager;