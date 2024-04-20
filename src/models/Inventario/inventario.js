const Sequelize = require('sequelize');
const db = require('../../Config/db');

const Inventario = db.define('Inventario', {
},
{
    tableName: 'inventario',
});

module.exports = Inventario;
