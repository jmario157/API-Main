/**
 * Controlador de inventario
 * @author Jose Mario Salgado
 * @date 20/01/2024
 * 
 */

const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const ModeloInventario = require('../../models/Inventario/inventario');
const ModeloProducto = require('../../models/Inventario/producto');
const Respuesta = require('../../helpers/respuesta');
const msjErrores = require('../../helpers/msjErrores');
const sequelize = require('sequelize');

/** 
 * @function ListarInventario
 * @description Lista el inventario con los productos en existencia
**/
exports.listarInventario = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    ModeloInventario.findAll({
        include:[
            {
                model: ModeloProducto,
                attributes: ['fechaEntrada', 'tipoProducto', 'cantidad'],
            }
        ],
    })
    .then(inventario => {
        contenido.tipo = 1;
        contenido.datos = inventario;
        Respuesta.enviar(200, contenido, res);
    })
    .catch(err => {
        contenido.tipo = 0;
        contenido.msj = `Error al obtener el inventario: ${err.message}`;
        Respuesta.enviar(500, contenido, res);
    });
};

/** 
 * @function buscarIdInventario
 * @description Busca el inventario por su id
**/
exports.buscarIdInventario = async (req, res) => {
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
            await ModeloInventario.findOne({ 
                include:[
                    {
                        model: ModeloProducto,
                        attributes: ['fechaEntrada', 'tipoProducto', 'cantidad'],
                    }
                ],
                where: { id: id }
            }).
                then((data) => {
                    contenido.tipo = 1;
                    contenido.datos = data;
                    Respuesta.enviar(200, contenido, res);
                }).catch((er) => {
                    console.log(er);
                    contenido.tipo = 0;
                    contenido.msj = "Error al cargar los datos del inventario";
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
 * @function guardarInventario
 * @description guarda el inventario
**/
exports.guardarInventario = async (req, res) => {
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
        const t = await sequelize.transaction();
        try {
            const producto = await ModeloProducto.create({ ...req.body }, { transaction: t });

            const inventario = await ModeloInventario.create({
                fechaEntrada: producto.fechaEntrada,
                ProductoId: producto.id,
                stock: producto.cantidad
            }, { transaction: t });

            await t.commit();

            contenido.tipo = 1;
            contenido.datos = inventario;
            contenido.msj = "Inventario guardado correctamente";
            Respuesta.enviar(200, contenido, res);
        } catch (error) {
            await t.rollback();

            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }
};

/** 
 * @function editarInventario
 * @description edita el inventario
**/
exports.editarInventario = async (req, res) => {
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
            const buscarInventario = await ModeloInventario.findOne({
                where: { id: id }
            });
            
            console.log(buscarInventario);
            if(buscarInventario){
                contenido.tipo = 1;
                contenido.datos = [];
                contenido.msj = "Ya existe un producto con este nombre";
                Respuesta.enviar(400, contenido, res);
            }
            else{
                await ModeloInventario.update(
                    { ...req.body },
                    { where: { id: id } }
                ).then(async(data) => {
                    contenido.tipo = 1;
                    contenido.datos = data;
                    contenido.msj = "Inventario actualizado correctamente";
                    Respuesta.enviar(200, contenido, res);
                }).catch((er2) => {
                    contenido.tipo = 0;
                    contenido.datos = er2;
                    contenido.msj = "Error al actualizar el inventario";
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