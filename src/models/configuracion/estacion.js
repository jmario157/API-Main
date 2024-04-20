const Sequelize = require("sequelize");

const db = require("../../Config/db");

const Estacion = db.define(
  "estacion",
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
    ip: {
      type: Sequelize.STRING(20),
      allowNull: false,
      unique: {
        args: true,
        msg: "Ya está registrada esta dirección IP.",
      },
      validate: {
        notEmpty: { msg: "Debe escribir la IP." },
      },
    },
    estado: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "estaciones",
  }
);

module.exports = Estacion;
