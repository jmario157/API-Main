const Sequelize = require("sequelize");

const db = require("../../Config/db");

const Empleado = db.define(
    "empleado",
    {
        identidad: {
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: {
                args: true,
                msg: "Ya está registrado este numero de identidad.",
              },
            validate: {
                notEmpty: { msg: "Debe escribir el numero de identidad." },
            },
        },
        primernombre: {
            type: Sequelize.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: { msg: "Debe escribir el primer nombre." },
            },
        },
        segundonombre: {
            type: Sequelize.STRING(50),
            allowNull: true,
        },
        primerapellido: {
            type: Sequelize.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: { msg: "Debe escribir el primer apellido." },
            },
        },
        segundoapellido: {
            type: Sequelize.STRING(50),
            allowNull: true,
        },
        salario: {
            type: Sequelize.DOUBLE,
            allowNull: true,
            defaultValue: 0,
        },
        fechaingreso: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        },
        activo: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
        },
        Imagen: {
            type: Sequelize.STRING(250),
            allowNull: true,
            defaultValue: "EmpleadoSinImagen.png", 
        },
    },
    {
        tableName: "empleados",
    }
);

module.exports = Empleado;
