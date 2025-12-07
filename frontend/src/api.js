// frontend/src/api.js
import axios from 'axios';

// Use environment variable or fallback to the new EC2 public IP
const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://16.171.26.154:5000/api";


export default BASE_URL;
