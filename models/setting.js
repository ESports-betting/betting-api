const Sequelize = require('sequelize');

module.exports = function (sequelize) {
  const config = sequelize.define('setting', {
    id: {
      primaryKey: true,
      type: Sequelize.STRING,
      unique: true,
    },
    data: {
      type: Sequelize.JSON,
    },
  },
    {
      timestamp: true
    });

  config.upsert = (values, condition) => (
    config.findOne({ where: condition })
      .then((obj) => {
        if (obj) {
          return obj.update(values);
        }
        return config.create(values);
      })
  );

  return config;
};
