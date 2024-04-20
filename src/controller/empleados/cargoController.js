/**
 * Controlador de cargos
 * @author Carlos Flores
 * @date 06/06/2023
 * 
 */
//Importar modelos
const ModeloCargo = require("../../models/empleados/cargo");
//importar helpers
const Respuesta = require("../../helpers/respuesta");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const msjErrores = require("../../helpers/msjErrores");

/**
 * @function listarCargos
 * @description Lista los cargos de los empleados
 */
exports.listarCargos = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    try {
        await ModeloCargo.findAll().
            then((data) => {
                contenido.tipo = 1;
                contenido.datos = data;
                Respuesta.enviar(200, contenido, res);
            }).
            catch((er) => {
                contenido.tipo = 0;
                contenido.msj = "Error al cargar los datos de cargos";
                Respuesta.enviar(500, contenido, res);
            });
    } catch (error) {
        contenido.tipo = 0;
        contenido.msj = "Error en el servidor";
        Respuesta.enviar(500, contenido, res);
    }
}

/**
 * @function buscarIdCargo
 * @description Busca los datos de un cargo por su id
 */
exports.buscarIdCargo = async (req, res) => {
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
            await ModeloCargo.findOne({
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
                    contenido.msj = "Error al cargar los datos del cargo";
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
 * @function buscarNombreCargo
 * @description Busca los datos de un cargo por su id
 */
exports.buscarNombreCargo = async (req, res) => {
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
            await ModeloCargo.findOne({
                where: {
                    nombre: {
                        [Op.like]: nombre
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
                    contenido.msj = "Error al cargar los datos del cargo";
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
 * @function guardarCargo
 * @description Guarada los datos de un cargo
 */
exports.guardarCargo = async (req, res) => {
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
            await ModeloCargo.create({ ...req.body }).then((data2) => {
                contenido.tipo = 1;
                contenido.datos = data2;
                contenido.msj = "Registro guardado correctamente";
                Respuesta.enviar(200, contenido, res);
            }).catch((er2) => {
                contenido.tipo = 0;
                contenido.datos = data;
                contenido.msj = "Error al guaradar el registro";
                Respuesta.enviar(200, contenido, res);
            });
        } catch (error) {
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }

}

/**
 * @function editarCargo
 * @description Actualiza los datos de un cargo
 */
exports.editarCargo = async (req, res) => {
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
            const { nombre } = req.body;
            const { id } = req.query;
            await ModeloCargo.findOne({
                where: {
                    [Op.and]: [
                        { nombre: nombre },
                        { id: { [Op.not]: id } }
                    ]

                }
            }).
                then(async (data) => {
                    if (!data) {
                        await ModeloCargo.update(
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
                    }
                    else {
                        contenido.tipo = 2;
                        contenido.datos = data;
                        contenido.msj = "Ya existe un cargo con ese nombre";
                    }
                    Respuesta.enviar(200, contenido, res);
                }).
                catch((er) => {
                    contenido.tipo = 0;
                    contenido.msj = "Error al buscar los datos del cargo";
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
 * @function activarCargo
 * @description Actualiza el estado de un cargo
 */
exports.activarCargo = async (req, res) => {
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
        await ModeloCargo.update(
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
