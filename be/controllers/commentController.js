
const { Comment, Notification, User, Profile, Post } = require('../models');

const createComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { post_id, content } = req.body;
    if (!post_id || !content) return res.status(400).json({ message: 'Thiếu dữ liệu' });

    // Find post to get owner
    const post = await Post.findByPk(post_id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = await Comment.create({ post_id, user_id: userId, content, created_at: new Date() });
    
    // Create notification if not commenting on own post
    if (post.user_id !== userId) {
      const notif = await Notification.create({ 
        receiver_id: post.user_id, 
        sender_id: userId, 
        type: 'comment', 
        content: 'đã bình luận về bài viết của bạn', 
        created_at: new Date(),
        metadata: { post_id, comment_id: comment.id }
      });

      // Emit socket event
      const io = req.app.get('socketio');
      if (io) {
        // Fetch sender profile
        const senderProfile = await Profile.findByPk(userId);
        
        io.to(`user_${post.user_id}`).emit('new_notification', {
          id: notif.id,
          type: 'comment',
          content: notif.content,
          sender: {
            id: userId,
            username: req.user.username, 
            Profile: senderProfile
          },
          created_at: notif.created_at,
          metadata: notif.metadata
        });
      }
    }

    const fullComment = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'username'],
          include: [{ model: Profile }]
        }
      ]
    });

    res.json({ comment: fullComment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const deleteComment = async (req, res) => {
  const userId = req.user.id;
  const comment = await Comment.findByPk(req.params.id);
  if (!comment) return res.status(404).json({ message: 'Không tìm thấy' });
  if (comment.user_id !== userId) return res.status(403).json({ message: 'Không có quyền' });
  await comment.destroy();
  res.json({ message: 'Xóa thành công' });
};

module.exports = { createComment, deleteComment };
