const Booking = require('../models/Booking');
const Turf = require('../models/Turf');

const createBooking = async (req, res, next) => {
  try {
    const { turfId, bookingDate, date, startTime, endTime } = req.body;
    const targetTurfId = turfId || req.body.turf;
    const targetDate = bookingDate || date;

    if (!targetTurfId || !targetDate || !startTime || !endTime) {
      return res.status(400).json({ success: false, message: 'Turf ID, date, startTime, and endTime are required' });
    }

    const turf = await Turf.findById(targetTurfId);
    if (!turf) {
      return res.status(404).json({ success: false, message: 'Turf not found' });
    }

    // DOUBLE-BOOKING PREVENTION CHECK IN MONGODB
    const existingBooking = await Booking.findOne({
      turf: targetTurfId,
      date: targetDate,
      startTime: startTime,
      status: { $ne: 'CANCELLED' }
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: `The selected time slot (${startTime}) is no longer available. Please select another time.`
      });
    }

    const dateFormatted = targetDate.replace(/-/g, '');
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `MAA-${dateFormatted}-${randomCode}`;

    const amount = turf.pricePerHour;

    const booking = await Booking.create({
      user: req.user._id,
      turf: targetTurfId,
      date: targetDate,
      startTime,
      endTime,
      amount,
      status: 'CONFIRMED',
      paymentMethod: 'PAY_AT_VENUE',
      paymentStatus: 'PAY_AT_VENUE',
      bookingId
    });

    const populated = await Booking.findById(booking._id).populate('turf user', '-password');
    const obj = populated.toObject();
    obj.id = obj._id;
    obj.bookingCode = obj.bookingId;
    obj.bookingDate = obj.date;
    if (obj.turf) obj.turf.id = obj.turf._id;
    if (obj.user) obj.user.id = obj.user._id;

    return res.status(201).json(obj);
  } catch (error) {
    next(error);
  }
};

const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('turf')
      .sort({ createdAt: -1 });

    const formatted = bookings.map(b => {
      const obj = b.toObject();
      obj.id = obj._id;
      obj.bookingCode = obj.bookingId;
      obj.bookingDate = obj.date;
      if (obj.turf) obj.turf.id = obj.turf._id;
      return obj;
    });

    return res.json(formatted);
  } catch (error) {
    next(error);
  }
};

const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('turf user', '-password');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this booking' });
    }

    const obj = booking.toObject();
    obj.id = obj._id;
    obj.bookingCode = obj.bookingId;
    obj.bookingDate = obj.date;
    return res.json(obj);
  } catch (error) {
    next(error);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
    }

    booking.status = 'CANCELLED';
    await booking.save();

    const updated = await Booking.findById(booking._id).populate('turf');
    const obj = updated.toObject();
    obj.id = obj._id;
    obj.bookingCode = obj.bookingId;
    obj.bookingDate = obj.date;

    return res.json(obj);
  } catch (error) {
    next(error);
  }
};

const getAllBookingsAdmin = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('turf user', '-password')
      .sort({ createdAt: -1 });

    const formatted = bookings.map(b => {
      const obj = b.toObject();
      obj.id = obj._id;
      obj.bookingCode = obj.bookingId;
      obj.bookingDate = obj.date;
      if (obj.turf) obj.turf.id = obj.turf._id;
      if (obj.user) {
        obj.user.id = obj.user._id;
        obj.user.fullName = obj.user.name;
      }
      return obj;
    });

    return res.json(formatted);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getAllBookingsAdmin
};
