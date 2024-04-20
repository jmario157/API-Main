/**
 * Controlador de factura
 * @author Jose Mario Salgado
 * @date 15/04/2024
 * 
 */

const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const ModeloFactura = require('../../models/factura/factura');
const ModeloNotaPeso = require('../../models/notaPeso/notaPeso');
const ModeloDetalle = require('../../models/notaPeso/detalleNota')
const ModeloCliente = require("../../models/clientes/cliente");
const ModeloProducto = require('../../models/Inventario/producto');
const Respuesta = require('../../helpers/respuesta');
const msjErrores = require('../../helpers/msjErrores');

/** 
 * @function ListarFacturas
 * @description Lista de las facturas
**/
exports.listarFacturas = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    ModeloFactura.findAll({
        include: [
            {
                model: ModeloNotaPeso,
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
                ]
            }
        ],
        order: [['fechaEmision', 'ASC']]
    })
        .then(facturas => {
            contenido.tipo = 1;
            contenido.datos = facturas;
            Respuesta.enviar(200, contenido, res);
        })
        .catch(err => {
            contenido.tipo = 0;
            contenido.msj = `Error al obtener las facturas: ${err.message}`;
            Respuesta.enviar(500, contenido, res);
        });
};

/** 
 * @function buscarIdFactura
 * @description obtiene la factura por su id
**/
exports.buscarIdFactura = async (req, res) => {
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
            await ModeloFactura.findByPk(id, {
                include: [
                    {
                        model: ModeloNotaPeso,
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
                        ]
                    }
                ],
                order: [['fechaEmision', 'ASC']]
            })
                .then((data) => {
                    contenido.tipo = 1;
                    contenido.datos = data;
                    Respuesta.enviar(200, contenido, res);
                }).catch((er) => {
                    console.log(er);
                    contenido.tipo = 0;
                    contenido.msj = "Error al cargar los datos del producto";
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
 * @function buscarFechaEmision
 * @description busca la factura por su fecha
**/
exports.buscarFechaEmision = async (req, res) => {
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
            const {fechaEmision} = req.query;
            await ModeloFactura.findAll({
                include: [
                    {
                        model: ModeloNotaPeso,
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
                        ]
                    }
                ],
                order: [['fechaEmision', 'ASC']],
                where: {
                    [Op.or]: {
                        fechaEmision: {
                            [Op.like]: fechaEmision
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
 * @function guardarFactura
 * @description guarda las facturas
**/
exports.guardarFactura = async (req, res) => {
    const { fechaEmision, tipoPago, NotumId } = req.body;
    const contenido = { tipo: 0, datos: [], msj: [] };

    try {
        // Verificar si NotumId es un array
        if (!Array.isArray(NotumId)) {
            contenido.msj = "NotumId debe ser un array";
            return res.status(400).json(contenido);
        }

        // Crear la factura
        const nuevaFactura = await ModeloFactura.create({ fechaEmision, tipoPago });

        // Asignar la factura a cada nota de peso
        await Promise.all(NotumId.map(async NotumId => {
            const notaPeso = await ModeloNotaPeso.findByPk(NotumId);
            if (notaPeso) {
                await notaPeso.update({ FacturaId: nuevaFactura.id });
            }
        }));

        contenido.tipo = 1;
        contenido.datos = nuevaFactura;
        contenido.msj = "Factura guardada correctamente";
        res.status(200).json(contenido);
    } catch (error) {
        console.error(error);
        contenido.msj = "Error en el servidor";
        res.status(500).json(contenido);
    }
};

/** 
 * @function editarFactura
 * @description edita las facturas
**/
exports.editarFactura = async (req, res) => {
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
            const buscarFactura = await ModeloFactura.findByPk(id);
            if (!buscarFactura) {
                contenido.tipo = 1;
                contenido.datos = [];
                contenido.msj = "No existe una factura con este id";
                Respuesta.enviar(400, contenido, res);
            } else {
                // Actualizar la factura
                await ModeloFactura.update(
                    { ...req.body },
                    { where: { id: id } }
                );

                // Asignar la factura a las notas de peso especificadas
                const { NotumId } = req.body;
                if (NotumId && Array.isArray(NotumId)) {
                    await Promise.all(NotumId.map(async notaId => {
                        const notaPeso = await ModeloNotaPeso.findByPk(notaId);
                        if (notaPeso) {
                            await notaPeso.update({ FacturaId: id });
                        }
                    }));
                }

                contenido.tipo = 1;
                contenido.datos = buscarFactura;
                contenido.msj = "Factura actualizada correctamente";
                Respuesta.enviar(200, contenido, res);
            }
        } catch (error) {
            console.log(error);
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }
};


