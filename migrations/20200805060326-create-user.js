module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },
      address: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
        validate: { isLowercase: true }
      },
      username: {
        type: Sequelize.STRING,
      },
      nonce: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED,
        defaultValue: () => Math.floor(Math.random() * 1000000)
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  down(queryInterface/* , Sequelize */) {
    return queryInterface.dropTable('users');
  }
};
