// const passport = require('passport');
const addressRouter = require('./address');
const authRouter = require('./auth');
const transactionRouter = require('./transaction');

const monitorRouter = require('./monitor');


module.exports = function (app) {
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/monitor', monitorRouter);
  app.use('/api/v1/address', addressRouter);
  app.use('/api/v1/transaction', transactionRouter);
  // TODO -- use this middleware for authentication
  // passport.authenticate('jwt', { session: false })
};
