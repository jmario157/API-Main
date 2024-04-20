/**
 * Configuracion de CORS
 * @author Alessandro Cardona
 * @date 2021 - 02 - 20
 * @namespace config/cors
 */

/**
 * @memberof config/cors
 * @function config
 * @description objeto que contiene la configuración de cors para el servidor, esta configuración es llamada en el archivo app.js
 */
const config = {
  application: {
    cors: {
      server: [
        {
          origin: "*", //servidor que deseas que consuma o (*) en caso que sea acceso libre
          credentials: true,
          
        },
      ],
    },
  },
};

module.exports = config;
