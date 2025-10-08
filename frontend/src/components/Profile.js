import React, { useState } from "react";
import "../App.css";

export default function Profile() {
  const storedUsername = localStorage.getItem("username") || "User";
  const [username, setUsername] = useState(storedUsername);
  const [email, setEmail] = useState("user@example.com");
  const [editing, setEditing] = useState(false);

  // Mock stats (replace with real data from backend if available)
  const [stats] = useState({
    todo: 3,
    inProgress: 5,
    completed: 10,
  });

  const handleSave = () => {
    localStorage.setItem("username", username);
    setEditing(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <img
            src={`https://ui-avatars.com/api/?name=${username}&background=1f1f38&color=fff&size=128`}
            alt="User Avatar"
            className="profile-avatar"
          />
          <h2>{username}</h2>
          <p className="profile-quote">✨ Plan your day, own your goals ✨</p>
        </div>

        <div className="profile-section">
          <h3>Personal Information</h3>
          <div className="profile-info">
            <label>Username:</label>
            {editing ? (
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            ) : (
              <p>{username}</p>
            )}
          </div>

          <div className="profile-info">
            <label>Email:</label>
            {editing ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            ) : (
              <p>{email}</p>
            )}
          </div>
        </div>

        <div className="profile-section">
          <h3>Task Overview</h3>
          <div className="profile-stats-grid">
            <div className="stat-card todo">
              <h4>{stats.todo}</h4>
              <p>To Do</p>
            </div>
            <div className="stat-card inprogress">
              <h4>{stats.inProgress}</h4>
              <p>In Progress</p>
            </div>
            <div className="stat-card completed">
              <h4>{stats.completed}</h4>
              <p>Completed</p>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          {editing ? (
            <button className="save-btn" onClick={handleSave}>
              💾 Save Changes
            </button>
          ) : (
            <button className="edit-btn" onClick={() => setEditing(true)}>
              ✏️ Edit Profile
            </button>
          )}
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}
