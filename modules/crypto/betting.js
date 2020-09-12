const BigNumber = require('bignumber.js');
const { bettingContract } = require('./contracts');
const { callMethod, sendTransaction } = require('./utils');
const config = require('../../config');

const decimalBN = new BigNumber(10).pow(18);

// Getters
exports.getBettingStatus = async () => {
  const result = await callMethod(bettingContract.contract.methods['betStatus'], []);
  return Number(result);
}

exports.getPotAmount = async () => {
  const result = await callMethod(bettingContract.contract.methods['pot'], []);
  const amount = new BigNumber(parseInt(result)).dividedBy(decimalBN);
  return Number(amount);
}

exports.getMinBetAmount = async () => {
  const result = await callMethod(bettingContract.contract.methods['minimumBet'], []);
  const amount = new BigNumber(parseInt(result)).dividedBy(decimalBN);
  return Number(amount);
}
