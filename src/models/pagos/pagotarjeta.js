const Sequelize = require("sequelize");

const db = require("../../Config/db");

const PagoTarjeta = db.define(
  "pagotarjeta",
  {
    monto: {
      type: Sequelize.DOUBLE,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Debe escribir monto pagado." },
      },
    },
    referencia: {
      type: Sequelize.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Debe escribir la referencia." },
      },
    },
  },
  {
    tableName: "pagotarjetas",
  }
);

module.exports = PagoTarjeta;
