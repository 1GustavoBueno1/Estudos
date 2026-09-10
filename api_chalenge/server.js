const express = require("express");
const productsRouter = require("./routes/products");

const app = express();
app.use(express.json());


app.use("/products", productsRouter);

app.use((err, req, res, next) => {
  console.error("Erro capturado:", err.message);
  res.status(500).json({ error: "Erro interno no servidor" });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
