const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const ethUtil = require('ethereumjs-util');

const config = require('../config');
const models = require('../models');
const { web3 } = require("../modules/crypto");
const logger = require('../modules/logger');
const userModule = require('../modules/user');
const { errorResponse, reducedAddressData, reducedErrorMessage } = require('../modules/utils');

exports.getNonce = async (req, res) => {
  try {
    const { address } = req.query;

    const user = await models.user.findOne({
      where: { address }
    });
    let nonce = 0;
    if (user) { nonce = user.nonce; }
    return res.status(httpStatus.OK).json({ status: true, data: { nonce } });
  } catch (err) {
    logger.error(`address nonce: ${String(err)}`);
    return errorResponse(res, reducedErrorMessage(err));
  }
};

exports.register = async (req, res) => {
  try {
    const { address } = req.body;

    let user = await models.user.findOne({
      where: { address }
    });
    if (user) {
      logger.error(`address register: existing address`);
      return errorResponse(res, 'address already existing');
    }

    user = await models.user.create({
      address
    });

    return res.status(httpStatus.OK).json({ status: true, data: user.get() });
  } catch (err) {
    logger.error(`address register: ${String(err)}`);
    return errorResponse(res, reducedErrorMessage(err));
  }
};

exports.verify = async (req, res) => {
  try {
    const { address, signature } = req.body;
    if (!signature) {
      logger.error(`address verify: missing signature`);
      return errorResponse(res, 'signature field is missing');
    }

    const user = await models.user.findOne({
      where: { address }
    });

    const msg = web3.utils.utf8ToHex(`I am signing my one-time nonce: ${user.nonce}`);
    // We now are in possession of msg, address and signature. We
    // can perform an elliptic curve signature verification with ecrecover
    const msgBuffer = ethUtil.toBuffer(msg);
    const msgHash = ethUtil.hashPersonalMessage(msgBuffer);
    const signatureBuffer = ethUtil.toBuffer(signature);
    const signatureParams = ethUtil.fromRpcSig(signatureBuffer);
    const publicKey = ethUtil.ecrecover(msgHash, signatureParams.v, signatureParams.r, signatureParams.s);
    const addressBuffer = ethUtil.publicToAddress(publicKey);
    const publicAddress = ethUtil.bufferToHex(addressBuffer);
    // The signature verification is successful if the address found with
    // ecrecover matches the initial address
    if (publicAddress.toLowerCase() === address.toLowerCase()) {
      user.nonce = Math.floor(Math.random() * 1000000);
      await user.save();

      const token = jwt.sign({ id: user.id }, config.app.secret);
      return res.status(httpStatus.OK).json({ status: true, data: { user: reducedAddressData(user.get()), token } });
    }
    logger.error(`address verify: invalid signature [${signature}]`);
    return errorResponse(res, 'invalid signature');
  } catch (err) {
    logger.error(`address register: ${String(err)}`);
    return errorResponse(res, reducedErrorMessage(err));
  }
};

exports.blockNumber = async (req, res) => {
  const blockNumber = await web3.eth.getBlockNumber();
  console.log('blockNumber :>> ', blockNumber);
  return res.status(httpStatus.OK).json({ status: true, data: { blockNumber } });
}

exports.getUserDetails = async (req, res, next) => {
  try {
    const address = req.address;

    const totalStake = await userModule.getUserStakeAmount(address);
    const totalStakeAmount = totalStake.toFixed(0);
    const availableStake = await userModule.getUserStakeAmount(address, true);
    const availableStakeAmount = availableStake.toFixed(0);

    const data = {
      totalStaked: totalStakeAmount,
      availableStaked: availableStakeAmount,
    };

    return res.status(200).json({ status: true, data });
  } catch (err) {
    return errorResponse(res, reducedErrorMessage(err));
  }
};
