const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ------------------- CORS -------------------
const allowedOrigins = [
  'http://localhost:3000',        // Local frontend
  'http://localhost:5000',        // Local backend if accessed directly
  'http://13.60.249.192',         // EC2 frontend (React app hosted on EC2)
  'http://13.60.249.192:5000'     // EC2 backend (if accessed directly)
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman or server-to-server)
    if (!origin) return callback(null, true);

    if (!allowedOrigins.includes(origin)) {
      const msg = 'CORS policy does not allow this origin: ' + origin;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

// ------------------- API Routes -------------------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

// ------------------- Serve React Frontend -------------------
const __dirnameResolved = path.resolve();
app.use(express.static(path.join(__dirnameResolved, '../frontend/build')));

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirnameResolved, '../frontend/build', 'index.html'));
});

// ------------------- MongoDB & Server -------------------
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.log('❌ MongoDB connection error:', err));
