const Sequelize = require("sequelize");

const db = require("../../Config/db");

const PagoTransferencia = db.define(
  "pagotransferencia",
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
    tableName: "pagotransferencias",
  }
);

module.exports = PagoTransferencia;
