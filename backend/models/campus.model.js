const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const Campus = sequelize.define('Campus', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    institutionId: {
        type: DataTypes.INTEGER,
        allowNull: false,   
    },
}, {
    tableName: 'campuses',
    timestamps: false,
})

module.exports = Campus;

