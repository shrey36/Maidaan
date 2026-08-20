const User = require('../models/User');

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const obj = user.toObject();
    obj.id = obj._id;
    obj.fullName = obj.name;
    return res.json(obj);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (req.body.fullName || req.body.name) user.name = req.body.fullName || req.body.name;
    if (req.body.phone) user.phone = req.body.phone;
    if (req.body.preferredSport) user.preferredSport = req.body.preferredSport;
    if (req.body.location) user.location = req.body.location;

    await user.save();

    const obj = user.toObject();
    obj.id = obj._id;
    obj.fullName = obj.name;
    delete obj.password;

    return res.json(obj);
  } catch (error) {
    next(error);
  }
};

const getAllUsersAdmin = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    const formatted = users.map(u => {
      const obj = u.toObject();
      obj.id = obj._id;
      obj.fullName = obj.name;
      return obj;
    });
    return res.json(formatted);
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, getAllUsersAdmin };
