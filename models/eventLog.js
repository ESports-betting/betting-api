const Sequelize = require('sequelize');

module.exports = function (sequelize) {
  const eventLog = sequelize.define('eventLog', {
    id: {
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
  },
    {
      timestamp: true,
      tableName: 'event_logs',
    });

  eventLog.associate = function (models) {
    this.hasMany(models.eventLogParam);
  };

  eventLog.upsert = (values, condition) => (
    eventLog.findOne({ where: condition })
      .then((obj) => {
        if (obj) {
          return obj.update(values);
        }
        return eventLog.create(values);
      })
  );

  return eventLog;
};
