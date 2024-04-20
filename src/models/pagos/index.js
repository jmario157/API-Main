
const Cliente = require('../clientes/cliente');
const Usuario = require('../empleados/usuario');
const Pago = require('./pago');
const PagoEfectivo = require('./pagoefectivo');
const PagoTransferencia = require('./pagotransferencia');
const PagoTarjeta = require('./pagotarjeta');
const Cuenta = require('../bancos/cuenta');
const Pos = require('../bancos/pos');
const Cierre = require('../cajas/cierre');
const Caja = require('../cajas/caja');
/**
* @module pagos
* @description Lista de modelos del modulo de pagos
*/
exports.Pagos = async () => {
  Cliente.hasMany(Pago);
  Pago.belongsTo(Cliente);
  Usuario.hasMany(Pago);
  Pago.belongsTo(Usuario);
  Cierre.hasMany(Pago);
  Pago.belongsTo(Cierre);
  Caja.hasMany(Pago);
  Pago.belongsTo(Caja);

  Pago.hasMany(PagoEfectivo);
  PagoEfectivo.belongsTo(Pago);
  Pago.hasMany(PagoTransferencia);
  PagoTransferencia.belongsTo(Pago);
  Cuenta.hasMany(PagoTransferencia);
  PagoTransferencia.belongsTo(Cuenta);
  Pago.hasMany(PagoTarjeta);
  PagoTarjeta.belongsTo(Pago);
  Pos.hasMany(PagoTarjeta);
  PagoTarjeta.belongsTo(Pos);

  
  await Pago.sync().then(() => {
    console.log('Modelo Pago creado correctamente');
  })
    .catch((er) => {
      console.log("Error al crear el modelo Pago");
      console.log(er);
    });
  await PagoEfectivo.sync().then(() => {
    console.log('Modelo Pagoefectivo creado correctamente');
  })
    .catch((er) => {
      console.log("Error al crear el modelo Pagoefectivo");
      console.log(er);
    });
  await PagoTransferencia.sync().then(() => {
    console.log('Modelo Pagotransferencia creado correctamente');
  })
    .catch((er) => {
      console.log("Error al crear el modelo Pagotransferencia");
      console.log(er);
    });
    await PagoTarjeta.sync().then(() => {
      console.log('Modelo PagoTarjeta creado correctamente');
    })
      .catch((er) => {
        console.log("Error al crear el modelo PagoTarjeta");
        console.log(er);
      });
}