/**
 * Controlador de aperturas
 * @author Carlos Flores
 * @date 28/08/2023
 * 
 */

//Importar modelos
const ModeloApertura = require("../../models/cajas/apertura");
const ModeloCaja = require('../../models/cajas/caja');
const ModeloUsuario = require('../../models/empleados/usuario');
const ModeloEmpleado = require('../../models/empleados/empleado');
const ModeloEstacion = require('../../models/configuracion/estacion');
//importar helpers
const Respuesta = require("../../helpers/respuesta");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const msjErrores = require("../../helpers/msjErrores");

/**
 * @function listarAperturas
 * @description Lista los aperturas
 */
exports.listarAperturas = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    try {
        await ModeloApertura.findAll(
            {
                include: [
                    {
                        model: ModeloCaja,
                        attributes: ['nombre'],
                    },
                    {
                        model: ModeloUsuario,
                        attributes: ['login'],
                        include: {
                            model: ModeloEmpleado,
                            attributes: ['primernombre', 'segundonombre', 'primerapellido', 'segundoapellido'],
                        }
                    }
                ],
            }
        ).
            then((data) => {
                contenido.tipo = 1;
                contenido.datos = data;
                Respuesta.enviar(200, contenido, res);
            }).
            catch((er) => {
                contenido.tipo = 0;
                contenido.msj = "Error al cargar los datos de aperturas";
                Respuesta.enviar(500, contenido, res);
            });
    } catch (error) {
        contenido.tipo = 0;
        contenido.msj = "Error en el servidor";
        Respuesta.enviar(500, contenido, res);
    }
}

/**
 * @function buscarIdApertura
 * @description Busca los datos de un apertura por su id
 */
exports.buscarIdApertura = async (req, res) => {
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
            await ModeloApertura.findOne({
                include: [
                    {
                        model: ModeloCaja,
                        attributes: ['nombre'],
                    },
                    {
                        model: ModeloUsuario,
                        attributes: ['login'],
                        include: {
                            model: ModeloEmpleado,
                            attributes: ['primernombre', 'segundonombre', 'primerapellido', 'segundoapellido'],
                        }
                    }
                ],
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
                    contenido.msj = "Error al cargar los datos del apertura";
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
 * @function guardarApertura
 * @description Guarda los datos de un apertura
 */
exports.guardarApertura = async (req, res) => {
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
            await ModeloApertura.create({ ...req.body }).then((data) => {
                contenido.tipo = 1;
                contenido.datos = data;
                contenido.msj = "Registro guardado correctamente";
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
 * @function editarApertura
 * @description Actualiza los datos de un apertura
 */
exports.editarApertura = async (req, res) => {
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

            await ModeloApertura.update(
                { ...req.body },
                { where: { id: id } }
            ).then(async (data) => {
                contenido.tipo = 1;
                contenido.datos = data;
                contenido.msj = "Registro guardado correctamente";
                Respuesta.enviar(200, contenido, res);
            }).catch((er2) => {
                contenido.tipo = 0;
                contenido.datos = er2;
                contenido.msj = "Error al actualizar el registro";
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
 * @function anularapertura
 * @description Actualiza el estado de un apertura
 */
exports.anularApertura = async (req, res) => {
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
            await ModeloApertura.update(
                { ...req.body },
                { where: { id: id } }
            ).then((data2) => {
                contenido.tipo = 1;
                contenido.datos = data2;
                contenido.msj = "Registro actualizado correctamente";
            }).catch((er2) => {
                contenido.tipo = 0;
                contenido.datos = er2;
                contenido.msj = "Error al actualizar el registro";
            });
            Respuesta.enviar(200, contenido, res);
        } catch (error) {
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }

}