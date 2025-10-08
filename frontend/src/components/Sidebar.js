import React from 'react';
import { FaTasks, FaCheck, FaHourglassHalf, FaSignOutAlt, FaUser } from 'react-icons/fa';
import '../App.css';

export default function Sidebar({ setView }) {
  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="sidebar">
      <h2>TaskApp</h2>
      <button onClick={() => setView('all')}><FaTasks /> All Tasks</button>
      <button onClick={() => setView('todo')}><FaHourglassHalf /> To Do</button>
      <button onClick={() => setView('inprogress')}><FaHourglassHalf /> In Progress</button>
      <button onClick={() => setView('completed')}><FaCheck /> Completed</button>
      <button onClick={() => setView('profile')}><FaUser /> Profile</button>
      <button onClick={logout}><FaSignOutAlt /> Logout</button>
    </div>
  );
}
