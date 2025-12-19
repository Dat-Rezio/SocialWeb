import React, { useState, useEffect } from 'react';
import { Card, Avatar, Button, Tabs, Row, Col, Typography, Image, Tag, Spin, message, Modal, Form, Input, DatePicker, Upload } from 'antd';
import { 
  EditOutlined, 
  EnvironmentOutlined, 
  CalendarOutlined, 
  HeartOutlined, 
  MessageOutlined, 
  ShareAltOutlined,
  CheckCircleFilled,
  UploadOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import PostItem from '../components/PostItem';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, setUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);

  // Edit Profile State
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);

  // Determine which user ID to fetch
  const targetUserId = userId || currentUser?.id;
  const isOwnProfile = !userId || parseInt(userId) === currentUser?.id;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!targetUserId) return;
      setLoading(true);
      try {
        // If it's own profile, we can use /users/me, but /users/:id works for both if we have the ID
        // However, /users/:id only returns profile data, not username/email in the current implementation
        // Let's try to fetch from /users/:id first
        let res;
        if (isOwnProfile) {
             res = await axiosClient.get('/users/me');
             // res.user and res.profile
             setProfileUser({ ...res.user, ...res.profile });
        } else {
             res = await axiosClient.get(`/users/${targetUserId}`);
             // res.profile and res.user (added in backend)
             setProfileUser({ ...res.user, ...res.profile });
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
        message.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [targetUserId, isOwnProfile]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!targetUserId) return;
      setPostsLoading(true);
      try {
        const res = await axiosClient.get(`/posts?userId=${targetUserId}`);
        // Backend returns an array of posts directly
        setPosts(Array.isArray(res) ? res : []);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      } finally {
        setPostsLoading(false);
      }
    };

    fetchPosts();
  }, [targetUserId]);

  const handleMessage = async () => {
    try {
      const res = await axiosClient.post('/chat/private', { userId: targetUserId });
      navigate('/messages', { state: { conversationId: res.conversation.id } });
    } catch (error) {
      console.error("Failed to start conversation", error);
      message.error("Failed to start conversation");
    }
  };

  const handleDeletePost = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handleEditProfile = () => {
    form.setFieldsValue({
      fullname: profileUser.fullname,
      des: profileUser.des,
      birthday: profileUser.birthday ? dayjs(profileUser.birthday) : null,
    });
    setIsEditModalVisible(true);
  };

  const handleUpdateProfile = async (values) => {
    try {
      const updatedData = {
        ...values,
        birthday: values.birthday ? values.birthday.format('YYYY-MM-DD') : null,
      };
      const res = await axiosClient.put('/users/me', updatedData);
      setProfileUser({ ...profileUser, ...res.profile });
      
      setIsEditModalVisible(false);
      message.success('Profile updated successfully');
    } catch (error) {
      console.error('Update profile error:', error);
      message.error('Failed to update profile');
    }
  };

  const handleAvatarChange = async (info) => {
    if (info.file.status === 'uploading') {
      setUploading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      setUploading(false);
    }
  };

  const customRequest = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await axiosClient.post('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfileUser({ ...profileUser, avatar_url: res.profile.avatar_url });
      // Update global user context
      if (currentUser) {
          const updatedUser = { ...currentUser, avatar_url: res.profile.avatar_url };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      onSuccess(res.body);
      message.success('Avatar updated successfully');
    } catch (err) {
      onError(err);
      message.error('Failed to upload avatar');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
  }

  if (!profileUser) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>User not found</div>;
  }

  const items = [
    {
      key: '1',
      label: <span style={{ padding: '0 20px' }}>Posts</span>,
      children: (
        <div>
            {postsLoading ? <Spin /> : posts.length > 0 ? (
                posts.map(post => <PostItem key={post.id} post={post} onDelete={handleDeletePost} />)
            ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>No posts yet</div>
            )}
        </div>
      ),
    },
    {
      key: '2',
      label: <span style={{ padding: '0 20px' }}>Media</span>,
      children: (
        <div style={{ padding: '20px' }}>
          {postsLoading ? <Spin /> : (
            <Row gutter={[16, 16]}>
              {posts.flatMap(p => p.media || p.PostMedia || []).length > 0 ? (
                posts.flatMap(p => p.media || p.PostMedia || []).map(media => (
                  <Col span={8} key={media.id}>
                    {media.type === 'image' ? (
                      <Image
                        src={media.media_url}
                        style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    ) : (
                      <video
                        src={media.media_url}
                        controls
                        style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    )}
                  </Col>
                ))
              ) : (
                <div style={{ width: '100%', textAlign: 'center', color: '#999' }}>No media shared yet</div>
              )}
            </Row>
          )}
        </div>
      ),
    },
    {
      key: '3',
      label: <span style={{ padding: '0 20px' }}>Likes</span>,
      children: <div style={{ padding: '20px', textAlign: 'center' }}>Liked posts coming soon</div>,
    },
  ];

  return (
    <div>
      {/* Header Section */}
      <Card 
        style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '24px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
        bodyStyle={{ padding: 0 }}
      >
        {/* Cover Image */}
        <div style={{ height: '200px', background: '#f0f2f5', position: 'relative' }}>
          <img 
            src={profileUser.cover_url || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"} 
            alt="Cover" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div style={{ padding: '0 24px 24px 24px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '-50px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <div style={{ position: 'relative' }}>
                <Avatar 
                    size={120} 
                    src={profileUser.avatar_url} 
                    style={{ border: '4px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                />
                {isOwnProfile && (
                    <Upload 
                        customRequest={customRequest} 
                        showUploadList={false} 
                        onChange={handleAvatarChange}
                    >
                        <Button 
                            shape="circle" 
                            icon={<EditOutlined />} 
                            size="small" 
                            style={{ position: 'absolute', bottom: '10px', right: '10px', border: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} 
                        />
                    </Upload>
                )}
              </div>
              <div style={{ marginLeft: '20px', marginBottom: '10px' }}>
                <Title level={3} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {profileUser.fullname || profileUser.username}
                  <CheckCircleFilled style={{ color: '#1890ff', fontSize: '20px' }} />
                </Title>
                <Text type="secondary">@{profileUser.username}</Text>
              </div>
            </div>
            {isOwnProfile ? (
                <Button icon={<EditOutlined />} onClick={handleEditProfile}>Edit Profile</Button>
            ) : (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button type="primary" style={{ backgroundColor: '#8b5cf6', borderColor: '#8b5cf6' }}>Follow</Button>
                    <Button icon={<MessageOutlined />} onClick={handleMessage}>Message</Button>
                </div>
            )}
          </div>

          <Paragraph style={{ maxWidth: '600px', marginBottom: '16px' }}>
            {profileUser.des || "No bio yet"}
          </Paragraph>

          <div style={{ display: 'flex', gap: '24px', color: '#6b7280', marginBottom: '24px', fontSize: '14px' }}>
            <span><CalendarOutlined /> Joined {new Date(profileUser.created_at || Date.now()).toLocaleDateString()}</span>
          </div>

          <div style={{ display: 'flex', gap: '24px' }}>
            <Text strong>{posts.length} <Text type="secondary" style={{ fontWeight: 'normal' }}>Posts</Text></Text>
            <Text strong>0 <Text type="secondary" style={{ fontWeight: 'normal' }}>Followers</Text></Text>
            <Text strong>0 <Text type="secondary" style={{ fontWeight: 'normal' }}>Following</Text></Text>
          </div>
        </div>
      </Card>

      {/* Tabs and Content */}
      <div style={{ background: '#fff', borderRadius: '16px', padding: '0 24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Tabs defaultActiveKey="1" items={items} size="large" tabBarStyle={{ marginBottom: '24px' }} />
      </div>

      {/* Edit Profile Modal */}
      <Modal
        title="Edit Profile"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateProfile}
        >
          <Form.Item name="fullname" label="Full Name">
            <Input />
          </Form.Item>
          <Form.Item name="des" label="Bio">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="birthday" label="Birthday">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button onClick={() => setIsEditModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">Save Changes</Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
