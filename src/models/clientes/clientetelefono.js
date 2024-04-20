const Sequelize = require("sequelize");

const db = require("../../Config/db");

const ClienteTelefono = db.define(
  "clientetelefono",
  {
    numero: {
      type: Sequelize.STRING(15),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Debe escribir el numero de telefono." },
      },
    },
  },
  {
    tableName: "clientetelefonos",
  }
);

module.exports = ClienteTelefono;
