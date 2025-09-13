require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const API_KEY = process.env.API_KEY;
const URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

mongoose.set('strictQuery', true);
mongoose.set('debug', true);

const app = express();

// CORS
const allowedOrigins = [
  'http://localhost:8080',
  'https://kanbangs.vercel.app',
  'https://kan-bangs.vercel.app'
];

const corsOptions = {
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'x-api-key', 'Authorization']
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Conexão com MongoDB
mongoose.connect(URI)
  .then(() => console.log('Conectado ao MongoDB com sucesso!'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Middleware de verificação de chave de API
function checkApiKey(req, res, next) {
  const userKey = req.headers['x-api-key'];
  if (userKey && userKey === API_KEY) {
    next();
  } else {
    res.status(403).json({ error: 'Chave de API inválida ou ausente' });
  }
}

// Rotas
const boardRoutes = require('./routes/boardRoutes');
const columnRoutes = require('./routes/columnRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

// app.use('/api/auth', authRoutes); // rota aberta
app.use('/api/users', checkApiKey, authRoutes);
app.use('/api/boards', checkApiKey, boardRoutes);
app.use('/api/columns', checkApiKey, columnRoutes);
app.use('/api/tasks', checkApiKey, taskRoutes);

// Rota aberta de teste
app.get('/', (req, res) => {
  res.json({ message: "Rota Aberta >>>> BelleModaPraia" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
