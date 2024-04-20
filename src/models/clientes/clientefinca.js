const Sequelize = require("sequelize");

const db = require("../../Config/db");

const ClienteFinca = db.define(
  "clienteFinca",
  {
    nombre: {
      type: Sequelize.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Debe escribir el nombre de la finca." },
      },
    },
  },
  {
    tableName: "clientefincas",
  }
);

module.exports = ClienteFinca;
