const { sequelize, Post, User } = require('./models');

async function check() {
  try {
    const post = await Post.findByPk(5);
    if (!post) {
      console.log('Post 5 not found');
    } else {
      console.log('Post 5:', post.toJSON());
      console.log('Post 5 user_id:', post.user_id, typeof post.user_id);
      
      const user = await User.findByPk(post.user_id);
      if (user) {
        console.log('Owner User:', user.toJSON());
        console.log('Owner User ID:', user.id, typeof user.id);
      } else {
        console.log('Owner User not found');
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    await sequelize.close();
  }
}

check();
