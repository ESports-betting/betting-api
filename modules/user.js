/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
const _ = require('lodash');
const Sequelize = require('sequelize');

const BigNumber = require('bignumber.js');
const Tx = require('ethereumjs-tx').Transaction;
const moment = require('moment');
const models = require('../models');

const config = require('../config');
const { compare } = require('bcrypt-nodejs');

exports.getUserStakeAmount = async (address, isAvailable = false) => {
  try {
    let minusMinutes = 0;
    if (isAvailable) {
      minusMinutes = config.lockPeriodMinutes;
    }
    const compareAt = moment().subtract(minusMinutes, 'minutes').utc(true).format('YYYY-MM-DD HH:mm:ss');

    // stake transactions
    const stakeTransactions = await models.transaction.findAll({
      where: {
        type: 'Stake',
        status: 'COMPLETED',
        address,
        createdAt: {
          $lte: compareAt
        }
      }
    });

    // withdraw transactions
    const withdrawTransactions = await models.transaction.findAll({
      where: {
        type: 'Withdraw',
        status: 'COMPLETED',
        address,
        createdAt: {
          $lte: compareAt
        }
      }
    });

    // calc total stake amount so far
    const totalStakeAmount = stakeTransactions.length > 0
      ? stakeTransactions.reduce((a, curVal) => new BigNumber(a).plus(curVal.amount), new BigNumber(0)) : new BigNumber(0);
    // console.log('totalStakeAmount : ', totalStakeAmount.toString());
    let stakedAmount = totalStakeAmount;

    // calc total withdraw amount so far
    const totalWithdrawAmount = withdrawTransactions.length > 0
      ? withdrawTransactions.reduce((a, curVal) => new BigNumber(a).plus(curVal.amount), new BigNumber(0)) : new BigNumber(0);
    stakedAmount = totalStakeAmount.minus(totalWithdrawAmount);


    return stakedAmount;
  } catch (err) {
    console.log('getUserEligibleStack : ', err);
    return err;
  }
};