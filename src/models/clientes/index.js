
const Cliente = require('./cliente');
const ClienteTelefono = require('./clientetelefono');
const Profesion = require('./profesion');
const Lugar = require('../lugares/lugar');
const ClienteFinca = require('./clientefinca');

/**
* @module clientes
* @description Lista de modelos del modulo de clientes
*/
exports.Clientes = async ()=>{
  Lugar.hasMany(Cliente);
  Cliente.belongsTo(Lugar);
  Profesion.hasMany(Cliente);
  Cliente.belongsTo(Profesion);
  Cliente.hasMany(ClienteTelefono);
  ClienteTelefono.belongsTo(Cliente);
  Cliente.hasMany(ClienteFinca);
  ClienteFinca.belongsTo(Cliente);
  Lugar.hasMany(ClienteFinca);
  ClienteFinca.belongsTo(Lugar);
  await Profesion.sync().then(() => {
    console.log('Modelo Profesion creado correctamente');
  })
    .catch((er) => {
      console.log("Error al crear el modelo Profesion");
      console.log(er);
    });
  await Cliente.sync().then(() => {
    console.log('Modelo Cliente creado correctamente');
  })
    .catch((er) => {
      console.log("Error al crear el modelo Cliente");
      console.log(er);
    });
  await ClienteTelefono.sync().then(() => {
    console.log('Modelo ClienteTelefono creado correctamente');
  })
    .catch((er) => {
      console.log("Error al crear el modelo ClienteTelefono");
      console.log(er);
    });
  await ClienteFinca.sync().then(() => {
    console.log('Modelo ClienteFinca creado correctamente');
  })
    .catch((er) => {
      console.log("Error al crear el modelo ClienteFinca");
      console.log(er);
    });
}
