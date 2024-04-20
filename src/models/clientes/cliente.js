const Sequelize = require("sequelize");

const db = require("../../Config/db");

const Cliente = db.define(
  "cliente",
  {
    identidad: {
      type: Sequelize.STRING(18),
      allowNull: false,
      unique: {
        args: true,
        msg: "Ya está registrado esta identidad.",
      },
      validate: {
        notEmpty: { msg: "Debe escribir la identidad del cliente." },
      },
    },
    nombreprimer: {
      type: Sequelize.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Debe escribir el nombre." },
      },
    },
    nombresegundo: {
      type: Sequelize.STRING(50),
      allowNull: true,
    },
    apellidoprimer: {
      type: Sequelize.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Debe escribir el apellido." },
      },
    },
    apellidosegundo: {
      type: Sequelize.STRING(50),
      allowNull: true,
    },
    direccion: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    genero:{
      type: Sequelize.ENUM('M', 'F'),
      allowNull: false,
    },
    activo: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
    Imagen: {
      type: Sequelize.STRING(250),
      allowNull: true,
      defaultValue: "ClienteSinImagen.png", 
  },
  },
  {
    tableName: "clientes",
  }
);

module.exports = Cliente;
