const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 5001;

// Connect to MongoDB and listen
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Maidaan Express MERN Server Running on Port ${PORT}`);
    console.log(`🌐 API Endpoint: http://localhost:${PORT}/api`);
    console.log(`=======================================================`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
});
