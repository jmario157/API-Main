const Sequelize = require("sequelize");

const db = require("../../Config/db");

const bcrypt = require("bcrypt");

const UsuarioAcceso = db.define(
  "usuarioacceso",
  {
    ruta:{
      type: Sequelize.STRING(250),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Debe escribir una ruta de acceso." },
      },
    },
    permisos:{
      type: Sequelize.STRING(500),
      allowNull: true,
      defaultValue: "Listar,Guardar,Editar"
    },
    activo: {
      type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true,
    },
  },
  {
    tableName: "usuarioaccesos",
  }
);

module.exports = UsuarioAcceso;
