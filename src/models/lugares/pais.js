const Sequelize = require("sequelize");

const db = require("../../Config/db");

const Pais = db.define(
  "pais",
  {
    nombre: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: {
        args: true,
        msg: "Ya está registrado este pais.",
      },
      validate: {
        notEmpty: { msg: "Debe escribir el nombre del pais." },
      },
    },
    numero: {
      type: Sequelize.STRING(3),
      allowNull: false,
      unique: {
        args: true,
        msg: "Ya está registrado este codigo de pais.",
      },
      validate: {
        notEmpty: { msg: "Debe escribir el codigo del pais." },
      },
    },
  },
  {
    tableName: "paises",
  }
);

module.exports = Pais;
