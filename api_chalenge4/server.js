const express = require("express");
const cartRouter = require("./routes/cart");

const app = express();
app.use(express.json());

app.use("/cart", cartRouter);

app.use((err, req, res, next) => {
  console.error("Erro capturado:", err.message);
  res.status(500).json({ error: "Erro interno no servidor" });
});

const PORT = 3007;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
