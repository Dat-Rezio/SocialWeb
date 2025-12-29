const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'role', {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user',
      allowNull: false
    });
    console.log('✅ Added role column to users table');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'role');
    console.log('✅ Removed role column from users table');
  }
};
