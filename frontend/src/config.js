// src/config.js

let backendUrl;

if (window.location.hostname === 'localhost') {
  // Local development
  backendUrl = 'http://localhost:5000';
} else if (window.location.hostname === '13.53.187.249') {
  // EC2 deployment
  backendUrl = 'http://13.53.187.249:5000';
} else {
  // Default (production, e.g., Elastic Beanstalk)
  backendUrl = 'http://taskify-env-1.eba-hgpfeymf.eu-north-1.elasticbeanstalk.com';
}

export const BACKEND_URL = backendUrl;
