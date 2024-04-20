/**
 * Controlador de pos
 * @author Carlos Flores
 * @date 01/07/2023
 * 
 */

//Importar modelos
const ModeloBanco = require("../../models/bancos/banco");
const ModeloPos = require("../../models/bancos/pos");
const ModeloCuenta = require("../../models/bancos/cuenta");
//importar helpers
const Respuesta = require("../../helpers/respuesta");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const msjErrores = require("../../helpers/msjErrores");

/**
 * @function listarPos
 * @description Lista los pos
 */
exports.listarPos = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    try {
        await ModeloPos.findAll(
            {
                include: {
                    model: ModeloCuenta,
                    attributes: ['numero','nombre'],
                    include: {
                        model: ModeloBanco,
                        attributes: ['nombre'],
                    },
                },
            }
        ).
            then((data) => {
                contenido.tipo = 1;
                contenido.datos = data;
                Respuesta.enviar(200, contenido, res);
            }).
            catch((er) => {
                contenido.tipo = 0;
                contenido.msj = "Error al cargar los datos de pos";
                Respuesta.enviar(500, contenido, res);
            });
    } catch (error) {
        contenido.tipo = 0;
        contenido.msj = "Error en el servidor";
        Respuesta.enviar(500, contenido, res);
    }
}

/**
 * @function buscarIdpos
 * @description Busca los datos de un pos por su id
 */
exports.buscarIdpos = async (req, res) => {
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
            await ModeloPos.findOne({
                include: {
                    model: ModeloCuenta,
                    attributes: ['numero','nombre'],
                    include: {
                        model: ModeloBanco,
                        attributes: ['nombre'],
                    },
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
                    contenido.msj = "Error al cargar los datos del pos";
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
 * @function buscarIdBanco
 * @description Busca los datos de un pos por su id de banco
 */
exports.buscarIdBanco = async (req, res) => {
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
            const { bancoId } = req.query;
            await ModeloPos.findAll({
                include: {
                    model: ModeloCuenta,
                    attributes: ['numero','nombre'],
                    where: { bancoId: bancoId },
                    include: {
                        model: ModeloBanco,
                        attributes: ['nombre'],
                    },
                },
            }).
                then((data) => {
                    contenido.tipo = 1;
                    contenido.datos = data;
                    Respuesta.enviar(200, contenido, res);
                }).
                catch((er) => {
                    console.log(er);
                    contenido.tipo = 0;
                    contenido.msj = "Error al cargar los datos del pos";
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
 * @function buscarNombrepos
 * @description Busca los datos de una pos por su nombre
 */
exports.buscarNombrepos = async (req, res) => {
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
            await ModeloPos.findAll({
                include: {
                    model: ModeloCuenta,
                    attributes: ['numero','nombre'],
                    include: {
                        model: ModeloBanco,
                        attributes: ['nombre'],
                    },
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
                    contenido.msj = "Error al cargar los datos del pos";
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
 * @function buscarNumeroCuenta
 * @description Busca los datos de una pos por su numero
 */
exports.buscarNumeropos = async (req, res) => {
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
            const { numero } = req.query;
            await ModeloPos.findAll({
                include: {
                    model: ModeloCuenta,
                    attributes: ['numero','nombre'],
                    where: {
                        numero: {
                            [Op.like]: numero
                        }
                    },
                    include: {
                        model: ModeloBanco,
                        attributes: ['nombre'],
                    },
                },
            }).
                then((data) => {
                    contenido.tipo = 1;
                    contenido.datos = data;
                    Respuesta.enviar(200, contenido, res);
                }).
                catch((er) => {
                    console.log(er);
                    contenido.tipo = 0;
                    contenido.msj = "Error al cargar los datos del pos";
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
 * @function guardarpos
 * @description Guarda los datos de un pos
 */
exports.guardarpos = async (req, res) => {
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
            const { nombre } = req.body;
            const buscarpos = await ModeloPos.findOne({
                where:{
                    nombre: nombre
                }
            });
            if(buscarpos){
                contenido.tipo = 2;
                contenido.datos = [];
                contenido.msj = "Ya exite este nombre de pos";
                Respuesta.enviar(400, contenido, res);
            }
            else{
                await ModeloPos.create({ ...req.body }).then((data) => {
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
        } catch (error) {
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }

}

/**
 * @function editarpos
 * @description Actualiza los datos de un pos
 */
exports.editarpos = async (req, res) => {
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
            const buscarpos = await ModeloPos.findOne({
                where: {
                    nombre: nombre,
                    id: {[Op.not]: id},
                }
            });
            if(buscarpos){
                contenido.tipo = 2;
                contenido.datos = buscarpos;
                contenido.msj = "Ya existe un pos con este nombre";
                Respuesta.enviar(400, contenido, res);
            }else{
                await ModeloPos.update(
                    { ...req.body },
                    { where: { id: id } }
                ).then(async(data) => {
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
            }
        } catch (error) {
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }

}

/**
 * @function activarpos
 * @description Actualiza el estado de un pos
 */
exports.activarpos = async (req, res) => {
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
            await ModeloPos.update(
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