const Sequelize = require('sequelize');
const db = require('../../Config/db');

const Nota = db.define('Nota', {
    fechaIngreso: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    estado: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true,
    },
},
{
    tableName: 'notaPeso'
});

module.exports=Nota; 
