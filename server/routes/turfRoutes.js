const express = require('express');
const router = express.Router();
const { getTurfs, getTurfById, getTurfAvailability, createTurf, updateTurf, deleteTurf } = require('../controllers/turfController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.get('/', getTurfs);
router.get('/:id', getTurfById);
router.get('/:id/availability', getTurfAvailability);

router.post('/', protect, admin, createTurf);
router.put('/:id', protect, admin, updateTurf);
router.delete('/:id', protect, admin, deleteTurf);

module.exports = router;
