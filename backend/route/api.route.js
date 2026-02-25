const express = require('express');
const router = express.Router();
const { getAllPrograms, getQuotasByProgram } = require('../controller/master.controller');
const { getPendingApplications, verifyDocuments, registerApplication } = require('../controller/application.controller');
const { markFeePaidController } = require('../controller/fee.controller');

// Master routes
router.get('/programs', getAllPrograms);
router.get('/quotas/:programId', getQuotasByProgram);

// Application routes
router.get('/applications/pending', getPendingApplications);
router.post('/applications/verify-documents', verifyDocuments);
router.post('/applications/register', registerApplication);

// Fee routes
router.post('/fees/pay', markFeePaidController);

module.exports = router;
