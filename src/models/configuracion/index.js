const Estacion = require('./estacion');
const EstacionImpresora = require('./estacionimpresora');
const Cai = require('./cai');
/**
 * @module configuracion
 * @description Lista de modelos del modulo de configuracion
 */
exports.Configuracion = async () => {
  Estacion.hasMany(EstacionImpresora);
  EstacionImpresora.belongsTo(Estacion);
  await Estacion.sync().then(() => {
    console.log('Modelo Estacion creado correctamente');
  })
    .catch((er) => {
      console.log("Error al crear el modelo Estacion");
      console.log(er);
    });
  await EstacionImpresora.sync().then(() => {
    console.log('Modelo EstacionImpresora creado correctamente');
  })
    .catch((er) => {
      console.log("Error al crear el modelo EstacionImpresora");
      console.log(er);
    });
    await Cai.sync().then(() => {
      console.log('Modelo Cai creado correctamente');
    })
      .catch((er) => {
        console.log("Error al crear el modelo Cai");
        console.log(er);
      });
}