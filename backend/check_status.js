const { Admission } = require('./models');

async function check() {
    try {
        const a = await Admission.findByPk(8);
        console.log('--- Admission #8 ---');
        console.log(JSON.stringify(a, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
