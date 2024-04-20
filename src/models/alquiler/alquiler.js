const Sequelize = require('sequelize');
const db = require('../../Config/db');

const Alquiler = db.define('Alquiler', {
    // Definición de las columnas de la tabla Alquiler
    maquinaria: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    duracion: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    costo: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
},
{
    tableName: "alquiler",
}
);

module.exports = Alquiler;
