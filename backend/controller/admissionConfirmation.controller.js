const {confirmAdmission} = require("../services/admissionConfirmation.service");


async function confirmAdmissionController(req, res) {
    try {
        const {admissionId} = req.body;
        const result = await confirmAdmission(admissionId);

        res.status(200).json({
            message: 'Admission confirmed successfully',
            admission: result
        });
    }
    catch(error) {
        res.status(400).json({message: error.message});
    }
}


module.exports = {confirmAdmissionController};