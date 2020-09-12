const web3 = require('./web3');
const constracts = require('./contracts');
const utils = require('./utils');
const betting = require('./betting');
const token = require('./token');

module.exports = {
  ...web3,
  ...constracts,
  utils,
  betting,
  token
};
