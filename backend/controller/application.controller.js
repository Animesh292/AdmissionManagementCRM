const { Application, Document, sequelize, Admission } = require('../models');
const { Op } = require('sequelize');

async function getPendingApplications(req, res) {
    try {
        const existingAdmissions = await Admission.findAll({
            attributes: ['applicantId'],
            where: { applicantId: { [Op.ne]: null } },
            raw: true,
        });
        const alreadyAllocatedIds = existingAdmissions.map(({ applicantId }) => applicantId);
        const where = { status: 'DOC_VERIFIED' };
        if (alreadyAllocatedIds.length > 0) {
            where.id = { [Op.notIn]: alreadyAllocatedIds };
        }

        const applications = await Application.findAll({
            where,
        });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function verifyDocuments(req, res) {
    const t = await sequelize.transaction();
    try {
        const { applicantId, decision } = req.body;
        if (!applicantId || !['APPROVE', 'REJECT'].includes(decision)) {
            throw new Error('Applicant and a valid review decision are required');
        }

        const application = await Application.findByPk(applicantId, {
            transaction: t,
            lock: t.LOCK.UPDATE,
        });
        if (!application) {
            throw new Error('Applicant not found');
        }
        if (application.status !== 'REGISTERED') {
            throw new Error('This application is no longer awaiting document review');
        }

        const pendingDocument = await Document.findOne({
            where: { applicantId, status: 'PENDING' },
            transaction: t,
        });
        if (!pendingDocument) {
            throw new Error('No pending documents found for this applicant');
        }

        const approved = decision === 'APPROVE';
        await Document.update(
            { status: approved ? 'VERIFIED' : 'REJECTED' },
            { where: { applicantId, status: 'PENDING' }, transaction: t }
        );
        application.status = approved ? 'DOC_VERIFIED' : 'DOC_REJECTED';
        await application.save({ transaction: t });

        await t.commit();
        res.json({
            message: approved ? 'Documents approved successfully' : 'Documents rejected successfully',
            decision,
        });
    } catch (error) {
        await t.rollback();
        res.status(error.message.includes('required') || error.message.includes('not found') || error.message.includes('pending') || error.message.includes('no longer') ? 400 : 500).json({ error: error.message });
    }
}

async function registerApplication(req, res) {
    const t = await sequelize.transaction();
    try {
        const { firstName, lastName, email, phone, category, entryType, quotaType, marks } = req.body;

        // 1. Create Application
        const application = await Application.create({
            firstName,
            lastName,
            email,
            phone,
            category,
            entryType,
            quotaType,
            marks,
            status: 'REGISTERED'
        }, { transaction: t });
      
         await Document.create(
           {
             applicantId: application.id,
             docName: "General Documents (ID, Marks Cards)",
             status: "PENDING",
           },
           { transaction: t },
         );
        await t.commit();
        res.status(201).json({ message: 'Application registered successfully', application });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: error.message });
    }
}

module.exports = { getPendingApplications, verifyDocuments, registerApplication };
