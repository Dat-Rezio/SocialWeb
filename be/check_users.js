
require('dotenv').config();
const { User } = require('./models');

async function checkUsers() {
  try {
    const users = await User.findAll();
    console.log('Users found:', users.length);
    users.forEach(u => console.log(`- ${u.username} (${u.email})`));
  } catch (error) {
    console.error('Error checking users:', error);
  }
}

checkUsers();
