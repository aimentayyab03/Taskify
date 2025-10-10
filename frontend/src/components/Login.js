const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();

// ------------------- CORS -------------------
// Allow local frontend on 3000 and Postman
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: true
}));

app.use(express.json());

// ------------------- Routes -------------------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

// ------------------- Serve React Frontend (optional for local dev) -------------------
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
