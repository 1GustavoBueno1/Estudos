const express = require("express");
const routes = require("./routes/library");

const app = express();
app.use(express.json());
app.use("/", routes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

const PORT = 3011;
app.listen(PORT, () => {
  console.log(`API da biblioteca rodando em http://localhost:${PORT}`);
});
