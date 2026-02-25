const dashboardService = require("../services/dashboard.service");

async function intakeVsAdmitted(req, res) {
  try {
    const data = await dashboardService.getIntakeVsAdmitted();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function quotaStatus(req, res) {
  try {
    const data = await dashboardService.getQuotaSeatStatus();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function pendingDocuments(req, res) {
  try {
    const data = await dashboardService.getPendingDocuments();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function feePending(req, res) {
  try {
    const data = await dashboardService.getFeePendingAdmissions();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function paidAdmissions(req, res) {
  try {
    const data = await dashboardService.getPaidAdmissions();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function confirmedAdmissions(req, res) {
  try {
    const data = await dashboardService.getConfirmedAdmissions();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  intakeVsAdmitted,
  quotaStatus,
  pendingDocuments,
  feePending,
  paidAdmissions,
  confirmedAdmissions
}