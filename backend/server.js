// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ------------------- CORS -------------------
// Whitelist of allowed origins
const allowedOrigins = [
   'http://localhost:3000',   // React dev
  'http://localhost:8080',   // React container frontend
  'http://16.16.170.241',    // EC2 frontend
  'http://16.16.170.241:5000',// EC2 backend (optional)
  'http://16.16.170.241:8082',
  'http://51.20.10.38:3000', 
  'http://51.20.10.38:5000 ' 
];

// Enable CORS
// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin) return callback(null, true); // allow Postman or server-to-server requests
//     if (!allowedOrigins.includes(origin)) {
//       return callback(new Error('CORS policy does not allow this origin: ' + origin), false);
//     }
//     return callback(null, true);
//   },
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   credentials: true
// }));

// server.js

app.use(cors({
  origin: '*',       // <-- allow all origins temporarily
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
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
