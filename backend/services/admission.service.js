const { sequelize, Quota, Admission, Application } = require('../models');

async function allocateSeats({ applicationId, programId, quotaId }) {
    const transaction = await sequelize.transaction();
    try {
        const quota = await Quota.findOne({
            where: { id: quotaId, programId: programId },
            lock: transaction.LOCK.UPDATE,
            transaction,
        });
        if (!quota) {
            throw new Error('Quota not found');
        }
        if (quota.filledSeats >= quota.totalSeats) {
            throw new Error('No seats available in this quota');
        }

        const admission = await Admission.create({
            applicantId: applicationId,
            programId: programId,
            quotaId: quotaId,
            feeStatus: 'PENDING',
        },
            { transaction }
        );

        quota.filledSeats += 1;
        await quota.save({ transaction });

        await Application.update({
            status: 'SEAT_ALLOCATED',
        }, {
            where: { id: applicationId }, transaction
        });
        await transaction.commit();
        return admission;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

module.exports = { allocateSeats };