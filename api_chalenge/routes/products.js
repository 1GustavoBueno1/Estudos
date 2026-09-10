const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/", productController.listProducts);
router.get("/low-stock", productController.lowStock);
router.post("/quick-label", productController.createQuickLabel);
router.get("/:id", productController.getProduct);
router.get("/:id/discount", productController.getDiscountPreview);

module.exports = router;
