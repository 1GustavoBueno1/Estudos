class AppError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: err.message });
  }
  if (err instanceof SyntaxError && err.status === 400) {
    return res.status(400).json({ error: 'JSON inválido' });
  }
  console.error(err);
  return res.status(500).json({ error: 'Erro interno' });
}

module.exports = { AppError, errorHandler };
