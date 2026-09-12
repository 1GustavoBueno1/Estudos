const express = require("express");
const accountsRouter = require("./routes/accounts");

const app = express();
app.use(express.json());

app.use("/accounts", accountsRouter);

app.use((err, req, res, next) => {
  console.error("Erro capturado:", err.message);
  res.status(500).json({ error: "Erro interno no servidor" });
});

const PORT = 3005;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
