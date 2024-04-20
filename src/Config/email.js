/**
 * Configuración de Nodemailer para enviar correos electrónico
 * @author Alessandro Cardona
 * @date 2021 - 02 - 20
 * @namespace config/email
 */

/**
 * @memberof config/email
 * @method configuracionCorreoElectronico
 * @param {string} SERVICE_EMAIL Proveedor de correo electrónico
 * @param {email} USER_EMAIL Dirección del correo electrónico
 * @param {string} PASS_EMAIL Contraseña del correo electrónico
 * @description Configuración de las variables para el correo electrónico
 * estas variables son llamadas en el archivo helpers/email.js
 */

// Conguracion para la conexion con el proveedor de correo electrónico
module.exports = {
  service: process.env.SERVICE_EMAIL,
  user: process.env.USER_EMAIL,
  pass: process.env.PASS_EMAIL,
};
