const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { application } = require('express');

const Document = sequelize.define('Document', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    applicantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    docName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'VERIFIED', 'SUBMITTED'),
        defaultValue: 'PENDING',
    }
}, {
    tableName: 'documents',
    timestamps: false,
    underscored: true,
})

module.exports = Document;