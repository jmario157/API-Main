const Sequelize = require("sequelize");

const db = require("../../Config/db");

const Pos = db.define(
  "pos",
  {
    nombre: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    activo: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
  },
  {
    tableName: "pos",
  }
);

module.exports = Pos;
