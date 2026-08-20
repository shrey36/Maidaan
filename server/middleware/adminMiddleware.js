const admin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    return next();
  } else {
    return res.status(403).json({ success: false, message: 'Access denied: Admin privileges required' });
  }
};

module.exports = { admin };
