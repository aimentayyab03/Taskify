const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ------------------- CORS -------------------
const allowedOrigins = [
  'http://localhost:3000',        
  'http://localhost:5000',        
  'http://13.60.249.192',         
  'http://13.60.249.192:5000'     
];

app.use(cors({
  origin: function (origin, callback) {
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

// ------------------- Serve Frontend -------------------
// Serve your React build (from public folder created earlier)
app.use(express.static('public'));

// Catch-all route for React Router
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ------------------- MongoDB & Server -------------------
const PORT = process.env.PORT || 8080;
const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.log('❌ MongoDB connection error:', err));
