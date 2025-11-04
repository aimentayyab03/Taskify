// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ------------------- CORS -------------------
// Whitelist of allowed origins
const allowedOrigins = [
  'http://localhost:3000',  // React dev server
  'http://localhost:8080',  // React container frontend
  'http://localhost:5000',  // Backend direct
  'http://13.60.249.192',   // EC2 frontend
  'http://13.60.249.192:5000' // EC2 backend
];

// Enable CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman or server-to-server requests
    if (!allowedOrigins.includes(origin)) {
      return callback(new Error('CORS policy does not allow this origin: ' + origin), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// ------------------- Middleware -------------------
app.use(express.json()); // Parse JSON requests

// ------------------- API Routes -------------------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

// ------------------- MongoDB Connection & Server -------------------
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected');

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
});
