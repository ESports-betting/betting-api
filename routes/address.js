const express = require('express');

const router = express.Router();

const { checkAddress } = require('../middleware/address');
const address = require('../controllers/address');

router.get('/nonce', checkAddress, address.getNonce);
router.post('/register', checkAddress, address.register);
router.post('/verify', checkAddress, address.verify);

router.get('/blocknumber', address.blockNumber);

router.get('/detail', checkAddress, address.getUserDetails);

module.exports = router;
