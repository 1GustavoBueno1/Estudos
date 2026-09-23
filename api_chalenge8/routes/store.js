const express = require("express");
const router = express.Router();
const store = require("../controllers/storeController");

router.get("/products", store.listProducts);
router.get("/products/:id", store.getProduct);

router.get("/orders", store.listOrders);
router.get("/orders/:id", store.getOrder);
router.post("/orders", store.createOrder);
router.post("/orders/:id/cancel", store.cancelOrder);

router.get("/coupons", store.listCoupons);
router.get("/coupons/:code/validate", store.validateCoupon);

router.get("/reports/sales", store.salesReport);

module.exports = router;
