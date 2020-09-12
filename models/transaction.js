const Sequelize = require('sequelize');

module.exports = function (sequelize) {
  const transaction = sequelize.define('transaction', {
    id: {
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
    },
    address: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.ENUM,
      values: ['PENDING', 'FAILED', 'COMPLETED'],
      defaultValue: 'PENDING'
    },
  },
    {
      timestamp: true
    });

  transaction.upsert = (values, condition) => (
    transaction.findOne({ where: condition })
      .then((obj) => {
        if (obj) {
          return obj.update(values);
        }
        return transaction.create(values);
      })
  );

  return transaction;
};
