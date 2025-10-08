import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="container">
      <h2>Welcome to Fun To-Do App</h2>
      <button className="primary" onClick={() => navigate('/login')}>Login</button>
      <button className="secondary" onClick={() => navigate('/signup')}>Signup</button>
    </div>
  );
}
