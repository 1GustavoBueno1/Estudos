const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.get("/notify", orderController.notifyAll);
router.post("/:id/items", orderController.addItem);
router.get("/:id/total", orderController.getTotal);
router.get("/:id/city", orderController.getCity);
router.post("/:id/checkout", orderController.checkout);

module.exports = router;
