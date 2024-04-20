const Sequelize = require('sequelize');
const db = require('../../Config/db');

const Detalle = db.define('Detalle', {
    pesada: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {msg: "Por favor ingrese la pesada"}
        }
    },
    cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {msg: "Por favor introduzca la cantidad"}
        },
    },
    pesoBruto: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
            notEmpty: {msg: "Por favor introduzca el peso"}
        },
    },
    tara: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
            notEmpty: {msg: "Por favor introduzca la tara"}
        },
    }, 
    pesoNeto: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
            notEmpty: {msg: "Por favor introduzca el total"}
        },
    },
},
{
    tableName: 'detalleNota'
});

module.exports = Detalle;
