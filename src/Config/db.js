/**
 * Configuración de la base de datos
 * @author Alessandro Cardona
 * @date 2021 - 02 - 20
 * @namespace config/db
 */

const Sequelize = require("sequelize");

/**
 * @memberof config/db
 * @function db
 * @param {string} MYSQLDB Nombre de la base de datos
 * @param {string} MYSQLUSER Usuario correspondiente a la base de datos
 * @param {string} MYSQLPASS Contraseña del usuario
 * @param {string} MYSQLSERVERURL Dirección ip del servidor donde se encuentra la base de datos
 * @param {number} MYSQLPORT Puerto en el que escucha la base de datos
 * @returns Conexión a la base de datos, esta configuración es llamada en el archivo app.js
 * @description Configuración de la conexión para la base de datos, variables extraídas del archivo .env
 */
// Parametros para la base de datos
const db = new Sequelize(
  process.env.MYSQLDB,
  process.env.MYSQLUSER,
  process.env.MYSQLPASS,
  {
    host: process.env.MYSQLSERVERURL,
    dialect: "mysql",
    port: process.env.MYSQLPORT,
    operatorAliases: false,
    timezone: "America/Tegucigalpa",
    dialectOptions: {
      timezone: "local",
    },
    define: {
      timestamps: false,
    },
    pool: {
      acquire: 30000,
      idle: 10000,
      min: 0,
      max: 5,
    },
  }
);

module.exports = db;
