const express = require("express");
const router = express.Router();
const libraryController = require("../controllers/libraryController");

router.get("/books", libraryController.listBooks);
router.get("/books/:id/availability", libraryController.getAvailability);

router.get("/loans", libraryController.listLoans);
router.get("/loans/sorted", libraryController.listLoansSorted);
router.get("/loans/fines", libraryController.getFines);
router.get("/loans/:id/notice", libraryController.getNotice);

module.exports = router;
