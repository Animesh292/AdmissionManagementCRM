const { Program, Quota, Admission, Application, Document } = require("../models");

//Intake vs Admitted
async function getIntakeVsAdmitted() {
    const programs = await Program.findAll({
        attributes: ["id", "name", "intake"],
        include: [
            {
                model: Admission,
                attributes: ["id"],
                where: { confirmed: true },
                required: false
            },
        ],
    })

    return programs.map(program => ({
        programId: program.id,
        programName: program.name,
        intake: program.intake,
        admitted: program.Admissions ? program.Admissions.length : 0,
    }));
};

//Quota wise filled seats
async function getQuotaSeatStatus() {
    const quotas = await Quota.findAll({
        attributes: ["id", "quotaType", "totalSeats", "programId"],
        include: [
            {
                model: Admission,
                attributes: ["id"],
                required: false
            }
        ]
    });

    return quotas.map(quota => {
        const filledSeats = quota.Admissions ? quota.Admissions.length : 0;
        return {
            quotaId: quota.id,
            quotaType: quota.quotaType,
            totalSeats: quota.totalSeats,
            filledSeats: filledSeats,
            remainingSeats: quota.totalSeats - filledSeats,
            programId: quota.programId
        };
    });
}

async function getPendingDocuments() {
    const applicants = await Application.findAll({
        include: [
            {
                model: Document,
                where: { status: "PENDING" },
                required: true
            },
        ],
    });
    return applicants;
}

async function getFeePendingAdmissions() {
    return await Admission.findAll({
        where: { feeStatus: "PENDING" },
        include: [
            { model: Application },
            { model: Program },
            { model: Quota, as: 'Quota' }
        ],
    });
}

async function getPaidAdmissions() {
    return await Admission.findAll({
        where: { feeStatus: "PAID", confirmed: false },
        include: [
            { model: Application },
            { model: Program },
            { model: Quota, as: 'Quota' }
        ],
    });
}

async function getConfirmedAdmissions() {
    return await Admission.findAll({
        where: { confirmed: true },
        include: [
            { model: Application },
            { model: Program },
            { model: Quota, as: 'Quota' }
        ],
        order: [['createdAt', 'DESC']]
    });
}

module.exports = {
    getIntakeVsAdmitted,
    getQuotaSeatStatus,
    getPendingDocuments,
    getFeePendingAdmissions,
    getPaidAdmissions,
    getConfirmedAdmissions
}
