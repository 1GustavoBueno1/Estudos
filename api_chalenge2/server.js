const express = require("express");
const ordersRouter = require("./routes/orders");

const app = express();
app.use(express.json());

app.use("/orders", ordersRouter);

app.use((err, req, res, next) => {
  console.error("Erro capturado:", err.message);
  res.status(500).json({ error: "Erro interno no servidor" });
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
