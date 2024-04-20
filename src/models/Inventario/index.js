const Inventario = require('./inventario');
const Producto = require('./producto');

exports.Inventario = async () => {
    Inventario.belongsTo(Producto);
    Producto.hasMany(Inventario);

    await Inventario.sync().then(() => {
        console.log('Modelo Inventario creado correctamente');
    })
        .catch((er) => {
            console.log("Error al crear el modelo Inventario");
            console.log(er);
        });
    await Producto.sync().then(() => {
        console.log('Modelo Producto creado correctamente');
    })
        .catch((er) => {
            console.log("Error al crear el modelo Producto");
            console.log(er);
        });
}
