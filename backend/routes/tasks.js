const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Task = require('../models/Task');

// GET all tasks for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// ADD new task
// router.post('/', auth, async (req, res) => {
//   try {
//     const { title, category, dueDate } = req.body;
//     const newTask = new Task({
//       user: req.user.id,
//       title,
//       category: category || 'Other',
//       dueDate: dueDate || null
//     });
//     const savedTask = await newTask.save();
//     res.json(savedTask);
//   } catch (err) {
//     res.status(500).send('Server Error');
//   }
// });

// ADD new task with validation
router.post('/', auth, async (req, res) => {
  try {
    const { title, category, dueDate } = req.body;

    // Backend validation
    if (!title || !category || !dueDate) {
      return res.status(400).json({ msg: "Please fill all fields" });
    }

    const newTask = new Task({
      user: req.user.id,
      title,
      category,
      dueDate
    });

    const savedTask = await newTask.save();
    res.json(savedTask);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// UPDATE task status
router.put('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status },
      { new: true } // return updated document
    );
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// DELETE task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    res.json({ msg: 'Task removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
