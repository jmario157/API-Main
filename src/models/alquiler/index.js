const Alquiler = require('./alquiler');

/**
 * @module alquiler
 * @description Lista de modelos del módulo de alquiler
 */
exports.Alquiler = async () => {
    // Definición y relación de modelos de alquiler
    await Alquiler.sync().then(() => {
        console.log('Modelo Alquiler creado correctamente');
    })
    .catch((err) => {
        console.log("Error al crear el modelo Alquiler");
        console.log(err);
    });
};
