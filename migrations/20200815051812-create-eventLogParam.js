module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('event_log_params', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },
      field: {
        type: Sequelize.STRING,
      },
      value: {
        type: Sequelize.STRING,
      },
      eventLogId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'event_logs',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
    return queryInterface.dropTable('event_log_params');
  }
};
