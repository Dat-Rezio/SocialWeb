import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';
import './Admin.css';

const Admin = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [stats, setStats] = useState(null);

  // Redirect if not admin
  if (user && user.role !== 'admin') {
    return (
      <div className="admin-container">
        <div className="admin-error">
          <h2>⚠️ Truy cập bị từ chối</h2>
          <p>Bạn không có quyền truy cập trang quản lý admin.</p>
        </div>
      </div>
    );
  }

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/admin/stats');
      setStats(res.stats);
    } catch (err) {
      toast.error('Lỗi lấy thống kê');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLoginActivity = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/admin/login-activity?limit=50');
      setData(res.users);
    } catch (err) {
      toast.error('Lỗi lấy thông tin đăng nhập');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPostLikes = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/admin/post-likes?limit=50');
      setData(res.likes);
    } catch (err) {
      toast.error('Lỗi lấy thông tin like');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPostComments = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/admin/post-comments?limit=50');
      setData(res.comments);
    } catch (err) {
      toast.error('Lỗi lấy thông tin comment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    setData(null);
    if (activeTab === 'stats') {
      fetchStats();
    } else if (activeTab === 'logins') {
      fetchLoginActivity();
    } else if (activeTab === 'likes') {
      fetchPostLikes();
    } else if (activeTab === 'comments') {
      fetchPostComments();
    }
  }, [activeTab]);

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>🛡️ Admin Dashboard</h1>
        <p>Quản lý và theo dõi hoạt động hệ thống</p>
      </div>

      {/* Statistics Section */}
      {stats && (
        <div className="admin-stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-value">{stats.total_users}</div>
              <div className="stat-label">Tổng Người Dùng</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <div className="stat-value">{stats.total_posts}</div>
              <div className="stat-label">Tổng Bài Viết</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👍</div>
            <div className="stat-content">
              <div className="stat-value">{stats.total_likes}</div>
              <div className="stat-label">Tổng Like</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💬</div>
            <div className="stat-content">
              <div className="stat-value">{stats.total_comments}</div>
              <div className="stat-label">Tổng Comment</div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📊 Thống Kê
        </button>
        <button
          className={`tab-btn ${activeTab === 'logins' ? 'active' : ''}`}
          onClick={() => setActiveTab('logins')}
        >
          🔐 Đăng Nhập
        </button>
        <button
          className={`tab-btn ${activeTab === 'likes' ? 'active' : ''}`}
          onClick={() => setActiveTab('likes')}
        >
          👍 Like Bài Viết
        </button>
        <button
          className={`tab-btn ${activeTab === 'comments' ? 'active' : ''}`}
          onClick={() => setActiveTab('comments')}
        >
          💬 Comment Bài Viết
        </button>
      </div>

      {/* Content */}
      <div className="admin-content">
        {loading ? (
          <div className="loading">⏳ Đang tải dữ liệu...</div>
        ) : (
          <>
            {activeTab === 'stats' && stats && (
              <div className="stats-detail">
                <h2>Thống Kê Hệ Thống</h2>
                <div className="stats-info">
                  <p>
                    <strong>Tổng người dùng:</strong> {stats.total_users}
                  </p>
                  <p>
                    <strong>Tổng bài viết:</strong> {stats.total_posts}
                  </p>
                  <p>
                    <strong>Tổng like:</strong> {stats.total_likes}
                  </p>
                  <p>
                    <strong>Tổng comment:</strong> {stats.total_comments}
                  </p>
                  {Array.isArray(stats.users_by_role) && (
                    <div className="roles-breakdown">
                      <strong>Phân bổ vai trò:</strong>
                      {stats.users_by_role.map((item, idx) => (
                        <p key={idx}>
                          {item.role}: {item.count}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'logins' && data && (
              <div className="activity-list">
                <h2>Hoạt Động Đăng Nhập ({data.length})</h2>
                {data.length === 0 ? (
                  <p className="empty-message">Không có dữ liệu</p>
                ) : (
                  <div className="table-container">
                    <table className="activity-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Username</th>
                          <th>Email</th>
                          <th>Tên Đầy Đủ</th>
                          <th>Vai Trò</th>
                          <th>Ngày Tạo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((user) => (
                          <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>
                              <div className="user-info">
                                {user.avatar_url && (
                                  <img
                                    src={user.avatar_url}
                                    alt={user.username}
                                    className="user-avatar-small"
                                  />
                                )}
                                <span>{user.username}</span>
                              </div>
                            </td>
                            <td>{user.email}</td>
                            <td>{user.fullname}</td>
                            <td>
                              <span className={`role-badge ${user.role}`}>
                                {user.role === 'admin' ? '👑' : '👤'} {user.role}
                              </span>
                            </td>
                            <td>{new Date(user.created_at).toLocaleString('vi-VN')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'likes' && data && (
              <div className="activity-list">
                <h2>Hoạt Động Like Bài Viết ({data.length})</h2>
                {data.length === 0 ? (
                  <p className="empty-message">Không có dữ liệu</p>
                ) : (
                  <div className="cards-container">
                    {data.map((like) => (
                      <div key={like.id} className="activity-card">
                        <div className="card-header">
                          <div className="user-info-card">
                            {like.avatar_url && (
                              <img
                                src={like.avatar_url}
                                alt={like.username}
                                className="user-avatar"
                              />
                            )}
                            <div className="user-details">
                              <h4>{like.username}</h4>
                              <p>{like.email}</p>
                              <span className={`role-badge ${like.role}`}>
                                {like.role === 'admin' ? '👑' : '👤'} {like.role}
                              </span>
                            </div>
                          </div>
                          <div className="like-badge">👍</div>
                        </div>
                        <div className="card-content">
                          <div className="post-info">
                            <strong>Bài viết:</strong>
                            <p>{like.post_content || 'Không có nội dung'}</p>
                            <small>
                              {new Date(like.post_created_at).toLocaleString('vi-VN')}
                            </small>
                          </div>
                          <div className="action-time">
                            <small>Liked: {new Date(like.liked_at).toLocaleString('vi-VN')}</small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'comments' && data && (
              <div className="activity-list">
                <h2>Hoạt Động Comment Bài Viết ({data.length})</h2>
                {data.length === 0 ? (
                  <p className="empty-message">Không có dữ liệu</p>
                ) : (
                  <div className="cards-container">
                    {data.map((comment) => (
                      <div key={comment.id} className="activity-card">
                        <div className="card-header">
                          <div className="user-info-card">
                            {comment.avatar_url && (
                              <img
                                src={comment.avatar_url}
                                alt={comment.username}
                                className="user-avatar"
                              />
                            )}
                            <div className="user-details">
                              <h4>{comment.username}</h4>
                              <p>{comment.email}</p>
                              <span className={`role-badge ${comment.role}`}>
                                {comment.role === 'admin' ? '👑' : '👤'} {comment.role}
                              </span>
                            </div>
                          </div>
                          <div className="comment-badge">💬</div>
                        </div>
                        <div className="card-content">
                          <div className="post-info">
                            <strong>Bài viết:</strong>
                            <p>{comment.post_content || 'Không có nội dung'}</p>
                            <small>
                              {new Date(comment.post_created_at).toLocaleString('vi-VN')}
                            </small>
                          </div>
                          <div className="comment-content">
                            <strong>Bình luận:</strong>
                            <p>{comment.comment_content}</p>
                          </div>
                          <div className="action-time">
                            <small>
                              Commented: {new Date(comment.commented_at).toLocaleString('vi-VN')}
                            </small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;
