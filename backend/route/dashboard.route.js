const express = require("express");
const router = express.Router();
const dashboardController = require("../controller/dashboard.controller");

router.get("/intake-vs-admitted", dashboardController.intakeVsAdmitted);
router.get("/quota-status", dashboardController.quotaStatus);
router.get("/pending-documents", dashboardController.pendingDocuments);
router.get("/fee-pending", dashboardController.feePending);
router.get("/paid-admissions", dashboardController.paidAdmissions);
router.get("/confirmed-admissions", dashboardController.confirmedAdmissions);

module.exports = router;
