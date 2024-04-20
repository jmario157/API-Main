const Sequelize = require("sequelize");
const ModeloCaja = require('./caja');

const db = require("../../Config/db");

const Apertura = db.define(
  "apertura",
  {
    efectivo: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    cierre: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    anulado: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "aperturas",
    timestamps: true,
    hooks: {
      afterCreate(apertura) {
        ModeloCaja.update(
          { estado: 'AB' },
          { where: { id: apertura.cajaId } }
        );
      },
    },
  }
);

module.exports = Apertura;
