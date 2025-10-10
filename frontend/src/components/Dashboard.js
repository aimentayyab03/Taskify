import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import '../App.css';
import { BACKEND_URL } from '../config';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState('all');
  const [newTask, setNewTask] = useState('');
  const [category, setCategory] = useState('Work');
  const [dueDate, setDueDate] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: localStorage.getItem('username') || 'User',
    email: localStorage.getItem('email') || 'user@email.com',
  });

  const token = localStorage.getItem('token');

  // If no token, redirect to login
  useEffect(() => {
    if (!token) window.location.href = '/login';
  }, [token]);

  // Axios instance with token
  const api = axios.create({
    baseURL: BACKEND_URL,
    headers: { 'x-auth-token': token },
  });

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    try {
      const res = await api.get('/api/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err.response?.data || err.message);
    }
  }, [api]);

  useEffect(() => {
    if (token) fetchTasks();
  }, [fetchTasks, token]);

  // Add new task
  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      const res = await api.post('/api/tasks', { title: newTask, category, dueDate });
      setTasks(prev => [res.data, ...prev]);
      setNewTask('');
      setCategory('Work');
      setDueDate('');
    } catch (err) {
      console.error('Error adding task:', err.response?.data || err.message);
    }
  };

  // Toggle task status
  const toggleStatus = async (id, status) => {
    try {
      const res = await api.put(`/api/tasks/${id}`, { status });
      setTasks(prev => prev.map(t => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error('Error updating status:', err.response?.data || err.message);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await api.delete(`/api/tasks/${id}`);
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error('Error deleting task:', err.response?.data || err.message);
    }
  };

  const filteredTasks = view === 'all' ? tasks : tasks.filter(t => t.status === view);

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inprogress: tasks.filter(t => t.status === 'inprogress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  return (
    <>
      <Sidebar setView={setView} />
      <div className="container">
        {view !== 'profile' ? (
          <>
            <h2>{view.charAt(0).toUpperCase() + view.slice(1)} Tasks</h2>

            {view === 'all' && (
              <div className="add-task">
                <input
                  type="text"
                  placeholder="Enter new task..."
                  value={newTask}
                  onChange={e => setNewTask(e.target.value)}
                />
                <select value={category} onChange={e => setCategory(e.target.value)}>
                  <option>Work</option>
                  <option>Personal</option>
                  <option>Shopping</option>
                  <option>Other</option>
                </select>
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                <button onClick={addTask} className="add-btn">Add Task</button>
              </div>
            )}

            {filteredTasks.length === 0 ? (
              <p>No tasks found</p>
            ) : (
              filteredTasks.map(task => (
                <div className="task-card" key={task._id}>
                  <div className="task-title">
                    {task.status === 'completed' ? <s>{task.title}</s> : task.title}
                  </div>
                  <div className="task-meta">
                    {task.category && <span className="task-category">{task.category}</span>}
                    {task.dueDate && <span className="task-date">Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                  </div>
                  <div className="task-buttons">
                    <button
                      className="todo-btn"
                      disabled={task.status === 'todo'}
                      onClick={() => toggleStatus(task._id, 'todo')}
                    >To Do</button>
                    <button
                      className="progress-btn"
                      disabled={task.status === 'inprogress'}
                      onClick={() => toggleStatus(task._id, 'inprogress')}
                    >In Progress</button>
                    <button
                      className="done-btn"
                      disabled={task.status === 'completed'}
                      onClick={() => toggleStatus(task._id, 'completed')}
                    >Done</button>
                    <button className="delete-btn" onClick={() => deleteTask(task._id)}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </>
        ) : (
          <div className="profile-container">
            <div className="profile-card">
              <img
                src={`https://ui-avatars.com/api/?name=${profileData.username}&background=1f1f38&color=fff&size=128`}
                alt="avatar"
                className="profile-avatar"
              />
              <h2>{profileData.username}</h2>
              <p className="tagline">Stay productive, stay consistent 💪</p>

              <div className="profile-info">
                <div className="info-row">
                  <label>Username:</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.username}
                      onChange={e => setProfileData({ ...profileData, username: e.target.value })}
                    />
                  ) : (
                    <span>{profileData.username}</span>
                  )}
                </div>
                <div className="info-row">
                  <label>Email:</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  ) : (
                    <span>{profileData.email}</span>
                  )}
                </div>
                <div className="info-row"><label>Total Tasks:</label><span>{stats.total}</span></div>
                <div className="info-row"><label>To Do:</label><span>{stats.todo}</span></div>
                <div className="info-row"><label>In Progress:</label><span>{stats.inprogress}</span></div>
                <div className="info-row"><label>Completed:</label><span>{stats.completed}</span></div>
              </div>

              <div className="profile-buttons">
                <button className="edit-btn" onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? 'Save Changes' : 'Edit Profile'}
                </button>
                <button
                  className="logout-btn"
                  onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
                >Logout</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
