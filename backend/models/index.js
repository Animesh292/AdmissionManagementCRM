const sequelize = require('../config/db');

const Institution = require('./institution.model');
const Campus = require('./campus.model');
const Department = require('./department.model');
const Admission = require('./admission.model');
const Program = require('./program.model');
const Application = require('./application.model');
const Document = require('./document.model');
const Quota = require('./quota.model');

// Associations
Institution.hasMany(Campus, { foreignKey: "institutionId" });
Campus.belongsTo(Institution, { foreignKey: "institutionId" });

Campus.hasMany(Department, { foreignKey: "campusId" });
Department.belongsTo(Campus, { foreignKey: "campusId" });

Department.hasMany(Program, { foreignKey: "departmentId" });
Program.belongsTo(Department, { foreignKey: "departmentId" });

Program.hasMany(Quota, { foreignKey: "programId" });
Quota.belongsTo(Program, { foreignKey: "programId" });

Application.hasMany(Document, { foreignKey: "applicantId" });
Document.belongsTo(Application, { foreignKey: "applicantId" });

Application.hasOne(Admission, { foreignKey: "applicantId" });
Admission.belongsTo(Application, { foreignKey: "applicantId" });

Program.hasMany(Admission, { foreignKey: "programId" });
Admission.belongsTo(Program, { foreignKey: "programId" });

Quota.hasMany(Admission, { foreignKey: "quotaId" });
Admission.belongsTo(Quota, { foreignKey: "quotaId", as: "Quota" });

module.exports = {
    Institution,
    Campus,
    Department,
    Program,
    Quota,
    Application,
    Document,
    Admission,
    sequelize,
};