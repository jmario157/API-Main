/**
 * Controlador de detalle
 * @author Jose Mario Salgado
 * @date 03/04/2024
 * 
 */

const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const ModeloDetalle = require('../../models/notaPeso/detalleNota');
const Respuesta = require('../../helpers/respuesta');
const msjErrores = require('../../helpers/msjErrores');

/** 
 * @function ListarDetalle
 * @description Lista de los detalles de notas
**/
exports.listarDetalle = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],  
        msj: [],
    };
    try {
        await ModeloDetalle.findAll({
            order:[['pesada', 'ASC']],
        })
            .then((data) => {
                contenido.tipo = 1;
                contenido.datos = data;
                Respuesta.enviar(200, contenido, res);
            })
            .catch((er) => {
                contenido.tipo = 0;
                contenido.msj = `Error al obtener los detalles: ${er.message}`;
                Respuesta.enviar(500, contenido, res);
            });
    } catch (error) {
        contenido.tipo = 0;
        contenido.msj = "Error en el servidor";
        Respuesta.enviar(500, contenido, res);
    }
};

/** 
 * @function buscarIdDetalle
 * @description obtiene el detalle por su id
**/
exports.buscarIdDetalle = async (req, res) => {
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
            await ModeloDetalle.findOne({order:[['pesada', 'ASC']], where: { id: id }})
                .then((data) => {
                    contenido.tipo = 1;
                    contenido.datos = data;
                    Respuesta.enviar(200, contenido, res);
                }).catch((er) => {
                    console.log(er);
                    contenido.tipo = 0;
                    contenido.msj = "Error al cargar los datos de la nota de peso";
                    Respuesta.enviar(500, contenido, res);
                });
        } catch (error) {
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }
};

/** 
 * @function buscarPesada
 * @description obtiene el detalle por su peso
**/
exports.buscarPesada = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };

    contenido.msj = msjErrores.lista(validationResult(req));
    if (contenido.msj.length > 0) {
        Respuesta.enviar(400, contenido, res);
    }else{
        try{
            const {pesada} = req.query;
            await ModeloDetalle.findAll({
                order:[['pesada', 'ASC']],
                where: {
                    [Op.or]: {
                        pesada: {
                            [Op.like]: pesada
                        },
                    }
                }
            }).then((data) => {
                contenido.tipo = 1;
                contenido.datos = data;
                Respuesta.enviar(200, contenido, res);
            }).catch((er) => {
                console.log(er);
                contenido.tipo = 0;
                contenido.msj.push('Error al cargar los datos de la nota');
                Respuesta.enviar(500, contenido, res);
            });
        }catch (error){
            contenido.tipo = 0;
            contenido.msj = 'Error en el servidor';
            Respuesta.enviar(500, contenido, res);
        }
    }
};

/** 
 * @function guardarDetalle
 * @description guarda el detalle 
**/
exports.guardarDetalle = async (req, res) => {
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
            const { pesoBruto, tara} = req.body;
            let pesoNeto = pesoBruto - tara;

            await ModeloDetalle.create({ ...req.body, pesoNeto }).then((data) => {
                contenido.tipo = 1;
                contenido.datos = data;
                contenido.msj = "Nota de Peso guardada correctamente";
                Respuesta.enviar(200, contenido, res);
            }).catch((er2) => {
                console.log(er2)
                contenido.tipo = 0;
                contenido.datos = er2;
                contenido.msj = "Error al guardar la nota de peso";
                Respuesta.enviar(500, contenido, res);
            });
        } catch (error) {
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }
};

/** 
 * @function editarDetalle
 * @description edita el detalle 
**/
exports.editarDetalle = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    contenido.msj = msjErrores.lista(validationResult(req));
    if (contenido.msj.length > 0) {
        console.log(contenido);
        Respuesta.enviar(400, contenido, res);
    }
    else {
        try {
            const { id } = req.query;
            const { pesada } = req.body;
            const { pesoBruto, tara} = req.body;
            let pesoNeto = pesoBruto - tara;

            const buscarDetalle = await ModeloDetalle.findOne({
                where: {
                    [Op.and]: [
                        { pesada: pesada },
                        { id: { [Op.not]: id } }
                    ]
                }
            });
            console.log(buscarDetalle)
            if (buscarDetalle) {
                contenido.tipo = 1;
                contenido.datos = [];
                contenido.msj = "Ya existe una ModeloDetalle con este nombre";
                Respuesta.enviar(400, contenido, res);
            }
            else {
                await ModeloDetalle.update(
                    { ...req.body, pesoNeto },
                    { where: { id: id } }
                ).then(async (data) => {
                    contenido.tipo = 1;
                    contenido.datos = data;
                    contenido.msj = "Nota actualizada correctamente";
                    Respuesta.enviar(200, contenido, res);
                }).catch((er2) => {
                    contenido.tipo = 0;
                    contenido.datos = er2;
                    contenido.msj = "Error al actualizar la nota";
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
};