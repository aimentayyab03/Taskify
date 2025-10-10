// frontend/src/api.js
import axios from 'axios';

// Replace YOUR_EC2_PUBLIC_IP with your EC2 public IP
const API = axios.create({
  baseURL: 'http://13.53.187.249:5000/api'
});

export default API;
