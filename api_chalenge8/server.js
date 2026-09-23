const express = require("express");
const routes = require("./routes/store");

const app = express();
app.use(express.json());
app.use("/", routes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({ error: err.message });
});

const PORT = 3015;
app.listen(PORT, () => {
  console.log(`API da loja rodando em http://localhost:${PORT}`);
});
