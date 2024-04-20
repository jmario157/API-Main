/**
 * Controlador de estaciones
 * @author Carlos Flores
 * @date 20/08/2023
 * 
 */

//Importar modelos
const ModeloEstacion = require('../../models/configuracion/estacion');
const ModeloEstacionImpresora = require('../../models/configuracion/estacionimpresora');
//importar helpers
const Respuesta = require("../../helpers/respuesta");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const msjErrores = require("../../helpers/msjErrores");

/**
 * @function listarEstaciones
 * @description Lista las estaciones
 */
exports.listarEstaciones = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    try {
        await ModeloEstacion.findAll({
            include: {
                model: ModeloEstacionImpresora,
                attributes: ['nombre'],
            },
        }).
            then((data) => {
                contenido.tipo = 1;
                contenido.datos = data;
                Respuesta.enviar(200, contenido, res);
            }).
            catch((er) => {
                contenido.tipo = 0;
                contenido.msj = "Error al cargar los datos de estaciones";
                Respuesta.enviar(500, contenido, res);
            });
    } catch (error) {
        contenido.tipo = 0;
        contenido.msj = "Error en el servidor";
        Respuesta.enviar(500, contenido, res);
    }
}

/**
 * @function buscarIdEstacion
 * @description Busca los datos de un estacion por su id
 */
exports.buscarIdEstacion = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    contenido.msj = msjErrores.lista(validationResult(req));
    if (contenido.msj.length > 0) {
        Respuesta.enviar(200, contenido, res);
    }
    else {
        try {
            const { id } = req.query;
            await ModeloEstacion.findOne({
                include: {
                    model: ModeloEstacionImpresora,
                    attributes: ['nombre'],
                },
                where: { id: id }
            }).
                then((data) => {
                    contenido.tipo = 1;
                    contenido.datos = data;
                    Respuesta.enviar(200, contenido, res);
                }).
                catch((er) => {
                    console.log(er);
                    contenido.tipo = 0;
                    contenido.msj = "Error al cargar los datos del estacion";
                    Respuesta.enviar(500, contenido, res);
                });
        } catch (error) {
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }
}

/**
 * @function buscarIpEstacion
 * @description Busca los datos de un estacion por su ip
 */
exports.buscarIpEstacion = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    contenido.msj = msjErrores.lista(validationResult(req));
    if (contenido.msj.length > 0) {
        Respuesta.enviar(200, contenido, res);
    }
    else {
        try {
            const ip = req.connection.remoteAddress;
            console.log(ip);
            console.log(req.connection.remoteAddress);
            await ModeloEstacion.findOne({
                include: {
                    model: ModeloEstacionImpresora,
                    attributes: ['nombre'],
                },
                where: { ip: ip }
            }).
                then((data) => {
                    console.log(data)
                    contenido.tipo = 1;
                    contenido.datos = data;
                    Respuesta.enviar(200, contenido, res);
                }).
                catch((er) => {
                    console.log(er);
                    contenido.tipo = 0;
                    contenido.msj = "Error al cargar los datos del estacion";
                    Respuesta.enviar(500, contenido, res);
                });
        } catch (error) {
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }
}


/**
 * @function buscarNombreEstacion
 * @description Busca los datos de un estacion por su nombre
 */
exports.buscarNombreEstacion = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    contenido.msj = msjErrores.lista(validationResult(req));
    if (contenido.msj.length > 0) {
        Respuesta.enviar(200, contenido, res);
    }
    else {
        try {
            const { nombre } = req.query;
            await ModeloEstacion.findAll({
                include: {
                    model: ModeloEstacionImpresora,
                    attributes: ['nombre'],
                },
                where: {
                    [Op.or]: {
                        nombre: {
                            [Op.like]: nombre
                        },
                    }
                }
            }).
                then((data) => {
                    contenido.tipo = 1;
                    contenido.datos = data;
                    Respuesta.enviar(200, contenido, res);
                }).
                catch((er) => {
                    console.log(er);
                    contenido.tipo = 0;
                    contenido.msj = "Error al cargar los datos del estacion";
                    Respuesta.enviar(500, contenido, res);
                });
        } catch (error) {
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }
}

/**
 * @function guardarEstacion
 * @description Guarda los datos de un estacion
 */
exports.guardarEstacion = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    contenido.msj = msjErrores.lista(validationResult(req));
    if (contenido.msj.length > 0) {
        Respuesta.enviar(400, contenido, res);
    }
    else {
        try {
            const { estacionimpresoras } = req.body;
            await ModeloEstacion.create({ ...req.body }).then(async(data) => {
                contenido.tipo = 1;
                contenido.datos = data;
                contenido.msj = "Registro guardado correctamente";
                var impresoras = [];
                    estacionimpresoras.forEach(async element => {
                        impresoras.push({nombre: element.nombre, estacionId: id});
                    });
                    await ModeloEstacionImpresora.bulkCreate(impresoras);
                Respuesta.enviar(200, contenido, res);
            }).catch((er2) => {
                contenido.tipo = 0;
                contenido.datos = er2;
                contenido.msj = "Error al guardar el registro";
                Respuesta.enviar(500, contenido, res);
            });
        } catch (error) {
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }

}

/**
 * @function editarEstacion
 * @description Actualiza los datos de un estacion
 */
exports.editarEstacion = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    contenido.msj = msjErrores.lista(validationResult(req));
    if (contenido.msj.length > 0) {
        Respuesta.enviar(400, contenido, res);
    }
    else {
        try {
            const { id } = req.query;
            const { nombre } = req.body;
            const { estacionimpresoras } = req.body;
            
            const buscarEstacion = await ModeloEstacion.findOne({
                where: {
                    nombre: nombre,
                    id: { [Op.not]: id }
                }
            });
            if (buscarEstacion) {
                contenido.tipo = 2;
                contenido.datos = buscarBanco;
                contenido.msj = "Ya existe una estacion con este nombre";
                Respuesta.enviar(400, contenido, res);
            } else {
                await ModeloEstacion.update(
                    { ...req.body },
                    { where: { id: id } }
                ).then(async (data) => {
                    contenido.tipo = 1;
                    contenido.datos = data;
                    contenido.msj = "Registro guardado correctamente";
                    await ModeloEstacionImpresora.destroy({where: {estacionId: id}});
                    var impresoras = [];
                    estacionimpresoras.forEach(async element => {
                        impresoras.push({nombre: element.nombre, estacionId: id});
                    });
                    await ModeloEstacionImpresora.bulkCreate(impresoras);
                    Respuesta.enviar(200, contenido, res);
                }).catch((er2) => {
                    contenido.tipo = 0;
                    contenido.datos = er2;
                    contenido.msj = "Error al actualizar el registro";
                    Respuesta.enviar(500, contenido, res);
                });
            }
        } catch (error) {
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }

}