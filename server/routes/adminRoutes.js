const express = require('express');
const router = express.Router();
const { createTurf, updateTurf, deleteTurf } = require('../controllers/turfController');
const { getAllBookingsAdmin } = require('../controllers/bookingController');
const { getAllUsersAdmin } = require('../controllers/userController');
const { createTournament } = require('../controllers/tournamentController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.use(protect);
router.use(admin);

router.post('/turfs', createTurf);
router.put('/turfs/:id', updateTurf);
router.delete('/turfs/:id', deleteTurf);

router.get('/bookings', getAllBookingsAdmin);
router.get('/users', getAllUsersAdmin);
router.post('/tournaments', createTournament);

module.exports = router;
