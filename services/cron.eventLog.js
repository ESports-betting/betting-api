const BigNumber = require('bignumber.js');
const { CronJob } = require('cron');
const ethereumAddress = require('ethereum-address');
const models = require('../models');
const config = require('../config');
const logger = require('../modules/logger');
const { bettingContract, web3 } = require('../modules/crypto');

let passed = true;
const EVENT_FROM_BLOCK = 'event_from_block';

async function getPastEvents() {
  passed = false;
  const decimalBN = new BigNumber(10).pow(config.decimals);
  // logger.info('[CRON][eventLog] triggered');

  try {
    let fromBlockObj = await models.setting.findByPk(EVENT_FROM_BLOCK);
    if (!fromBlockObj) {
      fromBlockObj = await models.setting.create({
        id: EVENT_FROM_BLOCK,
        data: parseInt(config.eventFromBlock)
      });
    }
    const fromBlock = fromBlockObj.data;

    let toBlock = await web3.eth.getBlockNumber();
    toBlock -= 1; // minus 1 to avoid missing events

    if (fromBlock < toBlock) { // need to get past events      
      const logs = await bettingContract.contract.getPastEvents('allEvents', {
        fromBlock,
        toBlock,
        // toBlock: 'latest'
      });

      // TODO -- async optimization should be done
      for (let i = 0; i < logs.length; i++) {
        const log = logs[i];

        // save eventLog to db
        const [eventLogObj, created] = await models.eventLog.findOrCreate({
          where: {
            txHash: log.transactionHash,
            txIndex: log.transactionIndex,
          },
          defaults: {
            blockNumber: log.blockNumber,
            event: log.event,
            logId: log.id,
            logIndex: log.logIndex,
            removed: log.removed,
          }
        });

        if (!created) {
          continue;
        }

        // save params to db
        const eventLogId = eventLogObj.id;
        const logValues = log.returnValues;
        await Promise.all(
          // skip number index keys
          Object.keys(logValues).filter(o => Number.isNaN(+o) || ((+o) < logValues.length / 2))
            .map(field => {
              models.eventLogParam.findOrCreate({
                where: {
                  field,
                  eventLogId,
                },
                defaults: {
                  value: logValues[field].toLowerCase()
                }
              })
            })
        );

        if (['BetPlayer', 'PaymentSent'].includes(eventLogObj.event)) {
          await models.transaction.upsert(
            {
              txHash: log.transactionHash,
              type: eventLogObj.event,
              status: 'COMPLETED',
              address: logValues._from.toLowerCase(),
              amount: logValues._amount,
            },
            {
              txHash: log.transactionHash,
              type: eventLogObj.event
            });
        }
      }

      // save last sync block to setting db
      await fromBlockObj.update({ data: toBlock });
    }
  } catch (err) {
    logger.error(`[CRON][eventLog] error: ${JSON.stringify(err, Object.getOwnPropertyNames(err))}`);
  }
  passed = true;
}

function start() {
  if (passed) {
    getPastEvents();
  }
}

module.exports = function () {
  logger.info('[CRON][eventLog] started ...');
  const job = new CronJob(config.cronEventLogInterval, start); // running per 10 secs
  job.start();
};
