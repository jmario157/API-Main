/**
 * Controlador de Nota de Peso
 * @author Jose Mario Salgado
 * @date 03/04/2024
 * 
 */

const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const ModeloNotaPeso = require('../../models/notaPeso/notaPeso');
const ModeloCliente = require("../../models/clientes/cliente");
const ModeloProducto = require('../../models/Inventario/producto');
const ModeloDetalle = require('../../models/notaPeso/detalleNota');
const Respuesta = require('../../helpers/respuesta');
const msjErrores = require('../../helpers/msjErrores');

/** 
 * @function ListarNota
 * @description Lista las ntas de peso
**/
exports.listarNota = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],  
        msj: [],
    };
    ModeloNotaPeso.findAll({
        include: [
            {
                model: ModeloCliente,
                attributes: ['nombreprimer', 'nombresegundo', 'apellidoprimer', 'apellidosegundo']
            },
            {
                model: ModeloProducto,
                attributes: ['tipoProducto']
            },
            {
                model: ModeloDetalle,
                attributes: ['pesada', 'cantidad', 'pesoBruto', 'tara', 'pesoNeto']
            }
        ],
        order: [['fechaIngreso', 'ASC']]
    })
        .then(nota => {
            contenido.tipo = 1;
            contenido.datos = nota;
            Respuesta.enviar(200, contenido, res);
        })
        .catch(err => {
            contenido.tipo = 0;
            contenido.msj = `Error al obtener los detalles: ${err.message}`;
            Respuesta.enviar(500, contenido, res);
        });
};

/** 
 * @function buscarIdNota
 * @description obtiene la nota por su id
**/
exports.buscarIdNota = async (req, res) => {
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
            await ModeloNotaPeso.findOne({
                include: [
                    {
                        model: ModeloCliente,
                        attributes: ['nombreprimer', 'nombresegundo', 'apellidoprimer', 'apellidosegundo']
                    },
                    {
                        model: ModeloProducto,
                        attributes: ['tipoProducto']
                    },
                    {
                        model: ModeloDetalle,
                        attributes: ['pesada', 'cantidad', 'pesoBruto', 'tara', 'pesoNeto']
                    }
                ],
            })
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
 * @function buscarFechaIngreso
 * @description busca la nota por su fecha
**/
exports.buscarFechaIngreso = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };

    contenido.msj = msjErrores.lista(validationResult(req));

    if (contenido.msj.length > 0) {
        Respuesta.enviar(200, contenido, res);
    }else{
        try{
            const {fechaIngreso} = req.query;
            await ModeloNotaPeso.findAll({
                include:[
                    {
                        model: ModeloCliente,
                        attributes: ['nombreprimer', 'nombresegundo', 'apellidoprimer', 'apellidosegundo']
                    },
                    {
                        model: ModeloProducto,
                        attributes: ['tipoProducto']
                    },
                    {
                        model: ModeloDetalle,
                        attributes: ['pesada', 'cantidad', 'pesoBruto', 'tara', 'pesoNeto']
                    }
                ],
                where: {
                    [Op.or]: {
                        fechaIngreso: {
                            [Op.like]: fechaIngreso
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
 * @function guardarNota
 * @description guarda la nota de peso
**/
exports.guardarNota = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };

    contenido.msj = msjErrores.lista(validationResult(req));
    if (contenido.msj.length > 0) {
        Respuesta.enviar(400, contenido, res);
    } else {
        try {
            // Crear la nota de peso
            const notaPeso = await ModeloNotaPeso.create({
                fechaIngreso: req.body.fechaIngreso,
                estado: req.body.estado,
                clienteId: req.body.clienteId,
                ProductoId: req.body.ProductoId
            });

            // Crear los detalles asociados a la nota de peso
            const detalles = await Promise.all(req.body.DetalleId.map(async detalle => {
                const nuevoDetalle = await ModeloDetalle.create({
                    pesada: detalle.pesada,
                    cantidad: detalle.cantidad,
                    pesoBruto: detalle.pesoBruto,
                    tara: detalle.tara,
                    pesoNeto: detalle.pesoBruto - detalle.tara,
                    NotumId: notaPeso.id
                });
                return nuevoDetalle;
            }));

            // Asociar los detalles a la nota de peso
            await notaPeso.setDetalles(detalles);

            contenido.tipo = 1;
            contenido.datos = notaPeso;
            contenido.msj = "Nota de Peso guardada correctamente";
            Respuesta.enviar(200, contenido, res);
        } catch (error) {
            console.log(error)
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }
};


/** 
 * @function editarNota
 * @description edita la nota de peso
**/
exports.editarNota = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    contenido.msj = msjErrores.lista(validationResult(req));
    if (contenido.msj.length > 0) {
        Respuesta.enviar(400, contenido, res);
    } else {
        try {
            const { id } = req.query;
            const { fechaIngreso, estado, clienteId, ProductoId, DetalleId } = req.body;

            // Verificar si la nota de peso existe
            const notaPesoExistente = await ModeloNotaPeso.findByPk(id);
            if (!notaPesoExistente) {
                contenido.tipo = 0;
                contenido.msj = "La nota de peso no existe";
                Respuesta.enviar(404, contenido, res);
                return;
            }

            // Eliminar los detalles antiguos
            await ModeloDetalle.destroy({
                where: {
                    NotumId: id
                }
            });

            // Crear los nuevos detalles
            await Promise.all(DetalleId.map(async detalle => {
                await ModeloDetalle.create({
                    pesada: detalle.pesada,
                    cantidad: detalle.cantidad,
                    pesoBruto: detalle.pesoBruto,
                    tara: detalle.tara,
                    pesoNeto: detalle.pesoBruto - detalle.tara,
                    NotumId: id
                });
            }));

            // Actualizar la nota de peso
            await notaPesoExistente.update({
                fechaIngreso: fechaIngreso,
                estado: estado,
                clienteId: clienteId,
                ProductoId: ProductoId
            });

            // Obtener los detalles actualizados asociados a la nota de peso
            const detallesActualizados = await ModeloDetalle.findAll({
                where: { NotumId: id }
            });

            contenido.tipo = 1;
            contenido.datos = { ...notaPesoExistente.toJSON(), Detalles: detallesActualizados };
            contenido.msj = "Nota actualizada correctamente";
            Respuesta.enviar(200, contenido, res);
        } catch (error) {
            console.log(error);
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }
};

/** 
 * @function activarNota
 * @description activa el estado de la nota
**/
exports.activarNota = async (req, res) => {
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
            await ModeloNotaPeso.update(
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

