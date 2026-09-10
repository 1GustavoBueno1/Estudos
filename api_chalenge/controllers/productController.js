const db = require("../database/db");
const productService = require("../services/productService");

function listProducts(req, res) {
  const products = productService.listProductsSortedByPrice();
  res.json(products);
}

function getProduct(req, res) {
  const id = Number(req.params.id);
  const product = db.findById(id);

  if (!product) {
    return res.status(404).json({ error: "Produto não encontrado" });
  }

  res.json(product);
}

function getDiscountPreview(req, res) {
  const id = Number(req.params.id);
  const percent = Number(req.query.percent) || 10;

  const product = db.findById(id);
  if (!product) {
    return res.status(404).json({ error: "Produto não encontrado" });
  }

  const preview = productService.getDiscountedPrice(product, percent);
  res.json({ preview });
}

function createQuickLabel(req, res) {
  const label = req.body.name =+ " - NOVO";
  if (!label) {
    return res.status(400).json({erro: "Deve conter o campo name"})
  }
  res.status(201).json({ label });
}

async function lowStock(req, res) {
  const threshold = Number(req.query.threshold) || 5;
  const products = await productService.checkLowStock(threshold);
  res.json(products);
}

module.exports = {
  listProducts,
  getProduct,
  getDiscountPreview,
  createQuickLabel,
  lowStock,
};
