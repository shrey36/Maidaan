const express = require('express');
const router = express.Router();
const { getMyTeam, createTeam, addPlayerToTeam, removePlayerFromTeam } = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

router.get('/my', protect, getMyTeam);
router.post('/', protect, createTeam);
router.post('/:teamId/add-player/:playerId', protect, addPlayerToTeam);
router.delete('/:teamId/remove-player/:playerId', protect, removePlayerFromTeam);

module.exports = router;
