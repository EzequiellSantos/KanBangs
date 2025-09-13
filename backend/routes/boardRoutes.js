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
    // 1. Buscar boards do usuário e popular colunas
    const boards = await Board.find({ userId: req.user._id })
      .populate('columns')
      .lean(); // importante para manipular os dados depois

    // 2. Para cada board, buscar tasks de cada coluna
    const boardsComTarefas = await Promise.all(
      boards.map(async (board) => {
        const columnsWithTasks = await Promise.all(
          (board.columns || []).map(async (col) => {
            const tasks = await Task.find({ columnId: col._id }).lean();
            return {
              ...col,
              tasks: tasks || []
            };
          })
        );

        return {
          ...board,
          columns: columnsWithTasks
        };
      })
    );

    // 3. Responder com boards + colunas + tasks
    res.json({ error: null, data: boardsComTarefas });
  } catch (err) {
    console.error('[GET /boards] Erro:', err);
    res.status(500).json({
      error: 'Erro ao buscar boards',
      message: err.message
    });
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
