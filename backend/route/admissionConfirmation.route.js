const express = require("express");
const router = express.Router();
const {
  confirmAdmissionController,
} = require("../controller/admissionConfirmation.controller");

router.post("/confirm", confirmAdmissionController);

module.exports = router;
