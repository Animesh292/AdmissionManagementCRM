const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Admission = sequelize.define(
  "Admission",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    applicantId: {
      type: DataTypes.INTEGER,
    },
    programId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quotaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    feeStatus: {
      type: DataTypes.ENUM("PENDING", "PAID"),
      defaultValue: "PENDING",
    },
    admissionNumber: {
      type: DataTypes.STRING,
      unique: true,
    },
    confirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "admissions",
    timestamps: false,
    underscored: true,
  },
);



module.exports = Admission;