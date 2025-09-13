const express = require('express');
const router = express.Router();
const Board = require('../models/Board');
const Column = require('../models/Column');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// Middleware de autenticação em todas as rotas abaixo
router.use(auth);

// GET todos os boards do usuário logado, com colunas e tarefas
router.get('/', async (req, res) => {
  try {
    const boards = await Board.find({ userId: req.user._id })
      .populate({
        path: 'columns',
        populate: {
          path: 'tasks'
        }
      });

    // Reordene as tasks de cada coluna conforme o array de IDs
    boards.forEach(board => {
      board.columns.forEach(col => {
        if (col.tasks && Array.isArray(col.tasks) && col.tasks.length && col.tasks[0]._id) {
          // col.tasks: array de objetos populados
          // col.tasks (no schema): array de ids
          const idOrder = col.tasks.map(t => t._id.toString());
          col.tasks.sort((a, b) => {
            return idOrder.indexOf(a._id.toString()) - idOrder.indexOf(b._id.toString());
          });
        }
      });
    });

    res.json({ data: boards });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar boards', details: err });
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

// REORDER columns in a board
router.post('/:boardId/columns/reorder', async (req, res) => {
  const { fromColId, toIndex } = req.body;
  const { boardId } = req.params;

  try {
    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ error: 'Board não encontrado' });

    // Remove coluna da posição original
    const colIndex = board.columns.findIndex(id => id.toString() === fromColId);
    if (colIndex === -1) return res.status(404).json({ error: 'Coluna não encontrada no board' });

    const [removed] = board.columns.splice(colIndex, 1);

    // Insere na nova posição
    board.columns.splice(toIndex, 0, removed);

    await board.save();

    res.status(200).json({ message: 'Ordem das colunas atualizada', columns: board.columns });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao reordenar colunas', details: err });
  }
});

module.exports = router;
