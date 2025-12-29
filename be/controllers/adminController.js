const { User, Post, Like, Comment, Profile } = require('../models');
const { Op } = require('sequelize');

// Get recent login activities (based on last time users accessed)
const getLoginActivity = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    
    // Get users ordered by created_at (assuming this is their registration/first login)
    // In a real system, you'd track login timestamps separately
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'created_at', 'role'],
      include: [{
        model: Profile,
        attributes: ['fullname', 'avatar_url']
      }],
      order: [['created_at', 'DESC']],
      limit: limit
    });

    res.json({
      message: 'Login activity retrieved',
      total: users.length,
      users: users.map(u => ({
        id: u.id,
        username: u.username,
        email: u.email,
        fullname: u.Profile?.fullname || 'N/A',
        avatar_url: u.Profile?.avatar_url,
        role: u.role,
        created_at: u.created_at
      }))
    });
  } catch (err) {
    console.error('[ADMIN] Error getting login activity:', err);
    res.status(500).json({ message: 'Lỗi lấy thông tin đăng nhập', error: err.message });
  }
};

// Get all likes on posts
const getPostLikes = async (req, res) => {
  try {
    const postId = req.query.postId;
    const limit = parseInt(req.query.limit) || 50;

    let whereClause = {};
    if (postId) {
      whereClause.post_id = postId;
    }

    const likes = await Like.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'email', 'role'],
          include: [{
            model: Profile,
            attributes: ['fullname', 'avatar_url']
          }]
        },
        {
          model: Post,
          attributes: ['id', 'content', 'created_at']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: limit
    });

    res.json({
      message: 'Post likes retrieved',
      total: likes.length,
      likes: likes.map(like => ({
        id: like.id,
        post_id: like.post_id,
        post_content: like.Post?.content,
        post_created_at: like.Post?.created_at,
        user_id: like.user_id,
        username: like.User?.username,
        email: like.User?.email,
        fullname: like.User?.Profile?.fullname || 'N/A',
        avatar_url: like.User?.Profile?.avatar_url,
        role: like.User?.role,
        liked_at: like.created_at
      }))
    });
  } catch (err) {
    console.error('[ADMIN] Error getting post likes:', err);
    res.status(500).json({ message: 'Lỗi lấy thông tin like', error: err.message });
  }
};

// Get all comments on posts
const getPostComments = async (req, res) => {
  try {
    const postId = req.query.postId;
    const limit = parseInt(req.query.limit) || 50;

    let whereClause = {};
    if (postId) {
      whereClause.post_id = postId;
    }

    const comments = await Comment.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'email', 'role'],
          include: [{
            model: Profile,
            attributes: ['fullname', 'avatar_url']
          }]
        },
        {
          model: Post,
          attributes: ['id', 'content', 'created_at']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: limit
    });

    res.json({
      message: 'Post comments retrieved',
      total: comments.length,
      comments: comments.map(comment => ({
        id: comment.id,
        post_id: comment.post_id,
        post_content: comment.Post?.content,
        post_created_at: comment.Post?.created_at,
        user_id: comment.user_id,
        username: comment.User?.username,
        email: comment.User?.email,
        fullname: comment.User?.Profile?.fullname || 'N/A',
        avatar_url: comment.User?.Profile?.avatar_url,
        role: comment.User?.role,
        comment_content: comment.content,
        commented_at: comment.created_at
      }))
    });
  } catch (err) {
    console.error('[ADMIN] Error getting post comments:', err);
    res.status(500).json({ message: 'Lỗi lấy thông tin comment', error: err.message });
  }
};

// Get summary statistics
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalPosts = await Post.count();
    const totalLikes = await Like.count();
    const totalComments = await Comment.count();

    const usersByRole = await User.count({
      group: ['role']
    });

    res.json({
      message: 'Admin statistics retrieved',
      stats: {
        total_users: totalUsers,
        total_posts: totalPosts,
        total_likes: totalLikes,
        total_comments: totalComments,
        users_by_role: usersByRole
      }
    });
  } catch (err) {
    console.error('[ADMIN] Error getting stats:', err);
    res.status(500).json({ message: 'Lỗi lấy thống kê', error: err.message });
  }
};

module.exports = { getLoginActivity, getPostLikes, getPostComments, getAdminStats };
