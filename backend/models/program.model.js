const { DataTypes, ENUM } = require('sequelize');
const sequelize = require('../config/db');

const Program = sequelize.define('Program', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    courseType: {
        type: ENUM('UG', 'PG'),
        allowNull: false,
    },
    academicYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    intake: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    departmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'programs',
    timestamps: false,
    underscored: true,
});

module.exports = Program;