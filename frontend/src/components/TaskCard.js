import React from 'react';
import '../App.css';

export default function TaskCard({ task, toggleStatus, deleteTask }) {
  return (
    <div className="task-card">
      <div>
        <h4 style={{ textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}>
          {task.title}
        </h4>
        <span className={`category ${task.category}`}>{task.category}</span>
        {task.dueDate && <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>}
      </div>
      <div>
        <button onClick={() => toggleStatus(task._id, 'todo')}>To Do</button>
        <button onClick={() => toggleStatus(task._id, 'inprogress')}>In Progress</button>
        <button onClick={() => toggleStatus(task._id, 'completed')}>Done</button>
        <button onClick={() => deleteTask(task._id)}>Delete</button>
      </div>
    </div>
  );
}
