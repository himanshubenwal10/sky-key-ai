/**
 * Sky Key AI - Main Server Entry Point
 * Initializes Express server and loads all modules
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/gesture', require('./routes/gesture'));
app.use('/api/voice', require('./routes/voice'));
app.use('/api/apps', require('./routes/apps'));
app.use('/api/health', require('./routes/health'));

// WebSocket Events
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('gesture', (data) => {
    console.log('Gesture detected:', data);
    io.emit('gesture-update', data);
  });

  socket.on('voice-command', (data) => {
    console.log('Voice command:', data);
    io.emit('voice-update', data);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

server.listen(PORT, HOST, () => {
  console.log(`
╔════════════════════════════════════════╗
║        🚀 Sky Key AI Server             ║
║        Version: 1.0.0                   ║
╚════════════════════════════════════════╝

📍 Server running at: http://${HOST}:${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
📝 Log Level: ${process.env.LOG_LEVEL || 'info'}

✅ Ready to accept connections...
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = { app, server, io };
