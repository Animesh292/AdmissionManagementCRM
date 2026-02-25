const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Quota = sequelize.define(
  "Quota",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    programId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quotaType: {
      type: DataTypes.ENUM("KCET", "COMEDK", "MANAGEMENT"),
    },
    totalSeats: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    filledSeats: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "quota",
    timestamps: false,
    underscored: true,
  },
);

module.exports = Quota;