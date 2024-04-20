const Usuario = require('./usuario');
const Cargo = require('./cargo');
const Empleado = require('./empleado');
const Empresa = require('./empresa');
const EmpresaTelefono = require('./empresatelefonos');
const UsuarioAcceso = require('./usuarioacceso');
/**
 * @module empleados
 * @description Lista de modelos del modulo de empleados
 */
exports.Empleados = async () => {
    Cargo.hasMany(Empleado);
    Empleado.belongsTo(Cargo);
    Empleado.hasMany(Usuario);
    Usuario.belongsTo(Empleado);
    Empresa.hasMany(EmpresaTelefono);
    EmpresaTelefono.belongsTo(Empresa);
    Usuario.hasMany(UsuarioAcceso);
    UsuarioAcceso.belongsTo(Usuario);
    await Cargo.sync().then(() => {
        console.log('Modelo Cargo creado correctamente');
    })
        .catch((er) => {
            console.log("Error al crear el modelo Cargo");
            console.log(er);
        });
    await Empleado.sync().then(() => {
        console.log('Modelo Empleado creado correctamente');
    })
        .catch((er) => {
            console.log("Error al crear el modelo Empleado");
            console.log(er);
        });
    await Usuario.sync().then(() => {
        console.log('Modelo Usuario creado correctamente');
    })
        .catch((er) => {
            console.log("Error al crear el modelo Usuario");
            console.log(er);
        });
    await Empresa.sync().then(() => {
        console.log('Modelo Empresa creado correctamente');
    })
        .catch((er) => {
            console.log("Error al crear el modelo Empresa");
            console.log(er);
        });
    await EmpresaTelefono.sync().then(() => {
        console.log('Modelo EmpresaTelefono creado correctamente');
    })
        .catch((er) => {
            console.log("Error al crear el modelo EmpresaTelefono");
            console.log(er);
        });
    await UsuarioAcceso.sync().then(() => {
        console.log('Modelo UsuarioAcceso creado correctamente');
    })
        .catch((er) => {
            console.log("Error al crear el modelo UsuarioAcceso");
            console.log(er);
        });
}
