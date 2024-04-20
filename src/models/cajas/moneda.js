const Sequelize = require("sequelize");

const db = require("../../Config/db");

const Moneda = db.define(
  "moneda",
  {
    nombre: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: {
        args: true,
        msg: "Ya está registrado este nombre.",
      },
      validate: {
        notEmpty: { msg: "Debe escribir el nombre de la moneda." },
      },
    },
    simbolo: {
      type: Sequelize.STRING(3),
      allowNull: false,
    },
    tipoCambio: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    nacional: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
    activo: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
  },
  {
    tableName: "monedas",
  }
);

module.exports = Moneda;
