// src/config.js
let backendUrl;

if (window.location.hostname === 'localhost') {
  // Local development
  backendUrl = 'http://localhost:5000';
} else {
  // EC2 deployment
  backendUrl = 'http://13.60.249.192:5000';
}

export const BACKEND_URL = backendUrl;
