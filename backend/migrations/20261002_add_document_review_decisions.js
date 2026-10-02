const sequelize = require('../config/db');

async function migrate() {
    try {
        await sequelize.authenticate();
        await sequelize.query("ALTER TABLE documents MODIFY status ENUM('PENDING', 'VERIFIED', 'SUBMITTED', 'REJECTED') NOT NULL DEFAULT 'PENDING'");
        await sequelize.query("ALTER TABLE applicants MODIFY status ENUM('REGISTERED', 'DOC_VERIFIED', 'DOC_REJECTED', 'SEAT_ALLOCATED', 'ADMISSION_CONFIRMED') NOT NULL DEFAULT 'REGISTERED'");
        console.log('Document review decision statuses added');
    } finally {
        await sequelize.close();
    }
}

migrate().catch((error) => {
    console.error('Unable to apply document review migration:', error.message);
    process.exitCode = 1;
});