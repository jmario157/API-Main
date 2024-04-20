const Sequelize = require("sequelize");

const db = require("../../Config/db");

const Banco = db.define(
  "banco",
  {
    nombre: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: {
        args: true,
        msg: "Ya está registrado este nombre.",
      },
      validate: {
        notEmpty: { msg: "Debe escribir el nombre del banco." },
      },
    },
    activo: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
  },
  {
    tableName: "bancos",
  }
);

module.exports = Banco;
