module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('transactions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },
      txHash: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.ENUM,
        values: ['BetPlayer', 'PaymentSent'],
        defaultValue: 'BetPlayer'
      },
      status: {
        type: Sequelize.ENUM,
        values: ['PENDING', 'FAILED', 'COMPLETED'],
        defaultValue: 'PENDING'
      },
      address: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('transactions');
  }
};
