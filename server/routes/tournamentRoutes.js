const express = require('express');
const router = express.Router();
const { getTournaments, getTournamentById, createTournament } = require('../controllers/tournamentController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.get('/', getTournaments);
router.get('/:id', getTournamentById);
router.post('/', protect, admin, createTournament);

module.exports = router;
