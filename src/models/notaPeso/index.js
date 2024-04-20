const NotaPeso = require('./notaPeso');
const Detalle = require('./detalleNota');
const Producto = require('../Inventario/producto');
const Cliente = require('../clientes/cliente')
const Factura = require('../factura/factura')

exports.NotaPeso = async () => {
    NotaPeso.belongsTo(Cliente);
    Cliente.hasMany(NotaPeso);
    NotaPeso.belongsTo(Producto);
    Producto.hasMany(NotaPeso);
    //Factura.hasMany(NotaPeso);
    NotaPeso.belongsTo(Factura);

    await NotaPeso.sync().then(() => {
        console.log('Modelo Nota de Peso creado correctamente');
    })
        .catch((er) => {
            console.log("Error al crear el modelo Nota de Peso");
            console.log(er);
        });

    Detalle.belongsTo(NotaPeso);
    NotaPeso.hasMany(Detalle);

    await Detalle.sync().then(() => {
        console.log('Modelo Detalle creado correctamente')
    })
        .catch((er) => {
            console.log("Error al crear el modelo Detalle de Nota");
            console.log(er);
        })
}