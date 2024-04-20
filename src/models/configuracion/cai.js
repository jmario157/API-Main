const Sequelize = require("sequelize");

const db = require("../../Config/db");

const Cai = db.define(
  "cai",
  {
    cai: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: {
        args: true,
        msg: "Ya está registrado este cai.",
      },
      validate: {
        notEmpty: { msg: "Debe escribir el cai." },
      },
    },
    fechalimite: {
      type: Sequelize.DATE,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Debe escribir la fecha limite." },
      },
    },
    numeroinicial: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Debe escribir el numero inicial." },
      },
    },
    numerofinal: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Debe escribir el numero final." },
      },
    },
    estado: {
      type: Sequelize.BOOLEAN,//AB=Abierta, CE=Cerrada
      defaultValue: true,
    },
  },
  {
    tableName: "cai",
  }
);

module.exports = Cai;
