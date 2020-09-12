const Sequelize = require('sequelize');

module.exports = function (sequelize) {
  const user = sequelize.define('user', {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true,
    },
    address: {
      type: Sequelize.STRING,
      unique: true,
    },
    username: {
      type: Sequelize.STRING,
    },
    nonce: {
      type: Sequelize.INTEGER.UNSIGNED,
      defaultValue: () => Math.floor(Math.random() * 1000000)
    },
  },
    {
      timestamp: true
    });

  user.associate = function (models) {
    // this.hasMany(models.transaction);
  };

  user.upsert = (values, condition) => (
    user.findOne({ where: condition })
      .then((obj) => {
        if (obj) {
          return obj.update(values);
        }
        return user.create(values);
      })
  );

  return user;
};
