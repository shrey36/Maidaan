const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const registerUser = async (req, res, next) => {
  try {
    const { fullName, name, email, phone, password, preferredSport, location } = req.body;
    const userName = (fullName || name || '').trim();
    const normalizedEmail = (email || '').trim().toLowerCase();
    const plainPassword = password || '';

    if (!userName) {
      return res.status(400).json({ success: false, message: 'Please enter your name.' });
    }
    if (!normalizedEmail) {
      return res.status(400).json({ success: false, message: 'Please enter your email.' });
    }
    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }
    if (!plainPassword) {
      return res.status(400).json({ success: false, message: 'Please enter a password.' });
    }
    if (plainPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
    }

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    // Password is hashed exactly once by the User model pre-save hook
    const user = await User.create({
      name: userName,
      email: normalizedEmail,
      phone: phone || '',
      password: plainPassword,
      preferredSport: preferredSport || 'Football',
      location: location || 'Mapusa, Goa',
      role: 'USER'
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      token,
      id: user._id,
      fullName: user.name,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const normalizedEmail = (req.body.email || '').trim().toLowerCase();
    const plainPassword = req.body.password || '';

    if (!normalizedEmail || !plainPassword) {
      return res.status(400).json({ success: false, message: 'Please enter email and password.' });
    }

    // Compare entered password against the stored hash (never re-hash on login)
    const user = await User.findOne({ email: normalizedEmail });
    if (user && (await user.matchPassword(plainPassword))) {
      const token = generateToken(user._id);

      return res.json({
        token,
        id: user._id,
        fullName: user.name,
        name: user.name,
        email: user.email,
        role: user.role
      });
    }

    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ success: false, message: 'Unable to sign in right now. Please try again.' });
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password -resetPasswordToken -resetPasswordExpire');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.json({
      id: user._id,
      fullName: user.name,
      name: user.name,
      email: user.email,
      phone: user.phone,
      preferredSport: user.preferredSport,
      location: user.location,
      role: user.role,
      profileImage: user.profileImage
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Forgot password – generate a short-lived reset token.
 * Raw token is never stored; only its hash is saved.
 * In development (no email service), the reset URL is logged to the console.
 */
const forgotPassword = async (req, res, next) => {
  try {
    const normalizedEmail = (req.body.email || '').trim().toLowerCase();

    if (!normalizedEmail) {
      return res.status(400).json({ success: false, message: 'Please enter your email address.' });
    }

    // Always return the same generic message to avoid email enumeration
    const genericMessage = 'If an account with that email exists, a password reset link has been sent.';

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.json({ success: true, message: genericMessage });
    }

    // Generate secure random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save({ validateBeforeSave: false });

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    // Development-only: log reset URL (never log passwords or secrets)
    if (process.env.NODE_ENV !== 'production') {
      console.log('──────────────────────────────────────────────');
      console.log('[DEV ONLY] Password reset URL (do not share in production):');
      console.log(resetUrl);
      console.log('──────────────────────────────────────────────');
    }

    // Future: send email via configured provider (SMTP / SendGrid / etc.)
    // using process.env.SMTP_* or similar when available.

    return res.json({
      success: true,
      message: genericMessage,
      // Only expose reset URL in non-production for easier local testing
      ...(process.env.NODE_ENV !== 'production' ? { resetUrl } : {})
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password using the one-time token from the email / dev log.
 */
const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password) {
      return res.status(400).json({ success: false, message: 'Please enter a new password.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
    }
    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Password reset link is invalid or has expired. Please request a new one.'
      });
    }

    // Set new password – pre-save hook will hash it once
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return res.json({
      success: true,
      message: 'Password reset successfully. You can now sign in.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword
};
