const httpStatus = require('http-status');
const ethereumAddress = require('ethereum-address');
const config = require('../config');
const models = require('../models');
const { web3 } = require("../modules/crypto");
const logger = require('../modules/logger');
const { errorResponse, reducedAddressData, reducedErrorMessage } = require('../modules/utils');

exports.createTransaction = async (req, res) => {
  try {
    const reqFields = ['txHash', 'type'];
    reqFields.forEach(reqField => {
      if (!req.body[reqField]) {
        logger.error(`createTransaction: ${reqField} field is required`);
        return errorResponse(res, `${reqField} field is required`);
      }
    });
    if (!['BetPlayer', 'PaymentSent'].includes(req.body.type)) {
      logger.error(`createTransaction: type field is required type=${req.body.type}`);
      return errorResponse(res, `Type field is invalid`);
    }

    const { txHash, type, amount, address } = req.body;
    const newTx = await models.transaction.create({ txHash, type, amount, address });
    if (!newTx) {
      logger.error(`createTransaction: failed to create Trx`);
      return errorResponse(res, 'Failed to create Transaction');
    }

    return res.status(httpStatus.OK).json({ status: true });
  } catch (err) {
    logger.error(`createTransaction: ${String(err)}`);
    return errorResponse(res, reducedErrorMessage(err));
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const where = {};
    where.address = req.query.address.toLowerCase();
    const { count, rows } = await models.transaction.findAndCountAll({ where, order: [['createdAt', 'DESC']] });
    return res.status(httpStatus.OK).json({ status: true, data: { total: count, result: rows } });
  } catch (err) {
    logger.error(`getTransactions: ${String(err)}`);
    return errorResponse(res, reducedErrorMessage(err));
  }
};
