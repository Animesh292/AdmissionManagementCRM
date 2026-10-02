const { sequelize, Quota, Admission, Application } = require('../models');

async function allocateSeats({ applicationId, programId, quotaId }) {
    const transaction = await sequelize.transaction();
    try {
        const application = await Application.findByPk(applicationId, {
            lock: transaction.LOCK.UPDATE,
            transaction,
        });
        if (!application) {
            throw new Error('Applicant not found');
        }
        if (application.status !== 'DOC_VERIFIED') {
            throw new Error('Documents must be verified before seat allocation');
        }
        const existingAdmission = await Admission.findOne({
            where: { applicantId: applicationId },
            transaction,
        });
        if (existingAdmission) {
            throw new Error('Applicant already has an allocated seat');
        }

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

        application.status = 'SEAT_ALLOCATED';
        await application.save({ transaction });

        await transaction.commit();
        return admission;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

module.exports = { allocateSeats };