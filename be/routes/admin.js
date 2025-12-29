const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const { 
  getLoginActivity, 
  getPostLikes, 
  getPostComments,
  getAdminStats 
} = require('../controllers/adminController');

// All admin routes require authentication
// Frontend will check user.role === 'admin' to allow access
router.get('/login-activity', authMiddleware, getLoginActivity);
router.get('/post-likes', authMiddleware, getPostLikes);
router.get('/post-comments', authMiddleware, getPostComments);
router.get('/stats', authMiddleware, getAdminStats);

module.exports = router;
