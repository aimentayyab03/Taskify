import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import { BACKEND_URL } from '../config';

export default function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${BACKEND_URL}/api/auth/signup`, {
        username,
        email,
        password,
      });

      // Safely check response before using
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);

        if (res.data.user) {
          localStorage.setItem('username', res.data.user.username);
          localStorage.setItem('email', res.data.user.email);
        }

        // Navigate to dashboard after successful signup
        navigate('/dashboard');
      } else {
        setError('Signup failed: Invalid server response.');
      }
    } catch (err) {
      console.error('Signup error:', err.response || err);

      // Show backend error message if available
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1 className="brand-name">Taskify</h1>
        <h2 className="auth-title">Create an Account ✨</h2>

        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSignup} className="auth-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
