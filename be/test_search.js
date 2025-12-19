const { sequelize, User, Profile, Friendship } = require('./models');
const { Op } = require('sequelize');

async function testSearch() {
  try {
    const currentUserId = 2; // Admin is ID 2
    const q = 'hehe'; // Test search

    console.log('Testing search with q:', q);

    let whereClause = {
      id: { [Op.ne]: currentUserId }
    };

    if (q && q.trim() !== '') {
      whereClause[Op.or] = [
        { username: { [Op.like]: `%${q}%` } },
        { '$Profile.fullname$': { [Op.like]: `%${q}%` } }
      ];
    }

    const users = await User.findAll({
      where: whereClause,
      include: [{
        model: Profile,
        required: false
      }],
      subQuery: false,
      limit: 20,
      order: [['created_at', 'DESC']]
    });

    console.log(`Found ${users.length} users.`);
    users.forEach(u => {
        console.log(`- ${u.username} (${u.Profile?.fullname})`);
    });

  } catch (error) {
    console.error('Search Error:', error);
  } finally {
    await sequelize.close();
  }
}

testSearch();
