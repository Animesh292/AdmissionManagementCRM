const { Application, Document, sequelize } = require('../models');
const { Op } = require('sequelize');

async function getPendingApplications(req, res) {
    try {
        // Applications that are REGISTERED or DOC_VERIFIED but not yet ALLOCATED
        const applications = await Application.findAll({
            where: {
                status: {
                    [Op.in]: ['REGISTERED', 'DOC_VERIFIED']
                }
            }
        });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function verifyDocuments(req, res) {
    const t = await sequelize.transaction();
    try {
        const { applicantId } = req.body;

        // 1. Update Application status
        await Application.update(
            { status: 'DOC_VERIFIED' },
            { where: { id: applicantId }, transaction: t }
        );

        // 2. Update all documents status for this applicant
        await Document.update(
            { status: 'VERIFIED' },
            { where: { applicantId: applicantId }, transaction: t }
        );

        await t.commit();
        res.json({ message: 'Documents verified and application status updated successfully' });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: error.message });
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

        // 2. Create default Document record in PENDING status
        await Document.create({
            applicantId: application.id,
            docName: 'General Documents (ID, Marks Cards)',
            status: 'PENDING'
        }, { transaction: t });

        await t.commit();
        res.status(201).json({ message: 'Application registered successfully', application });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: error.message });
    }
}

module.exports = { getPendingApplications, verifyDocuments, registerApplication };
