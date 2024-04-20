const Sequelize = require("sequelize");

const db = require("../../Config/db");

const PagoEfectivo = db.define(
  "pagoefectivo",
  {
    monto: {
      type: Sequelize.DOUBLE,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Debe escribir monto pagado." },
      },
    },
  },
  {
    tableName: "pagoefectivo",
  }
);

module.exports = PagoEfectivo;
