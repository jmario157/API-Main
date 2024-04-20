const Sequelize = require("sequelize");

const db = require("../../Config/db");

const Profesion = db.define(
  "profesion",
  {
    nombre: {
      type: Sequelize.STRING(15),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Debe escribir el nombre." },
      },
    },
  },
  {
    tableName: "profesiones",
  }
);

module.exports = Profesion;
