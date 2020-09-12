const express = require('express');

const router = express.Router();

const { loginAddress, checkAddress } = require('../middleware/address');
const transaction = require('../controllers/transaction');

router.post('/create', loginAddress, transaction.createTransaction);
router.get('/retrieve', checkAddress, transaction.getTransactions);

module.exports = router;
