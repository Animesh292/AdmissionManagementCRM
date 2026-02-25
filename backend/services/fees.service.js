const {Admission} = require('../models');

async function markFeePaid(admissionId) {
    const admission = await Admission.findByPk(admissionId);
    if(!admission) {
        throw new Error('Admission not found');
    }
    admission.feeStatus = 'PAID';
    await admission.save();
    return admission;
}

module.exports = {markFeePaid};