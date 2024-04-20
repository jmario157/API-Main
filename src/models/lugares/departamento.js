const Sequelize = require("sequelize");

const db = require("../../Config/db");

const Departamento = db.define(
  "departamento",
  {
    nombre: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: {
        args: true,
        msg: "Ya está registrado este departamento.",
      },
      validate: {
        notEmpty: { msg: "Debe escribir el nombre del departamento." },
      },
    },
    numero: {
      type: Sequelize.STRING(3),
      allowNull: false,
      unique: {
        args: true,
        msg: "Ya está registrado este departamento.",
      },
      validate: {
        notEmpty: { msg: "Debe escribir el nombre del departamento." },
      },
    },
  },
  {
    tableName: "departamentos",
  }
);

module.exports = Departamento;
