/**
 * Controlador de fincas
 * @author Carlos Flores
 * @date 02/01/2023
 * 
 */

//Importar modelos
const ModeloClienteFinca = require("../../models/clientes/clientefinca");
//importar helpers
const Respuesta = require("../../helpers/respuesta");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const msjErrores = require("../../helpers/msjErrores");

/**
 * @function listarFincas
 * @description Lista las fincas
 */
exports.listarFincas = async (req, res) => {
    var contenido = {
        unidad: 0,
        datos: [],
        msj: [],
    };
    try {
        await ModeloClienteFinca.findAll(
            {
                attributes: ['id', 'nombre'],
                include: {
                    model:
                }
            }
        ).
            then((data) => {
                contenido.unidad = 1;
                contenido.datos = data;
                Respuesta.enviar(200, contenido, res);
            }).
            catch((er) => {
                contenido.unidad = 0;
                contenido.msj = "Error al cargar los datos de fincas";
                Respuesta.enviar(500, contenido, res);
            });
    } catch (error) {
        contenido.unidad = 0;
        contenido.msj = "Error en el servidor";
        Respuesta.enviar(500, contenido, res);
    }
}

/**
 * @function buscarIdClienteFinca
 * @description Busca los datos de una unidad por su id
 */
exports.buscarIdClienteFinca = async (req, res) => {
    var contenido = {
        unidad: 0,
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
            await ModeloClienteFinca.findOne({
                attributes: ['id', 'nombre'],
                where: { id: id }
            }).
                then((data) => {
                    contenido.unidad = 1;
                    contenido.datos = data;
                    Respuesta.enviar(200, contenido, res);
                }).
                catch((er) => {
                    console.log(er);
                    contenido.unidad = 0;
                    contenido.msj = "Error al cargar los datos de la finca";
                    Respuesta.enviar(500, contenido, res);
                });
        } catch (error) {
            contenido.unidad = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }
}


/**
 * @function buscarNombreClienteFinca
 * @description Busca los datos de una unidad por su nombre
 */
exports.buscarNombreClienteFinca = async (req, res) => {
    var contenido = {
        unidad: 0,
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
            await ModeloClienteFinca.findAll({
                attributes: ['id', 'nombre'],
                where: {
                    [Op.or]: {
                        nombre: {
                            [Op.like]: nombre
                        },
                    }
                }
            }).
                then((data) => {
                    contenido.unidad = 1;
                    contenido.datos = data;
                    Respuesta.enviar(200, contenido, res);
                }).
                catch((er) => {
                    console.log(er);
                    contenido.unidad = 0;
                    contenido.msj = "Error al cargar los datos de la unidad";
                    Respuesta.enviar(500, contenido, res);
                });
        } catch (error) {
            contenido.unidad = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }
}

/**
 * @function guardarClienteFinca
 * @description Guarda los datos de un unidad
 */
exports.guardarClienteFinca = async (req, res) => {
    var contenido = {
        unidad: 0,
        datos: [],
        msj: [],
    };
    contenido.msj = msjErrores.lista(validationResult(req));
    if (contenido.msj.length > 0) {
        Respuesta.enviar(400, contenido, res);
    }
    else {
        try {
            await ModeloClienteFinca.create({ ...req.body }).then((data) => {
                contenido.unidad = 1;
                contenido.datos = data;
                contenido.msj = "Registro guardado correctamente";
                Respuesta.enviar(200, contenido, res);
            }).catch((er2) => {
                contenido.unidad = 0;
                contenido.datos = er2;
                contenido.msj = "Error al guardar el registro";
                Respuesta.enviar(500, contenido, res);
            });
        } catch (error) {
            contenido.unidad = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }

}

/**
 * @function editarClienteFinca
 * @description Actualiza los datos de un unidad
 */
exports.editarClienteFinca = async (req, res) => {
    var contenido = {
        unidad: 0,
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
            const buscarClienteFinca = await ModeloClienteFinca.findOne({
                where: {
                    nombre: nombre,
                    id: {[Op.not]: id}
                }
            });
            if(buscarClienteFinca){
                contenido.unidad = 2;
                contenido.datos = buscarClienteFinca;
                contenido.msj = "Ya existe una finca con este nombre";
                Respuesta.enviar(400, contenido, res);
            }else{
                await ModeloClienteFinca.update(
                    { ...req.body },
                    { where: { id: id } }
                ).then(async(data) => {
                    contenido.unidad = 1;
                    contenido.datos = data;
                    contenido.msj = "Registro guardado correctamente";
                    Respuesta.enviar(200, contenido, res);
                }).catch((er2) => {
                    contenido.unidad = 0;
                    contenido.datos = er2;
                    contenido.msj = "Error al actualizar el registro";
                    Respuesta.enviar(500, contenido, res);
                });
            }
        } catch (error) {
            contenido.unidad = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }

}
