const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.get("/", cartController.getCart);
router.post("/items", cartController.addItem);
router.post("/items/bulk", cartController.bulkAdd);
router.delete("/items/:id", cartController.removeItemsById);
router.get("/duplicate", cartController.duplicateCart);
router.get("/cached-total", cartController.getCachedTotal);

module.exports = router;
