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
    console.error('Erro ao remover tarefa:', error);
    res.status(500).json({ message: 'Erro ao remover tarefa', error });
  }

});

// POST /api/tasks/move
router.post('/move', async (req, res) => {
  const { fromColId, toColId, taskId, toIndex } = req.body;
  try {
    const fromCol = await Column.findById(fromColId);
    if (!fromCol) return res.status(404).json({ error: 'Coluna de origem não encontrada' });

    const taskIdx = Array.isArray(fromCol.tasks)
      ? fromCol.tasks.findIndex(id => id.toString() === taskId)
      : -1;

    if (taskIdx === -1) return res.status(404).json({ error: 'Tarefa não encontrada na coluna de origem' });

    const [removedTask] = fromCol.tasks.splice(taskIdx, 1);
    await fromCol.save();

    const toCol = await Column.findById(toColId);
    if (!toCol) return res.status(404).json({ error: 'Coluna de destino não encontrada' });
    toCol.tasks.splice(toIndex, 0, removedTask);
    await toCol.save();

    await Task.findByIdAndUpdate(taskId, { columnId: toColId });

    // Retorne a coluna populada
    const updatedCol = await Column.findById(toColId).populate('tasks');
    res.status(200).json({ message: 'Tarefa movida com sucesso', column: updatedCol });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao mover tarefa', details: err });
    console.error(err);
  }
});

module.exports = router;