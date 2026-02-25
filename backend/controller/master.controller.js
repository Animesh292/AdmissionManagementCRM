const { Program, Quota, Admission } = require('../models');

async function getAllPrograms(req, res) {
    try {
        const programs = await Program.findAll();
        res.json(programs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getQuotasByProgram(req, res) {
    try {
        const { programId } = req.params;
        const quotas = await Quota.findAll({
            where: { programId },
            include: [{
                model: Admission,
                attributes: ["id"],
                where: { confirmed: true },
                required: false
            }]
        });

        const data = quotas.map(quota => {
            const filledSeats = quota.Admissions ? quota.Admissions.length : 0;
            return {
                ...quota.toJSON(),
                filledSeats // Override with dynamic count
            };
        });

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { getAllPrograms, getQuotasByProgram };
