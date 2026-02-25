const { Admission, Application, Program, Quota } = require('./models');

async function check() {
    try {
        const data = await Admission.findAll({
            where: { confirmed: true },
            include: [
                { model: Application },
                { model: Program },
                { model: Quota, as: 'Quota' }
            ]
        });
        console.log('--- Confirmed Admissions Data ---');
        console.log(JSON.stringify(data[0], null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
