const Caja = require('./caja');
const Moneda = require('./moneda');
const Denominacion = require('./denominacion');
const Estacion = require('../configuracion/estacion');
const Apertura = require('../cajas/apertura');
const Usuario = require('../empleados/usuario');
const Cierre = require('../cajas/cierre');
/**
* @module cajas
* @description Lista de modelos del modulo de cajas
*/
exports.Cajas= async () =>{
  Estacion.hasMany(Caja);
  Caja.belongsTo(Estacion);
  Moneda.hasMany(Denominacion);
  Denominacion.belongsTo(Moneda);
  Caja.hasMany(Apertura);
  Apertura.belongsTo(Caja);
  Usuario.hasMany(Apertura);
  Apertura.belongsTo(Usuario);
  Caja.hasMany(Cierre);
  Cierre.belongsTo(Caja);
  Usuario.hasMany(Cierre);
  Cierre.belongsTo(Usuario);
  Apertura.hasMany(Cierre);
  Cierre.belongsTo(Apertura);
  await Estacion.sync().then(() => {
    console.log('Modelo Estacion creado correctamente');
  })
    .catch((er) => {
      console.log("Error al crear el modelo Estacion");
      console.log(er);
    });
  await Caja.sync().then(() => {
    console.log('Modelo Caja creado correctamente');
  })
    .catch((er) => {
      console.log("Error al crear el modelo Caja");
      console.log(er);
    });
  await Moneda.sync().then(() => {
    console.log('Modelo Moneda creado correctamente');
  })
    .catch((er) => {
      console.log("Error al crear el modelo Moneda");
      console.log(er);
    });
  await Denominacion.sync().then(() => {
    console.log('Modelo Denominacion creado correctamente');
  })
    .catch((er) => {
      console.log("Error al crear el modelo Denominacion");
      console.log(er);
    });
    await Apertura.sync().then(() => {
      console.log('Modelo Apertura creado correctamente');
    })
      .catch((er) => {
        console.log("Error al crear el modelo Apertura");
        console.log(er);
      });
      await Cierre.sync().then(() => {
        console.log('Modelo Cierre creado correctamente');
      })
        .catch((er) => {
          console.log("Error al crear el modelo Cierre");
          console.log(er);
        });
    
}