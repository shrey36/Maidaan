const express = require('express');
const router = express.Router();
const { getAuctionState } = require('../controllers/auctionController');

router.get('/', getAuctionState);

module.exports = router;
