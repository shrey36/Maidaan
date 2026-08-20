const express = require('express');
const cors = require('cors');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const turfRoutes = require('./routes/turfRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');
const playerRoutes = require('./routes/playerRoutes');
const teamRoutes = require('./routes/teamRoutes');
const tournamentRoutes = require('./routes/tournamentRoutes');
const auctionRoutes = require('./routes/auctionRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://localhost:5500'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive in local development
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', message: 'Maidaan Express MERN API Server Running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/turfs', turfRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;
