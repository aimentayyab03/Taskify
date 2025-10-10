let backendUrl;

if (process.env.NODE_ENV === 'development') {
  backendUrl = 'http://localhost:5000';
} else {
  // Default (production, e.g., Elastic Beanstalk)
  backendUrl = 'http://13.53.187.249:5000';
}

export default backendUrl;
