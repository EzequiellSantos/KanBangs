const express = require('express');
const router = express.Router();
const Board = require('../models/Board');
const auth = require('../middleware/auth');

// Middleware de autenticação em todas as rotas abaixo
router.use(auth);

// GET todos os boards do usuário logado
router.get('/', async (req, res) => {
  try {
    const boards = await Board.find({ userId: req.user._id }).populate({
      path: 'columns',
      populate: { path: 'tasks' }
    });
    res.json(boards);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar boards', message: err.message });
  }
});

// POST criar novo board
router.post('/', async (req, res) => {
  try {
    const board = new Board({ ...req.body, userId: req.user._id });
    await board.save();
    res.status(201).json(board);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar board', message: err.message });
  }
});

// PUT atualizar board
router.put('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const board = await Board.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!board) {
      return res.status(404).json({ error: 'Board não encontrado ou acesso negado' });
    }

    res.json(board);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar board', message: err.message });
  }
});

// DELETE remover board
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Board.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!deleted) {
      return res.status(404).json({ error: 'Board não encontrado ou acesso negado' });
    }

    res.json({ message: 'Board removido com sucesso', data: deleted });
    
  } catch (err) {
    res.status(400).json({ error: 'Erro ao remover board', message: err.message });
  }
});

module.exports = router;
