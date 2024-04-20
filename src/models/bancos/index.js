const Banco = require('./banco');
const Cuenta = require('./cuenta');
const Pos = require('./pos');
/**
* @module bancos
* @description Lista de modelos del modulo de bancos
*/
exports.Bancos = async () => {
    Banco.hasMany(Cuenta);
    Cuenta.belongsTo(Banco);
    Cuenta.hasMany(Pos);
    Pos.belongsTo(Cuenta);
    await Banco.sync().then(() => {
        console.log('Modelo Banco creado correctamente');
    })
        .catch((er) => {
            console.log("Error al crear el modelo Banco");
            console.log(er);
        });
    await Cuenta.sync().then(() => {
        console.log('Modelo Cuenta creado correctamente');
    })
        .catch((er) => {
            console.log("Error al crear el modelo Cuenta");
            console.log(er);
        });
        await Pos.sync().then(() => {
            console.log('Modelo Pos creado correctamente');
        })
            .catch((er) => {
                console.log("Error al crear el modelo Pos");
                console.log(er);
            });
};