const Sequelize = require("sequelize");

const db = require("../../Config/db");

const Lugar = db.define(
  "lugar",
  {
    nombre: {
      type: Sequelize.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Debe escribir el nombre del lugar." },
      },
    },

  },
  {
    tableName: "lugares",
  }
);

module.exports = Lugar;
