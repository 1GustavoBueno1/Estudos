const express = require("express");
const router = express.Router();
const billingController = require("../controllers/billingController");

router.get("/plans", billingController.listPlans);

router.get("/subscriptions", billingController.listSubscriptions);
router.get("/subscriptions/:id", billingController.getSubscription);
router.get("/subscriptions/:id/price", billingController.getPrice);
router.post("/subscriptions/:id/cancel", billingController.cancel);

router.get("/billing/revenue", billingController.getRevenue);
router.post("/billing/renew-all", billingController.renewAll);

module.exports = router;
