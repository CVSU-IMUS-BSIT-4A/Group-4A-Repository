import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { postsAPI, commentsAPI } from '../api/client';
import type { Post, Comment, PaginatedResponse } from '../api/client';
import Pagination from './Pagination';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  // Post creation form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Comments state
  const [comments, setComments] = useState<{ [postId: number]: Comment[] }>({});
  const [commentPages, setCommentPages] = useState<{ [postId: number]: number }>({});
  const [commentTotals, setCommentTotals] = useState<{ [postId: number]: number }>({});
  const [newComments, setNewComments] = useState<{ [postId: number]: string }>({});
  const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set());

  const limit = 5;

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getAll(currentPage, limit);
      const data: PaginatedResponse<Post> = response.data;
      setPosts(data.data);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (postId: number, page = 1) => {
    try {
      const response = await commentsAPI.getByPost(postId, page, 5);
      const data: PaginatedResponse<Comment> = response.data;
      setComments(prev => ({ ...prev, [postId]: data.data }));
      setCommentPages(prev => ({ ...prev, [postId]: data.totalPages }));
      setCommentTotals(prev => ({ ...prev, [postId]: data.total }));
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      setSubmitting(true);
      await postsAPI.create(title, content, user?.id);
      setTitle('');
      setContent('');
      fetchPosts(); // Refresh posts
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateComment = async (postId: number) => {
    const commentContent = newComments[postId];
    if (!commentContent?.trim()) return;

    try {
      await commentsAPI.create(postId, commentContent, user?.id);
      setNewComments(prev => ({ ...prev, [postId]: '' }));
      fetchComments(postId); // Refresh comments for this post
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  };

  const toggleComments = (postId: number) => {
    const newExpanded = new Set(expandedPosts);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
      if (!comments[postId]) {
        fetchComments(postId);
      }
    }
    setExpandedPosts(newExpanded);
  };

  const handleDeletePost = async (postId: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await postsAPI.delete(postId);
      fetchPosts(); // Refresh posts
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const handleDeleteComment = async (postId: number, commentId: number) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      await commentsAPI.delete(postId, commentId);
      fetchComments(postId); // Refresh comments for this post
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="app-shell">
      <header className="header">
        <div className="brand">SocialApp Dashboard</div>
        <div className="nav">
          <span>Welcome, {user?.name}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      {/* Posts & Comments Section */}
      <div className="posts-layout">
          {/* Create Post Form */}
          <div className="panel">
            <h3>Create New Post</h3>
            <form onSubmit={handleCreatePost} className="post-form">
              <input
                type="text"
                placeholder="Post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <textarea
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
              <button type="submit" className="primary" disabled={submitting}>
                {submitting ? 'Posting...' : 'Create Post'}
              </button>
            </form>
          </div>

          {/* Posts List */}
          <div>
            <div className="panel">
              <h3>Recent Posts ({total} total)</h3>
              
              {loading ? (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--muted)' }}>
                  Loading posts...
                </div>
              ) : posts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--muted)' }}>
                  No posts found. Be the first to create one!
                </div>
              ) : (
                <ul className="post-list">
                  {posts.map((post) => (
                    <li key={post.id}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            <h4>{post.title}</h4>
                            <p>{post.content}</p>
                          </div>
                          {user?.id === post.authorId && (
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              style={{
                                background: 'transparent',
                                color: '#ef4444',
                                border: '1px solid #ef4444',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                cursor: 'pointer',
                                marginLeft: '12px'
                              }}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                        <div style={{ 
                          fontSize: '12px', 
                          color: 'var(--muted)', 
                          marginTop: '8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <span>By {post.author?.name || 'Unknown'} • {formatDate(post.createdAt)}</span>
                          <button
                            onClick={() => toggleComments(post.id)}
                            style={{
                              background: 'none',
                              border: '1px solid var(--border)',
                              color: 'var(--primary)',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            {expandedPosts.has(post.id) ? 'Hide' : 'Show'} Comments
                          </button>
                        </div>

                        {/* Comments Section */}
                        {expandedPosts.has(post.id) && (
                          <div style={{ 
                            marginTop: '16px', 
                            paddingTop: '16px', 
                            borderTop: '1px solid var(--border)' 
                          }}>
                            {/* Add Comment Form */}
                            <div style={{ marginBottom: '16px' }}>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                  type="text"
                                  placeholder="Write a comment..."
                                  value={newComments[post.id] || ''}
                                  onChange={(e) => setNewComments(prev => ({ ...prev, [post.id]: e.target.value }))}
                                  style={{ flex: 1, height: '36px' }}
                                />
                                <button
                                  onClick={() => handleCreateComment(post.id)}
                                  className="primary"
                                  style={{ height: '36px', padding: '0 16px' }}
                                  disabled={!newComments[post.id]?.trim()}
                                >
                                  Comment
                                </button>
                              </div>
                            </div>

                            {/* Comments List */}
                            {comments[post.id] && comments[post.id].length > 0 ? (
                              <div>
                                <div style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '12px' }}>
                                  {commentTotals[post.id] || 0} comment(s)
                                </div>
                                {comments[post.id].map((comment) => (
                                  <div 
                                    key={comment.id}
                                    style={{
                                      padding: '12px',
                                      background: 'rgba(255,255,255,0.02)',
                                      borderRadius: '6px',
                                      marginBottom: '8px'
                                    }}
                                  >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                      <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '14px' }}>{comment.content}</div>
                                        <div style={{ 
                                          fontSize: '11px', 
                                          color: 'var(--muted)', 
                                          marginTop: '6px' 
                                        }}>
                                          By {comment.author?.name || 'Unknown'} • {formatDate(comment.createdAt)}
                                        </div>
                                      </div>
                                      {user?.id === comment.authorId && (
                                        <button
                                          onClick={() => handleDeleteComment(post.id, comment.id)}
                                          style={{
                                            background: 'transparent',
                                            color: '#ef4444',
                                            border: '1px solid #ef4444',
                                            padding: '2px 6px',
                                            borderRadius: '4px',
                                            fontSize: '10px',
                                            cursor: 'pointer',
                                            marginLeft: '8px'
                                          }}
                                        >
                                          Delete
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                                
                                {commentPages[post.id] > 1 && (
                                  <Pagination
                                    currentPage={1}
                                    totalPages={commentPages[post.id]}
                                    onPageChange={(page) => fetchComments(post.id, page)}
                                  />
                                )}
                              </div>
                            ) : (
                              <div style={{ 
                                textAlign: 'center', 
                                color: 'var(--muted)', 
                                fontSize: '14px',
                                padding: '16px'
                              }}>
                                No comments yet. Be the first to comment!
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
    </div>
  );
};

export default Dashboard;