const express = require('express');
const router = express.Router();
const Column = require('../models/Column');
const Board = require('../models/Board');

// CREATE column
router.post('/', async (req, res) => {
  const column = new Column(req.body);
  await column.save();

  if (req.body.boardId) {
    await Board.findByIdAndUpdate(req.body.boardId, { $push: { columns: column._id } });
  }

  res.status(201).json(column);
});

// UPDATE column
router.put('/:id', async (req, res) => {
  const column = await Column.findOneAndDelete({ _id: req.params.id, ...req.body }, { new: true });
  res.json(column);
});

// DELETE column
router.delete('/:id', async (req, res) => {
  const col = await Column.findOneAndDelete({ _id: req.params.id });
  res.status(200).json({ message: 'Coluna removida com sucesso'});
});

module.exports = router;
