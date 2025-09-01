const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Column = require('../models/Column');

// CREATE task
router.post('/', async (req, res) => {
  const task = new Task(req.body);
  await task.save();

  if (req.body.columnId) {
    await Column.findByIdAndUpdate(req.body.columnId, { $push: { tasks: task._id } });
  }

  res.status(201).json(task);
});

// UPDATE task
router.put('/:id', async (req, res) => {

  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Tarefa atualizada com sucesso', data: task });
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    res.status(500).json({ message: 'Erro ao atualizar tarefa', error });
  }

});

// DELETE task
router.delete('/:id', async (req, res) => {

  try {

    const task = await Task.findByIdAndDelete(req.params.id);
    res.sendStatus(204).json({ message: 'Tarefa removida com sucesso', data: task });

  } catch (error) {
w  }

});

module.exports = router;