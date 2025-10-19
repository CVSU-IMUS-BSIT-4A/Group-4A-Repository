import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { postsAPI, commentsAPI } from '../api/client';
import type { Post, Comment, PaginatedResponse } from '../api/client';
import Pagination from './Pagination';

// Icon Components
const EditIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const DeleteIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3,6 5,6 21,6"></polyline>
    <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

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
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Comments state
  const [comments, setComments] = useState<{ [postId: number]: Comment[] }>({});
  const [commentPages, setCommentPages] = useState<{ [postId: number]: number }>({});
  const [commentTotals, setCommentTotals] = useState<{ [postId: number]: number }>({});
  const [newComments, setNewComments] = useState<{ [postId: number]: string }>({});
  const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set());
  
  // Edit state for posts
  const [editingPost, setEditingPost] = useState<number | null>(null);
  const [editPostTitle, setEditPostTitle] = useState('');
  const [editPostContent, setEditPostContent] = useState('');
  
  // Edit state for comments
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editCommentContent, setEditCommentContent] = useState('');

  const limit = 6; // Changed to 6 to show 2 rows of 3 posts each

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getAll(currentPage, limit);
      const data: PaginatedResponse<Post> = response.data;
      
      // Add computed authorId for compatibility
      const postsWithAuthorId = data.data.map(post => ({
        ...post,
        authorId: post.author?.id
      }));
      
      setPosts(postsWithAuthorId);
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
      
      // Add computed authorId for compatibility
      const commentsWithAuthorId = data.data.map(comment => ({
        ...comment,
        authorId: comment.author?.id
      }));
      
      setComments(prev => ({ ...prev, [postId]: commentsWithAuthorId }));
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
      await postsAPI.create(title, content);
      setTitle('');
      setContent('');
      setShowCreateModal(false);
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
      await commentsAPI.create(postId, commentContent);
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

  const handleEditPost = (post: Post) => {
    setEditingPost(post.id);
    setEditPostTitle(post.title);
    setEditPostContent(post.content);
  };

  const handleSavePost = async (postId: number) => {
    try {
      await postsAPI.update(postId, { title: editPostTitle, content: editPostContent });
      setEditingPost(null);
      setEditPostTitle('');
      setEditPostContent('');
      fetchPosts(); // Refresh posts
    } catch (error) {
      console.error('Failed to update post:', error);
    }
  };

  const handleCancelEditPost = () => {
    setEditingPost(null);
    setEditPostTitle('');
    setEditPostContent('');
  };

  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment.id);
    setEditCommentContent(comment.content);
  };

  const handleSaveComment = async (postId: number, commentId: number) => {
    try {
      await commentsAPI.update(postId, commentId, editCommentContent);
      setEditingComment(null);
      setEditCommentContent('');
      fetchComments(postId); // Refresh comments for this post
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleCancelEditComment = () => {
    setEditingComment(null);
    setEditCommentContent('');
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
      {/* Sticky Header */}
      <header className="sticky-header">
        <div className="header-content">
          <h1 className="brand">SocialApp Dashboard</h1>
          <div className="nav">
            <span>Welcome, {user?.name}</span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="posts-container">
          <h2>Recent Posts ({total} total)</h2>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
              Loading posts...
            </div>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
              No posts found. Be the first to create one!
            </div>
          ) : (
            <div className="posts-grid">
              {posts.map((post) => (
                <div key={post.id} className="post-card">
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    position: 'relative',
                    minHeight: '40px'
                  }}>
                    <div style={{ flex: 1 }}>
                      {editingPost === post.id ? (
                        // Edit mode
                        <div style={{ marginBottom: '12px' }}>
                          <input
                            type="text"
                            value={editPostTitle}
                            onChange={(e) => setEditPostTitle(e.target.value)}
                            style={{ width: '100%', marginBottom: '8px', padding: '8px' }}
                          />
                          <textarea
                            value={editPostContent}
                            onChange={(e) => setEditPostContent(e.target.value)}
                            style={{ width: '100%', minHeight: '80px', padding: '8px' }}
                          />
                          <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => handleSavePost(post.id)}
                              style={{
                                background: 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                padding: '4px 12px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                cursor: 'pointer'
                              }}
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEditPost}
                              style={{
                                background: 'transparent',
                                color: 'var(--muted)',
                                border: '1px solid var(--border)',
                                padding: '4px 12px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                cursor: 'pointer'
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        // View mode
                        <>
                          <h4>{post.title}</h4>
                          <p>{post.content}</p>
                        </>
                      )}
                    </div>
                    {user?.id === post.author?.id && editingPost !== post.id && (
                      <div style={{ 
                        display: 'flex', 
                        gap: '4px', 
                        marginLeft: '12px',
                        position: 'absolute',
                        top: '8px',
                        right: '8px'
                      }}>
                        <button
                          onClick={() => handleEditPost(post)}
                          className="action-button edit-button"
                          data-tooltip="Edit post"
                          style={{
                            padding: '6px',
                            width: '28px',
                            height: '28px'
                          }}
                        >
                          <EditIcon size={14} />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="action-button delete-button"
                          data-tooltip="Delete post"
                          style={{
                            padding: '6px',
                            width: '28px',
                            height: '28px'
                          }}
                        >
                          <DeleteIcon size={14} />
                        </button>
                      </div>
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
                                marginBottom: '8px',
                                position: 'relative'
                              }}
                            >
                              <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'flex-start',
                                minHeight: '32px'
                              }}>
                                <div style={{ flex: 1 }}>
                                  {editingComment === comment.id ? (
                                    // Edit mode
                                    <div>
                                      <textarea
                                        value={editCommentContent}
                                        onChange={(e) => setEditCommentContent(e.target.value)}
                                        style={{ 
                                          width: '100%', 
                                          minHeight: '60px', 
                                          padding: '8px',
                                          fontSize: '14px',
                                          marginBottom: '8px'
                                        }}
                                      />
                                      <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                          onClick={() => handleSaveComment(post.id, comment.id)}
                                          style={{
                                            background: 'var(--primary)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '2px 8px',
                                            borderRadius: '4px',
                                            fontSize: '10px',
                                            cursor: 'pointer'
                                          }}
                                        >
                                          Save
                                        </button>
                                        <button
                                          onClick={handleCancelEditComment}
                                          style={{
                                            background: 'transparent',
                                            color: 'var(--muted)',
                                            border: '1px solid var(--border)',
                                            padding: '2px 8px',
                                            borderRadius: '4px',
                                            fontSize: '10px',
                                            cursor: 'pointer'
                                          }}
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    // View mode
                                    <>
                                      <div style={{ fontSize: '14px' }}>{comment.content}</div>
                                      <div style={{ 
                                        fontSize: '11px', 
                                        color: 'var(--muted)', 
                                        marginTop: '6px' 
                                      }}>
                                        By {comment.author?.name || 'Unknown'} • {formatDate(comment.createdAt)}
                                      </div>
                                    </>
                                  )}
                                </div>
                                {user?.id === comment.author?.id && editingComment !== comment.id && (
                                  <div style={{ 
                                    display: 'flex', 
                                    gap: '4px', 
                                    marginLeft: '8px',
                                    position: 'absolute',
                                    top: '8px',
                                    right: '8px'
                                  }}>
                                    <button
                                      onClick={() => handleEditComment(comment)}
                                      className="action-button edit-button"
                                      data-tooltip="Edit comment"
                                      style={{
                                        padding: '4px',
                                        width: '24px',
                                        height: '24px'
                                      }}
                                    >
                                      <EditIcon size={12} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteComment(post.id, comment.id)}
                                      className="action-button delete-button"
                                      data-tooltip="Delete comment"
                                      style={{
                                        padding: '4px',
                                        width: '24px',
                                        height: '24px'
                                      }}
                                    >
                                      <DeleteIcon size={12} />
                                    </button>
                                  </div>
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
              ))}
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>

      {/* Floating Create Post Button */}
      <button 
        className="floating-create-btn"
        onClick={() => setShowCreateModal(true)}
      >
        Create Post
      </button>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) setShowCreateModal(false);
        }}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New Post</h3>
              <button 
                className="modal-close"
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>
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
        </div>
      )}
    </div>
  );
};

export default Dashboard;