/**
 * Controlador de profesiones
 * @author Carlos Flores
 * @date 20/06/2023
 * 
 */
//Importar modelos
const ModeloProfesion = require("../../models/clientes/profesion");
//importar helpers
const Respuesta = require("../../helpers/respuesta");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const msjErrores = require("../../helpers/msjErrores");

/**
 * @function listarProfesion
 * @description Lista las profesiones
 */
exports.listarProfesiones = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    try {
        await ModeloProfesion.findAll({
            order:[['nombre', 'DESC']],
        }
        ).
            then((data) => {
                contenido.tipo = 1;
                contenido.datos = data;
                Respuesta.enviar(200, contenido, res);
            }).
            catch((er) => {
                contenido.tipo = 0;
                contenido.msj = "Error al cargar los datos de profesiones";
                Respuesta.enviar(500, contenido, res);
            });
    } catch (error) {
        contenido.tipo = 0;
        contenido.msj = "Error en el servidor";
        Respuesta.enviar(500, contenido, res);
    }
}

/**
 * @function buscarIdProfesion
 * @description Busca los datos de una profesion por su id
 */
exports.buscarIdProfesion = async (req, res) => {
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
            await ModeloProfesion.findOne({ order:[['nombre', 'DESC']], where: { id: id }}).
                then((data) => {
                    contenido.tipo = 1;
                    contenido.datos = data;
                    Respuesta.enviar(200, contenido, res);
                }).
                catch((er) => {
                    console.log(er);
                    contenido.tipo = 0;
                    contenido.msj = "Error al cargar los datos del profesion";
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
 * @function buscarNombreProfesion
 * @description Busca los datos de un profesion por su nombre
 */
exports.buscarNombreProfesion = async (req, res) => {
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

            const { nombre } = req.query;
            console.log(nombre);
            await ModeloProfesion.findAll({
                order:[['nombre', 'DESC']],
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
                    contenido.msj = "Error al cargar los datos del profesion";
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
 * @function guardarProfesion
 * @description Guarda los datos de un profesion
 */
exports.guardarProfesion = async (req, res) => {
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
            await ModeloProfesion.create({ ...req.body }).then((data) => {
                contenido.tipo = 1;
                contenido.datos = data;
                contenido.msj = "Registro guardado correctamente";
                Respuesta.enviar(200, contenido, res);
            }).catch((er2) => {
                console.log(er2)
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
 * @function editarProfesion
 * @description Actualiza los datos de un profesion
 */
exports.editarProfesion = async (req, res) => {
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
            const buscarProfesion = await ModeloProfesion.findOne({
                where:{
                    [Op.and]: [
                        { nombre: nombre },
                        { id: { [Op.not]: id } }
                    ]
                }
            });
            console.log(buscarProfesion);
            if(buscarProfesion){
                contenido.tipo = 1;
                contenido.datos = [];
                contenido.msj = "Ya existe una profesion con este nombre";
                Respuesta.enviar(400, contenido, res);
            }
            else{
                await ModeloProfesion.update(
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
            console.log(error);
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }
}