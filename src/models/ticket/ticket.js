const Sequelize = require('sequelize');
const db = require('../../Config/db');

const Ticket = db.define('Ticket', {
    titulo: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    descripcion: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    activo: {
        type: Sequelize.BOOLEAN, 
        allowNull: true,
        defaultValue: true,
    },
},
{
    tableName: 'ticket',
});

module.exports = Ticket;