const Sequelize = require('sequelize');

module.exports = function (sequelize) {
  const eventLogParam = sequelize.define('eventLogParam', {
    id: {
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
  },
    {
      timestamp: true,
      tableName: 'event_log_params',
    });

  eventLogParam.upsert = (values, condition) => (
    eventLogParam.findOne({ where: condition })
      .then((obj) => {
        if (obj) {
          return obj.update(values);
        }
        return eventLogParam.create(values);
      })
  );

  eventLogParam.associate = function (models) {
    this.belongsTo(models.eventLog, {
      foreignKey: {
        name: 'eventLogId',
        allowNull: true
      },
      onDelete: 'SET NULL'
    });
  };
  return eventLogParam;
};
