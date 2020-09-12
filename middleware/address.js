const httpStatus = require('http-status');
const ethereumAddress = require('ethereum-address');
const models = require('../models');
const logger = require('../modules/logger');
const { errorResponse, reducedErrorMessage } = require('../modules/utils');

exports.loginAddress = async (req, res, next) => {
  try {
    let address = null;
    if (req.method === "GET" && req.query.address) {
      address = req.query.address;
    } else if (req.method === "POST" && req.body.address) {
      address = req.body.address;
    }

    if (!address) {
      logger.error(`loginAddress : missing address [${address}]`);
      return errorResponse(res, 'Address field is missing');
    }
    address = address.toLowerCase();
    if (!ethereumAddress.isAddress(address)) {
      logger.error(`loginAddress : invalid address [${address}]`);
      return errorResponse(res, 'Ethereum address is invalid');
    }
    const [user] = await models.user.findOrCreate({ where: { address } });
    req.user = user.get({ plain: true });

    return next();
  } catch (err) {
    logger.error(`loginAddress (): ${String(err)}`);
    return errorResponse(res, reducedErrorMessage(err));
  }
};

exports.checkAddress = async (req, res, next) => {
  try {
    let address = null;
    if (req.method === "GET" && req.query.address) {
      address = req.query.address;
    } else if (req.method === "POST" && req.body.address) {
      address = req.body.address;
    }

    if (!address) {
      logger.error(`loginAddress : missing address [${address}]`);
      return errorResponse(res, 'Address field is missing');
    }
    address = address.toLowerCase();
    if (!ethereumAddress.isAddress(address)) {
      logger.error(`loginAddress : missing address [${address}]`);
      return errorResponse(res, 'Ethereum address is invalid');
    }
    req.address = address;

    return next();
  } catch (err) {
    logger.error(`loginAddress : ${String(err)}`);
    return errorResponse(res, reducedErrorMessage(err));
  }
};