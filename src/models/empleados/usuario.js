const Sequelize = require("sequelize"); 

const db = require("../../Config/db");

const bcrypt = require("bcrypt");

const Usuario = db.define(
  "usuario",
  {
    login:{
      type: Sequelize.STRING(250),
      allowNull: false,
      unique: {
        args: true,
        msg: "Ya está registrado este login.",
      },
      validate: {
        notEmpty: { msg: "Debe escribir un login." },
      },
    },
    correo: {
      type: Sequelize.STRING(250),
      allowNull: false,
      unique: {
        args: true,
        msg: "Ya está registrado este correo electrónico.",
      },
      validate: {
        notEmpty: { msg: "Debe escribir un correo electrónico." },
        isEmail: { msg: "Correo electrónico no valido" },
      },
    },

    gmail: {
      type: Sequelize.STRING(50),
      allowNull: true,
    },

    facebook: {
      type: Sequelize.STRING(50),
      allowNull: true,
    },

    contrasena: {
      type: Sequelize.STRING(250),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Debe escribir una contraseña" },
        /*         len: {
          args: [8 - 12],
          msg: "La contraseña debe tener entre 8 - 12 careacteres.",
        }, */
      },
    },

    logueado: {
      type: Sequelize.BOOLEAN, allowNull: true, defaultValue: false,
    },

    activo: {
      type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true,
    },
    estado: {
      type: Sequelize.ENUM('AC','IN','BL'), allowNull: true, defaultValue: 'AC',
    },
    pin: {
      type: Sequelize.CHAR(6), allowNull: true, defaultValue: '000000',
    },
    fallidos: {
      type: Sequelize.INTEGER, allowNull: true, defaultValue: 0,
    },
  },
  {
    tableName: "usuarios",
    hooks: {
      beforeCreate(usuario) {
        // Realizar el hash de la contraseña o password
        usuario.contrasena = bcrypt.hashSync(
          usuario.contrasena,
          bcrypt.genSaltSync(10)
        );
      },

      /* beforeUpdate(usuario) {
        usuario.contrasena = bcrypt.hashSync(
          usuario.contrasena,
          bcrypt.genSaltSync(10)
        );
      }, */
    },
  }
);

Usuario.prototype.comparePassword = (contrasenaData, contrasenaUser) => {
  return bcrypt.compareSync(contrasenaData, contrasenaUser);
};

Usuario.prototype.genHash = (contrasenaNueva) => {
  return bcrypt.hashSync(contrasenaNueva, bcrypt.genSaltSync(10));
};

module.exports = Usuario;
