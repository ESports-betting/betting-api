module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('settings', {
      id: {
        primaryKey: true,
        type: Sequelize.STRING,
      },
      data: {
        type: Sequelize.JSON
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
    return queryInterface.dropTable('settings');
  }
};
