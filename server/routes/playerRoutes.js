const express = require('express');
const router = express.Router();
const { getPlayers, getPlayerById, createPlayer } = require('../controllers/playerController');

router.get('/', getPlayers);
router.get('/:id', getPlayerById);
router.post('/', createPlayer);

module.exports = router;
