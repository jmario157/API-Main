const Sequelize = require("sequelize");

const db = require("../../Config/db");

const Denominacion = db.define(
  "denominacion",
  {
    nombre: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: {
        args: true,
        msg: "Ya está registrado este nombre.",
      },
      validate: {
        notEmpty: { msg: "Debe escribir el nombre de la denominación." },
      },
    },
    valor: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    tipo: {
      type: Sequelize.ENUM('BI', 'MO'), //BI=billetes, MO=monedas
      allowNull: true,
      defaultValue: 'BI',
    },
  },
  {
    tableName: "denominaciones",
  }
);

module.exports = Denominacion;
