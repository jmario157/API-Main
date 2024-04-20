const Sequelize = require("sequelize");
const ModeloCaja = require('./caja');
const ModeloPago = require ('../pagos/pago');

const db = require("../../Config/db");

const Cierre = db.define(
  "cierre",
  {
    efectivo: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    pos: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    transferencias: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    efectivosistema: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    possistema: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    transferenciassistema: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    anulado: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "cierres",
    hooks: {
      afterCreate(cierre) {
        ModeloCaja.update(
          { estado: 'CE' },
          { where: { id: cierre.cajaId } }
        );
        ModeloPago.update(
          { cierreId: cierre.id },
          { where: { cierreId: null } }
        );
      },
    },
  }
);

module.exports = Cierre;
