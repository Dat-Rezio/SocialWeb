import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Avatar, Typography, Button, List, Badge, Spin } from 'antd';
import { PlusOutlined, CheckCircleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import PostItem from '../components/PostItem';
import { useAuth } from '../context/AuthContext';

const { Text, Title } = Typography;

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axiosClient.get('/posts');
        setPosts(Array.isArray(res) ? res : []);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Mock data for stories
  const stories = [
    { id: 1, name: 'Create Story', isCreate: true, img: user?.avatar_url },
    { id: 2, name: 'John Warren', img: 'https://randomuser.me/api/portraits/men/32.jpg', time: '3 hours ago' },
    { id: 3, name: 'Alice Smith', img: 'https://randomuser.me/api/portraits/women/44.jpg', time: '5 hours ago' },
    { id: 4, name: 'Bob Jones', img: 'https://randomuser.me/api/portraits/men/85.jpg', time: '5 hours ago' },
    { id: 5, name: 'Sarah Lee', img: 'https://randomuser.me/api/portraits/women/65.jpg', time: '6 hours ago' },
  ];

  // Mock data for recent messages
  const recentMessages = [
    { id: 1, name: 'Richard Hendricks', msg: 'I seen your profile', time: '3 hours ago', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { id: 2, name: 'John Warren', msg: 'This is a Samsung Tablet', time: '8 days ago', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { id: 3, name: 'Alexa James', msg: 'how are you', time: '15 days ago', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', unread: 1 },
  ];

  const handleDeletePost = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  return (
    <Row gutter={[24, 24]}>
      {/* Center Column: Stories + Feed */}
      <Col xs={24} lg={16}>
        {/* Stories Section */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginBottom: '24px', 
          overflowX: 'auto', 
          paddingBottom: '8px',
          scrollbarWidth: 'none' // Hide scrollbar for cleaner look
        }}>
          {stories.map((story) => (
            <div key={story.id} style={{ position: 'relative', minWidth: '110px', height: '160px', cursor: 'pointer' }}>
              <div style={{ 
                height: '100%', 
                borderRadius: '12px', 
                overflow: 'hidden', 
                position: 'relative',
                border: story.isCreate ? '1px dashed #d9d9d9' : 'none',
                background: story.isCreate ? '#fff' : `url(${story.img}) center/cover no-repeat`
              }}>
                {story.isCreate ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Button type="primary" shape="circle" icon={<PlusOutlined />} size="large" style={{ marginBottom: '8px', backgroundColor: '#8b5cf6', borderColor: '#8b5cf6' }} />
                    <Text strong>Create Story</Text>
                  </div>
                ) : (
                  <>
                    <div style={{ 
                      position: 'absolute', 
                      top: '10px', 
                      left: '10px', 
                      border: '2px solid #8b5cf6', 
                      borderRadius: '50%', 
                      padding: '2px',
                      background: 'white'
                    }}>
                      <Avatar src={story.img} size={32} />
                    </div>
                    <div style={{ 
                      position: 'absolute', 
                      bottom: '0', 
                      left: '0', 
                      width: '100%', 
                      padding: '8px', 
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' 
                    }}>
                      <Text style={{ color: 'white', fontSize: '12px', display: 'block' }}>{story.name}</Text>
                      <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '10px' }}>{story.time}</Text>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Feed Section */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}><Spin size="large" /></div>
        ) : (
          <div>
            {posts.length > 0 ? (
              posts.map(post => <PostItem key={post.id} post={post} onDelete={handleDeletePost} />)
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                <Text>No posts yet. Be the first to post!</Text>
                <br />
                <Button type="primary" style={{ marginTop: '16px' }} onClick={() => navigate('/create-post')}>
                  Create Post
                </Button>
              </div>
            )}
          </div>
        )}
      </Col>

      {/* Right Sidebar */}
      <Col xs={0} lg={8}>
        {/* Sponsored Card */}
        <Card 
          title="Sponsored" 
          bordered={false} 
          style={{ marginBottom: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
          headStyle={{ borderBottom: 'none', paddingBottom: 0 }}
        >
          <img 
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
            alt="Sponsored" 
            style={{ width: '100%', borderRadius: '8px', marginBottom: '12px' }} 
          />
          <Text strong style={{ display: 'block' }}>Email marketing</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Supercharge your marketing with a powerful, easy-to-use platform built for results.
          </Text>
        </Card>

        {/* Recent Messages */}
        <Card 
          title="Recent Messages" 
          bordered={false} 
          style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
          headStyle={{ borderBottom: 'none' }}
        >
          <List
            itemLayout="horizontal"
            dataSource={recentMessages}
            renderItem={(item) => (
              <List.Item style={{ padding: '12px 0', borderBottom: 'none', cursor: 'pointer' }}>
                <List.Item.Meta
                  avatar={<Avatar src={item.avatar} size={40} />}
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text strong style={{ fontSize: '14px' }}>{item.name}</Text>
                      <Text type="secondary" style={{ fontSize: '11px' }}>{item.time}</Text>
                    </div>
                  }
                  description={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text type="secondary" ellipsis style={{ maxWidth: '150px', fontSize: '12px' }}>{item.msg}</Text>
                      {item.unread && <Badge count={item.unread} style={{ backgroundColor: '#8b5cf6' }} />}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default Home;
