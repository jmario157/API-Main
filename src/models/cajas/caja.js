const Sequelize = require("sequelize");

const db = require("../../Config/db");

const Caja = db.define(
  "caja",
  {
    nombre: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: {
        args: true,
        msg: "Ya está registrado este nombre.",
      },
      validate: {
        notEmpty: { msg: "Debe escribir el nombre de la estación." },
      },
    },
    estado: {
      type: Sequelize.ENUM('AB', 'CE'),//AB=Abierta, CE=Cerrada
      defaultValue: 'CE',
    },
  },
  {
    tableName: "cajas",
  }
);

module.exports = Caja;
