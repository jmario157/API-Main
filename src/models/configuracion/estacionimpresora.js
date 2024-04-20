const Sequelize = require("sequelize");

const db = require("../../Config/db");

const EstacionImpresora = db.define(
  "estacionimpresora",
  {
    nombre: {
      type: Sequelize.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Debe escribir el nombre de la impresora." },
      },
    },
  },
  {
    tableName: "estacionimpresoras",
  }
);

module.exports = EstacionImpresora;
