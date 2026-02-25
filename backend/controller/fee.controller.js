const { markFeePaid } = require('../services/fees.service');

async function markFeePaidController(req, res) {
    try {
        const { admissionId } = req.body;
        const result = await markFeePaid(admissionId);
        res.json({ message: 'Fee marked as paid successfully', result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { markFeePaidController };
