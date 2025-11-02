// src/config.js
let backendUrl;

if (window.location.hostname === 'localhost') {
  // Local development
  backendUrl = 'http://localhost:5000';
} else {
  // EC2 deployment
  backendUrl = 'https://taskify-backend-env.eba-uac59zxd.us-east-1.elasticbeanstalk.com';
}

export const BACKEND_URL = backendUrl;
