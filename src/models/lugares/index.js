const Pais = require('./pais');
const Departamento = require('./departamento');
const Municipio = require('./municipios');
const Lugar = require('./lugar');
/**
* @module lugares
* @description Lista de modelos del modulo de lugares
*/
exports.Lugares = async ()=>{
  Pais.hasMany(Departamento);
  Departamento.belongsTo(Pais);
  Departamento.hasMany(Municipio);
  Municipio.belongsTo(Departamento);
  Municipio.hasMany(Lugar);
  Lugar.belongsTo(Municipio);
  await Pais.sync().then(() => {
    console.log('Modelo Paises creado correctamente');
  })
    .catch((er) => {
      console.log("Error al crear el modelo Paises");
      console.log(er);
    });
  await Departamento.sync().then(() => {
    console.log('Modelo Departamentos creado correctamente');
  })
    .catch((er) => {
      console.log("Error al crear el modelo Departamentos");
      console.log(er);
    });
  await Municipio.sync().then(() => {
    console.log('Modelo Municipio creado correctamente');
  })
    .catch((er) => {
      console.log("Error al crear el modelo Municipio");
      console.log(er);
    });
  await Lugar.sync().then(() => {
    console.log('Modelo Lugares creado correctamente');
  })
    .catch((er) => {
      console.log("Error al crear el modelo Lugares");
      console.log(er);
    });
}
