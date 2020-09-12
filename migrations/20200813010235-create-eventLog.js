module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('event_logs', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },
      txHash: {
        type: Sequelize.STRING,
      },
      event: {
        type: Sequelize.STRING,
      },
      logId: {
        type: Sequelize.STRING
      },
      logIndex: {
        type: Sequelize.INTEGER
      },
      txIndex: {
        type: Sequelize.INTEGER
      },
      removed: {
        type: Sequelize.BOOLEAN
      },
      blockNumber: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('event_logs');
  }
};
