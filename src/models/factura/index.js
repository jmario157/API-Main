const Factura = require('./factura');
const NotaPeso = require('../notaPeso/notaPeso');

exports.Factura = async () => {
    Factura.hasMany(NotaPeso);
    //NotaPeso.belongsTo(Factura);

    await Factura.sync().then(() => {
        console.log('Modelo Factura creado correctamente');
    }).catch((er) => {
        console.log("Error al crear el modelo Factura");
        console.log(er);
    });
}
