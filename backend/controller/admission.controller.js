const {allocateSeats} = require('../services/admission.service')

async function allocateSeatController(req, res) {
    try {
        const {applicationId, programId, quotaId} = req.body;

        const admission = await allocateSeats({applicationId, programId, quotaId});

        res.status(201).json({message: 'Seat allocated successfully', admission});
    } catch(error) {
        res.status(400).json({message: error.message});
    }
}

module.exports = {allocateSeatController};