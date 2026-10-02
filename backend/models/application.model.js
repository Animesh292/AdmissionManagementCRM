const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Application = sequelize.define("Application", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
  },
  lastName: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.STRING,
  },
  category: {
    type: DataTypes.ENUM("GM", "SC", "ST", "OBC"),
  },
  entryType: {
    type: DataTypes.ENUM("REGULAR", "LATERAL"),
  },
  quotaType: {
    type: DataTypes.ENUM("KCET", "COMEDK", "MANAGEMENT"),
  },
  marks: {
    type: DataTypes.DECIMAL(5, 2),
  },
  status: {
    type: DataTypes.ENUM(
      "REGISTERED",
      "DOC_VERIFIED",
      "DOC_REJECTED",
      "SEAT_ALLOCATED",
      "ADMISSION_CONFIRMED",
    ),
    defaultValue: "REGISTERED",
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: "applicants",
  timestamps: false,
  underscored: true,
});

module.exports = Application;
