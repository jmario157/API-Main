const Sequelize = require("sequelize");

const db = require("../../Config/db");

const Municipio = db.define(
  "municipio",
  {
    nombre: {
      type: Sequelize.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Debe escribir el nombre del municipio." },
      },
    },
    numero: {
      type: Sequelize.STRING(6),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Debe escribir el nombre del municipio." },
      },
    },

  },
  {
    tableName: "municipios",
  }
);

module.exports = Municipio;
