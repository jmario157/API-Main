/**
 * Controlador de municipios
 * @author Carlos Flores
 * @date 01/07/2023
 * 
 */

//Importar modelos
const ModeloMunicipios = require("../../models/lugares/municipios");
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
 * @function listarMunicipios
 * @description Lista los municipios
 */
exports.listarMunicipios = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    try {
        await ModeloMunicipios.findAll({
            include: {
                model: ModeloDepartamentos,
                attributes: ['nombre', 'paiId'],
                include: {
                    model: ModeloPais,
                    attributes: ['nombre'],
                }
            }
        }).
            then((data) => {
                contenido.tipo = 1;
                contenido.datos = data;
                Respuesta.enviar(200, contenido, res);
            }).
            catch((er) => {
                contenido.tipo = 0;
                contenido.msj = "Error al cargar los datos del municipio";
                Respuesta.enviar(500, contenido, res);
            });
    } catch (error) {
        contenido.tipo = 0;
        contenido.msj = "Error en el servidor";
        Respuesta.enviar(500, contenido, res);
    }
}

/**
 * @function buscarIdMunicipio
 * @description Busca los datos de un municipio por su id
 */
exports.buscarIdMunicipio = async (req, res) => {
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
            await ModeloMunicipios.findOne({
                include: {
                    model: ModeloDepartamentos,
                    attributes: ['nombre', 'paiId'],
                    include: {
                        model: ModeloPais,
                        attributes: ['nombre'],
                    }
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
                    contenido.msj = "Error al cargar los datos del municipio";
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
 * @function buscarNombreMunicipio
 * @description Busca los datos de un municipio por su nombre
 */
exports.buscarNombreMunicipio = async (req, res) => {
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
                    model: ModeloDepartamentos,
                    attributes: ['nombre', 'paiId'],
                    include: {
                        model: ModeloPais,
                        attributes: ['nombre'],
                    }
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
                    contenido.msj = "Error al cargar los datos del municipio";
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
 * @function guardarMunicipio
 * @description Guarda los datos de un municipio
 */
exports.guardarMunicipio = async (req, res) => {
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
            await ModeloMunicipios.create({ ...req.body }).then((data) => {
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
 * @function editarMunicipio
 * @description Actualiza los datos de un municipio
 */
exports.editarMunicipio = async (req, res) => {
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
            await ModeloMunicipios.update(
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