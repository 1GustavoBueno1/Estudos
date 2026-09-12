const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");

router.get("/:id", accountController.getAccount);
router.post("/:id/withdraw", accountController.withdraw);
router.post("/:id/deposit", accountController.deposit);
router.get("/:id/statement", accountController.getStatement);
router.get("/:id/total-deposits", accountController.getTotalDeposits);
router.post("/:id/transfer", accountController.transfer);

module.exports = router;
