const Sequelize = require('sequelize');
const db = require('../../Config/db');

const Factura = db.define('Factura', {
    fechaEmision: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    tipoPago: {
        type: Sequelize.ENUM('Efectivo', 'Tarjeta', 'Transferencia'),
        allowNull: false,
        defaultValue: 'Efectivo'
    },
},
{
    tableName: 'factura',
});

module.exports = Factura;