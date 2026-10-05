const express = require('express');
const bookRoutes = require('./routes/bookRoutes');
const loanRoutes = require('./routes/loanRoutes');
const memberRoutes = require('./routes/memberRoutes');
const { errorHandler } = require('./utils/errors');

const app = express();
app.use(express.json());

app.use('/books', bookRoutes);
app.use('/loans', loanRoutes);
app.use('/members', memberRoutes);

app.use((req, res) => res.status(404).json({ error: 'Rota não encontrada' }));
app.use(errorHandler);

module.exports = app;
