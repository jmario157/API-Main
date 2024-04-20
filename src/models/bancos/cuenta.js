const Sequelize = require("sequelize");

const db = require("../../Config/db");

const Cuenta = db.define(
  "cuenta",
  {
    numero: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    nombre: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    activo: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
  },
  {
    tableName: "cuentas",
  }
);

module.exports = Cuenta;
