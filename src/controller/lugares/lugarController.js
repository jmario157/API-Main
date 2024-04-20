/**
 * Controlador de bancos
 * @author Carlos Flores
 * @date 01/07/2023
 * 
 */

//Importar modelos
const ModeloLugar = require("../../models/lugares/lugar");
const ModeloMunicipios = require("../../models/lugares/municipios");
const ModeloDepartamentos = require("../../models/lugares/departamento");
const ModeloPais = require('../../models/lugares/pais');
//importar helpers
const Respuesta = require("../../helpers/respuesta");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const msjErrores = require("../../helpers/msjErrores");
const path = require("path");
const { readFile } = require('fs/promises');

/**
 * @function listarLugares
 * @description Lista los lugares
 */
exports.listarLugares = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    try {
        await ModeloLugar.findAll(
            {
                include: {
                    model: ModeloMunicipios,
                    attributes: ['nombre', 'departamentoId'],
                    include: {
                        model: ModeloDepartamentos,
                        attributes: ['nombre'],
                        include: {
                            model: ModeloPais,
                            attributes: ['id','nombre'],
                        }
                    }
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
                contenido.msj = "Error al cargar los datos del lugar";
                Respuesta.enviar(500, contenido, res);
            });
    } catch (error) {
        contenido.tipo = 0;
        contenido.msj = "Error en el servidor";
        Respuesta.enviar(500, contenido, res);
    }
}

/**
 * @function listarLugares
 * @description Lista los lugares
 */
exports.listarDepartamentos = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    try {
        await ModeloDepartamentos.findAll().
            then((data) => {
                contenido.tipo = 1;
                contenido.datos = data;
                Respuesta.enviar(200, contenido, res);
            }).
            catch((er) => {
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
                attributes: ['nombre'],
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
 * @function buscarIdBanco
 * @description Busca los datos de un banco por su id
 */
exports.buscarIdLugar = async (req, res) => {
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
            await ModeloLugar.findOne({
                include: {
                    model: ModeloMunicipios,
                    attributes: ['nombre'],
                    include: {
                        model: ModeloDepartamentos,
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
                    contenido.msj = "Error al cargar los datos del lugar";
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
 * @function buscarNombreBanco
 * @description Busca los datos de un banco por su nombre
 */
exports.buscarNombreLugar = async (req, res) => {
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
                    model: ModeloMunicipios,
                    attributes: ['nombre'],
                    include: {
                        model: ModeloDepartamentos,
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
                    contenido.msj = "Error al cargar los datos del lugar";
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
 * @function guardarBanco
 * @description Guarda los datos de un banco
 */
exports.guardarLugar = async (req, res) => {
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
            await ModeloLugar.create({ ...req.body }).then((data) => {
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
 * @function editarBanco
 * @description Actualiza los datos de un banco
 */
exports.editarLugar = async (req, res) => {
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
            await ModeloLugar.update(
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
 * @function editarBanco
 * @description Actualiza los datos de un banco
 */
exports.ExportarDatos = async (req, res) => {
    const file = await readFile( path.join(__dirname, '../../Config/listaDepartamentos.json'), 'utf-8');
    const file2 = await readFile(path.join(__dirname, '../../Config/listaMunicipios.json'), 'utf-8');

    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    // transformamos el contenido en un JSON
    const json = JSON.parse(file);
    const json2 = JSON.parse(file2);
    await ModeloDepartamentos.bulkCreate(json)
        .then(async (data) => {
            contenido.tipo = 1;
            contenido.datos = data;
            contenido.msj = "Registro guardado correctamente";
            
        }).catch((er2) => {
            console.log(er2)
            contenido.tipo = 0;
            contenido.datos = er2;
            contenido.msj = "Error al actualizar el registro";
        });

    await ModeloMunicipios.bulkCreate(json2)
        .then(async (data) => {
            contenido.tipo = 1;
            contenido.datos = data;
            contenido.msj = "Registro guardado correctamente";
            
        }).catch((er2) => {
            console.log(er2)
            contenido.tipo = 0;
            contenido.datos = er2;
            contenido.msj = "Error al actualizar el registro";
        });
        Respuesta.enviar(200, contenido, res);
}