const Sequelize = require("sequelize");

const db = require("../../Config/db");

const Empresa = db.define("empresa", {
  nombre: {
    type: Sequelize.STRING,
    validate: {
      allowNull(value) {
        if (!value) {
          throw new Error('No se permiten valores nulos en el nombre.');
        }
      },
    }
  },
  direccion: {
    type: Sequelize.STRING
  },
  correo: {
    type: Sequelize.STRING,
    unique: {
      args: true,
      msg: 'Ya está registrado este correo.'
    },
    allowNull: false,
    validate: {
      isEmail: {
        args: true,
        msg: "Debe escribir una dirección de correo valida."
      },
      notNull: {
        msg: "Debe escribir una direccion de correo."
      }
    },
  },
  imagen: {
    type: Sequelize.STRING,
    defaultValue: "assets/images/empresaXdefecto.png"
  },
  activo: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
},
  {
    tableName: "empresas",
  }
);
module.exports = Empresa;
