const express = require("express");
const routes = require("./routes/billing");

const app = express();
app.use(express.json());
app.use("/", routes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

const PORT = 3013;
app.listen(PORT, () => {
  console.log(`API de assinaturas rodando em http://localhost:${PORT}`);
});
