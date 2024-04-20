const Sequelize = require("sequelize");

const db = require("../../Config/db");

const Cargo = db.define(
  "cargo",
  {
    nombre: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: {
        args: true,
        msg: "Ya está registrado este cargo.",
      },
      validate: {
        notEmpty: { msg: "Debe escribir el nombre del cargo." },
      },
    },
    descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    activo: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },

    Imagen: {
      type: Sequelize.STRING(250),
      allowNull: true,
    },
  },
  {
    tableName: "cargos",
  }
);

module.exports = Cargo;
