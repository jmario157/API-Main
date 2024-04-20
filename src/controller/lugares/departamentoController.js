/**
 * Controlador de departamentos
 * @author Carlos Flores
 * @date 01/07/2023
 * 
 */

//Importar modelos
const ModeloDepartamentos = require("../../models/lugares/departamento");
const ModeloPais = require("../../models/lugares/pais");
//importar helpers
const Respuesta = require("../../helpers/respuesta");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const msjErrores = require("../../helpers/msjErrores");
const path = require("path");
const { readFile } = require('fs/promises');

/**
 * @function listarDepartamentos
 * @description Lista los departamentos
 */
exports.listarDepartamentos = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    try {
        await ModeloDepartamentos.findAll({
            include: {
                model: ModeloPais,
                attributes: ['nombre'],
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
                contenido.msj = "Error al cargar los datos del departamento";
                Respuesta.enviar(500, contenido, res);
            });
    } catch (error) {
        contenido.tipo = 0;
        contenido.msj = "Error en el servidor";
        Respuesta.enviar(500, contenido, res);
    }
}

/**
 * @function buscarIdDepartamento
 * @description Busca los datos de un departamento por su id
 */
exports.buscarIdDepartamento = async (req, res) => {
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
            await ModeloDepartamentos.findOne({
                include: {
                    model: ModeloPais,
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
                    contenido.msj = "Error al cargar los datos del departamento";
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
 * @function buscarNombreDepartamento
 * @description Busca los datos de un departamento por su nombre
 */
exports.buscarNombreDepartamento = async (req, res) => {
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
            await ModeloLugar.findAll({
                include: {
                    model: ModeloPais,
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
                    contenido.msj = "Error al cargar los datos del departamento";
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
 * @function guardarDepartamento
 * @description Guarda los datos de un departamento
 */
exports.guardarDepartamento = async (req, res) => {
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
            const { numero, paiId } = req.body;
            const buscarNumero = await ModeloDepartamentos.findOne({ where: { paiId: paiId, numero: numero } });
            if (!buscarNumero) {
                await ModeloDepartamentos.create({ ...req.body }).then((data) => {
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
            }
            else {
                contenido.tipo = 2;
                contenido.datos = data;
                contenido.msj = "Ya existe un departamento con ese código";
                Respuesta.enviar(400, contenido, res);
            }
        } catch (error) {
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }

}

/**
 * @function editarDepartamento
 * @description Actualiza los datos de un departamento
 */
exports.editarDepartamento = async (req, res) => {
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
            await ModeloDepartamentos.update(
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