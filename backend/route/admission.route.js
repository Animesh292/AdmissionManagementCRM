const express = require('express');
const router = express.Router();
const {allocateSeatController} = require('../controller/admission.controller');

router.post('/allocate-seat', allocateSeatController);

module.exports = router;