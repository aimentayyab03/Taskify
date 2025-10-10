const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// ------------------- Debug env -------------------
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('MONGO_URI:', process.env.MONGO_URI);

const app = express();

// ------------------- CORS -------------------
// Only allow these origins
const allowedOrigins = [
  'http://localhost:3000',        // your local frontend
  'http://localhost:5000',        // optional if frontend served on 5000
  'http://13.53.187.249/:3000',  // EC2 frontend if running locally on EC2
  'http://13.53.187.249/:5000'   // EC2 backend port
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true); 
    
    if (allowedOrigins.indexOf(origin) === -1) {
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
app.use(express.static(path.join(__dirnameResolved, 'frontend', 'build')));

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirnameResolved, 'frontend', 'build', 'index.html'));
});

// ------------------- MongoDB & Server -------------------
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log('MongoDB connection error:', err));
