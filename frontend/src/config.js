// src/config.js

let backendUrl;

if (window.location.hostname === 'localhost') {
  // Local development
  backendUrl = 'http://localhost:5000';
} else {
  // Production (EC2)
  backendUrl = 'http://13.60.249.192:5000';
}

const BACKEND_URL = backendUrl;

export { BACKEND_URL };
