const Sequelize = require('sequelize');
const db = require('../../Config/db');

const Proveedor = db.define('Proveedor', {
    nombreProveedor: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: {msg: "Porvafor introduzca un nombre"}
        },
    },
    direccionProveedor: {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {msg: "Porvafor introduzca la direccion del proveedor"},
        },
    },
    telefonoProveedor: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: {
            args: true,
            msg: "Ya está registrado este telefono.",
        },
        validate: {
            notEmpty: { msg: "Debe escribir el numero de telefono." },
        },
    },
    correoProveedor: {
        type: Sequelize.STRING,
        allowNull: false,
        validate : {
            isEmail: { msg: "Correo no válido" }
        }
    }
},
{
    tableName: "proveedor",
}
);

module.exports = Proveedor;