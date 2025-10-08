const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  category: { type: String, default: 'Other' },
  dueDate: { type: Date, default: null },
  status: { type: String, enum: ['todo', 'inprogress', 'completed'], default: 'todo' }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
