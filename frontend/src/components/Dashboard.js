import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import '../App.css';

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

  // ✅ Fetch all tasks
  const fetchTasks = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks', {
        headers: { 'x-auth-token': token },
      });
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  }, [token]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ✅ Add a new task (only available in "All Tasks" view)
  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      const res = await axios.post(
        'http://localhost:5000/api/tasks',
        { title: newTask, category, dueDate },
        { headers: { 'x-auth-token': token } }
      );
      setTasks(prev => [res.data, ...prev]);
      setNewTask('');
      setCategory('Work');
      setDueDate('');
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  // ✅ Update task status
  const toggleStatus = async (id, status) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        { status },
        { headers: { 'x-auth-token': token } }
      );
      setTasks(prev => prev.map(t => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // ✅ Delete task
  const deleteTask = async id => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { 'x-auth-token': token },
      });
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  // ✅ Filtered tasks
  const filteredTasks =
    view === 'all' ? tasks : tasks.filter(t => t.status === view);

  // ✅ Stats
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

            {/* ✅ Show Add Task form ONLY in "All Tasks" view */}
            {view === 'all' && (
              <div className="add-task">
                <input
                  type="text"
                  placeholder="Enter new task..."
                  value={newTask}
                  onChange={e => setNewTask(e.target.value)}
                />
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  <option>Work</option>
                  <option>Personal</option>
                  <option>Shopping</option>
                  <option>Other</option>
                </select>
                <input
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                />
                <button onClick={addTask} className="add-btn">
                  Add Task
                </button>
              </div>
            )}

            {filteredTasks.length === 0 ? (
              <p>No tasks found</p>
            ) : (
              filteredTasks.map(task => (
                <div className="task-card" key={task._id}>
                  <div className="task-title">
                    {task.status === 'completed' ? (
                      <s>{task.title}</s>
                    ) : (
                      task.title
                    )}
                  </div>
                  <div className="task-meta">
                    {task.category && <span className="task-category">{task.category}</span>}
                    {task.dueDate && (
                      <span className="task-date">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className="task-buttons">
                    <button className="todo-btn" onClick={() => toggleStatus(task._id, 'todo')}>
                      To Do
                    </button>
                    <button className="progress-btn" onClick={() => toggleStatus(task._id, 'inprogress')}>
                      In Progress
                    </button>
                    <button className="done-btn" onClick={() => toggleStatus(task._id, 'completed')}>
                      Done
                    </button>
                    <button className="delete-btn" onClick={() => deleteTask(task._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        ) : (
          // ✅ Profile Section
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
                      onChange={e =>
                        setProfileData({ ...profileData, username: e.target.value })
                      }
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
                      onChange={e =>
                        setProfileData({ ...profileData, email: e.target.value })
                      }
                    />
                  ) : (
                    <span>{profileData.email}</span>
                  )}
                </div>

                <div className="info-row">
                  <label>Total Tasks:</label>
                  <span>{stats.total}</span>
                </div>
                <div className="info-row">
                  <label>To Do:</label>
                  <span>{stats.todo}</span>
                </div>
                <div className="info-row">
                  <label>In Progress:</label>
                  <span>{stats.inprogress}</span>
                </div>
                <div className="info-row">
                  <label>Completed:</label>
                  <span>{stats.completed}</span>
                </div>
              </div>

              <div className="profile-buttons">
                <button
                  className="edit-btn"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Save Changes' : 'Edit Profile'}
                </button>
                <button
                  className="logout-btn"
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = '/login';
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
