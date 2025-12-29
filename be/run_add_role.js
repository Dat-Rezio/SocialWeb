const sequelize = require('./config/database');
const { DataTypes } = require('sequelize');

async function addRoleColumn() {
  try {
    console.log('🔄 Bắt đầu thêm role column vào bảng users...');
    
    // Check if column already exists
    const tableDescription = await sequelize.getQueryInterface().describeTable('users');
    
    if (tableDescription.role) {
      console.log('✅ Role column đã tồn tại trong bảng users');
      return;
    }

    // Add role column
    await sequelize.getQueryInterface().addColumn('users', 'role', {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user',
      allowNull: false
    });

    console.log('✅ Thêm role column thành công!');
    console.log('✅ Tất cả users hiện tại sẽ có role = "user"');
    
  } catch (err) {
    console.error('❌ Lỗi:', err.message);
  } finally {
    await sequelize.close();
  }
}

addRoleColumn();
