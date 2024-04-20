const Sequelize = require("sequelize");

const db = require("../../Config/db");

const Pago = db.define(
  "pago",
  {
    fecha: {
      type: Sequelize.DATE,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Debe escribir la fecha de pago." },
      },
    },
    pago: {
      type: Sequelize.DOUBLE,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Debe escribir valor pagado." },
      },
    },
    recibido: {
      type: Sequelize.DOUBLE,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Debe escribir valor recibido." },
      },
    },
    descripcion: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    tipo:{
      type: Sequelize.ENUM('PR','CU','CA'),
      allowNull: false,
    },
    anulado:{
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
  },
  {
    tableName: "pagos",
    timestamps: true,
  }
);

module.exports = Pago;
