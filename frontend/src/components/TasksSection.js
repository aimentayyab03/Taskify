import React, { useState } from 'react';
import TaskCard from './TaskCard';

export default function TasksSection({ tasks = [], view, addTask, toggleStatus, deleteTask, type }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Work');
  const [dueDate, setDueDate] = useState('');

  if (type === 'profile') {
    return (
      <div className="profile-info">
        <h3>Profile</h3>
        <p>Username: {localStorage.getItem('username')}</p>
        <p>Total Tasks: {tasks.length}</p>
        <p>Completed: {tasks.filter(t => t.status === 'completed').length}</p>
        <p>In Progress: {tasks.filter(t => t.status === 'inprogress').length}</p>
        <p>To Do: {tasks.filter(t => t.status === 'todo').length}</p>
      </div>
    );
  }

  const handleAddTask = e => {
    e.preventDefault();
    addTask(title, category, dueDate);
    setTitle('');
    setDueDate('');
    setCategory('Work');
  };

  const filteredTasks = tasks.filter(task => {
    if (view === 'all') return true;
    return task.status === view;
  });

  return (
    <>
      <form className="add-task-container" onSubmit={handleAddTask}>
        <input placeholder="Task Title" value={title} onChange={e => setTitle(e.target.value)} />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option>Work</option>
          <option>Personal</option>
          <option>Shopping</option>
          <option>Other</option>
        </select>
        <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        <button className="primary" type="submit">Add Task</button>
      </form>

      {filteredTasks.map(task => (
        <TaskCard
          key={task._id}
          task={task}
          toggleStatus={toggleStatus}
          deleteTask={deleteTask}
        />
      ))}
    </>
  );
}
