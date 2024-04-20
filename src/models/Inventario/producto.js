const Sequelize = require('sequelize');
const db = require('../../Config/db');

const Producto = db.define('Producto', {
    fechaEntrada: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    tipoProducto: {
        type: Sequelize.ENUM('Cafe en uva', 'Cafe en oro', 'Cafe pergamino humedo', 'Cafe pergamino seco'),
        allowNull: false,
        defaultValue: 'Cafe en uva'
    },
    cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {msg: "Por favor introduzca la cantidad"}
        },
    },
    pesoUnidad: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
            notEmpty: {msg: "Por favor introduzca el peso"}
        },
    },
    medidaPeso: {
        type: Sequelize.ENUM('kg', 'lb'),
        allowNull: false,
        defaultValue: 'kg',
    },   
    total: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
            notEmpty: {msg: "Por favor introduzca el total"}
        },
    },
},
{
    tableName: 'producto',
});

module.exports = Producto;
