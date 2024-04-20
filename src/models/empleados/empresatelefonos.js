const Sequelize = require("sequelize");

const db = require("../../Config/db");

const EmpresaTelefono = db.define("empresatelefono", {
    telefono: {
        type: Sequelize.STRING,
        validate: {
            allowNull(value) {
                if (!value) {
                    throw new Error('No se permiten valores nulos en el número de teléfono.');
                }
            },
            is: {
                args: [/^[0-9]+$/],
                msg: "Número de teléfono invalido. Escriba su solo números."
            },
        }
    },
},
    {
        tableName: "empresatelefonos",
    }
);
module.exports = EmpresaTelefono;
