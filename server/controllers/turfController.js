const Turf = require('../models/Turf');
const Booking = require('../models/Booking');

const getTurfs = async (req, res, next) => {
  try {
    const { query, sport, location, maxPrice, minRating, turfType } = req.query;
    let filter = {};

    if (query) {
      const regex = new RegExp(query, 'i');
      filter.$or = [
        { name: regex },
        { location: regex },
        { sports: regex }
      ];
    }

    if (sport) {
      filter.sports = { $elemMatch: { $regex: sport, $options: 'i' } };
    }

    if (location) {
      filter.location = new RegExp(location, 'i');
    }

    if (maxPrice) {
      filter.pricePerHour = { $lte: parseFloat(maxPrice) };
    }

    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating) };
    }

    if (turfType) {
      filter.turfType = new RegExp(turfType, 'i');
    }

    const turfs = await Turf.find(filter).sort({ rating: -1 });
    
    // Format response to include sports as string for backward frontend compatibility if needed
    const formatted = turfs.map(t => {
      const obj = t.toObject();
      obj.id = obj._id;
      if (Array.isArray(obj.sports)) {
        obj.sports = obj.sports.join(', ');
      }
      if (Array.isArray(obj.facilities)) {
        obj.facilities = obj.facilities.join(', ');
      }
      return obj;
    });

    return res.json(formatted);
  } catch (error) {
    next(error);
  }
};

const getTurfById = async (req, res, next) => {
  try {
    const turf = await Turf.findById(req.params.id);
    if (!turf) {
      return res.status(404).json({ success: false, message: 'Turf not found' });
    }
    const obj = turf.toObject();
    obj.id = obj._id;
    if (Array.isArray(obj.sports)) {
      obj.sports = obj.sports.join(', ');
    }
    if (Array.isArray(obj.facilities)) {
      obj.facilities = obj.facilities.join(', ');
    }
    return res.json(obj);
  } catch (error) {
    next(error);
  }
};

const getTurfAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date } = req.query; // YYYY-MM-DD format

    if (!date) {
      return res.status(400).json({ success: false, message: 'Date parameter is required' });
    }

    const turf = await Turf.findById(id);
    if (!turf) {
      return res.status(404).json({ success: false, message: 'Turf not found' });
    }

    // Find active non-cancelled bookings for this turf on this date
    const existingBookings = await Booking.find({
      turf: id,
      date: date,
      status: { $ne: 'CANCELLED' }
    });

    const bookedTimes = new Set(existingBookings.map(b => b.startTime));

    const slots = [];
    const todayStr = new Date().toISOString().split('T')[0];
    const currentHour = new Date().getHours();

    for (let hour = 6; hour < 23; hour++) {
      const startHourStr = hour > 12 ? `${hour - 12}`.padStart(2, '0') : `${hour}`.padStart(2, '0');
      const startAmpm = hour >= 12 ? 'PM' : 'AM';
      const endHour = hour + 1;
      const endHourStr = endHour > 12 ? `${endHour - 12}`.padStart(2, '0') : `${endHour}`.padStart(2, '0');
      const endAmpm = endHour >= 12 ? 'PM' : 'AM';

      const startTime = `${startHourStr}:00 ${startAmpm}`;
      const endTime = `${endHourStr}:00 ${endAmpm}`;
      const timeSlot = `${startTime} - ${endTime}`;

      let isAvailable = !bookedTimes.has(startTime);

      // Block past hours if date is today
      if (date === todayStr && hour <= currentHour) {
        isAvailable = false;
      }

      slots.push({
        timeSlot,
        startTime,
        endTime,
        available: isAvailable,
        price: turf.pricePerHour
      });
    }

    return res.json(slots);
  } catch (error) {
    next(error);
  }
};

const createTurf = async (req, res, next) => {
  try {
    const sportsArr = typeof req.body.sports === 'string' ? req.body.sports.split(',').map(s => s.trim()) : req.body.sports;
    const facilitiesArr = typeof req.body.facilities === 'string' ? req.body.facilities.split(',').map(f => f.trim()) : req.body.facilities;

    const turf = await Turf.create({
      ...req.body,
      sports: sportsArr,
      facilities: facilitiesArr
    });

    const obj = turf.toObject();
    obj.id = obj._id;
    return res.status(201).json(obj);
  } catch (error) {
    next(error);
  }
};

const updateTurf = async (req, res, next) => {
  try {
    const turf = await Turf.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!turf) {
      return res.status(404).json({ success: false, message: 'Turf not found' });
    }
    const obj = turf.toObject();
    obj.id = obj._id;
    return res.json(obj);
  } catch (error) {
    next(error);
  }
};

const deleteTurf = async (req, res, next) => {
  try {
    const turf = await Turf.findByIdAndDelete(req.params.id);
    if (!turf) {
      return res.status(404).json({ success: false, message: 'Turf not found' });
    }
    return res.json({ success: true, message: 'Turf deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTurfs,
  getTurfById,
  getTurfAvailability,
  createTurf,
  updateTurf,
  deleteTurf
};
