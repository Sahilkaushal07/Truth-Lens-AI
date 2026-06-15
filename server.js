const http = require('http');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = require('./src/app');
const connectDB = require('./src/config/db');
const socketService = require('./src/services/socketService');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Database
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io WebSockets service
const io = socketService.init(server);

// Boot server listening
server.listen(PORT, () => {
  const url = PORT == 80 ? 'http://localhost' : `http://localhost:${PORT}`;
  console.log(`====================================================`);
  console.log(`TruthLens API server listening on: ${url}`);
  console.log(`Environment mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`====================================================`);
});

// Capture unhandled rejection flags
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Do not crash server process
});
