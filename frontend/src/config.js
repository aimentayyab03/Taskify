// src/config.js

let backendUrl;

if (window.location.hostname === 'localhost') {
  // Local development
  backendUrl = 'http://localhost:5000';
} else {
  // Production (your EC2 public IP)
  backendUrl = 'http://13.53.187.249:5000';
}

const BACKEND_URL = backendUrl;

export { BACKEND_URL };

