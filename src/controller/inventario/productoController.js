/**
 * Controlador de Producto
 * @author Jose Mario Salgado
 * @date 02/03/2024
 * 
 */

const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const ModeloProducto = require('../../models/Inventario/producto');
const ModeloInventario = require('../../models/Inventario/inventario');
const Respuesta = require('../../helpers/respuesta');
const msjErrores = require('../../helpers/msjErrores');

/** 
 * @function ListarProductos
 * @description Lista de los tipos de cafe
**/
exports.listarProductos = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    ModeloProducto.findAll()
        .then(productos => {
            contenido.tipo = 1;
            contenido.datos = productos;
            Respuesta.enviar(200, contenido, res);
        })
        .catch(err => {
            contenido.tipo = 0;
            contenido.msj = `Error al obtener los productos: ${err.message}`;
            Respuesta.enviar(500, contenido, res);
        });
};

/** 
 * @function buscarIdProducto
 * @description obtiene el producto por su id
**/
exports.buscarIdProducto = async (req, res) => {
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
            await ModeloProducto.findByPk(id)
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
 * @function buscarNombreProducto
 * @description busca el producto por su nombre
**/
exports.buscarNombreProducto = async (req, res) => {
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
            const {tipoProducto} = req.query;
            await ModeloProducto.findAll({
                where: {
                    tipoProducto: {
                        [Op.like]: tipoProducto
                    },
                }
            }).then((data) => {
                contenido.tipo = 1;
                contenido.datos = data;
                Respuesta.enviar(200, contenido, res);
            }).catch((er) => {
                console.log(er);
                contenido.tipo = 0;
                contenido.msj.push('Error al cargar los datos del producto');
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
 * @function guardarProducto
 * @description guarda el producto
**/
exports.guardarProducto = async (req, res) => {
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
            const { cantidad, pesoUnidad, medidaPeso } = req.body;
            let total = 0;

            if (cantidad && pesoUnidad && medidaPeso) {
                if (medidaPeso === 'kg') {
                    total = cantidad * pesoUnidad;
                } else if (medidaPeso === 'lb') {
                    total = (cantidad * pesoUnidad) * 2.20462; // Convertir de libras a kilogramos
                }
            }

            const producto = await ModeloProducto.create({
                fechaEntrada: req.body.fechaEntrada,
                tipoProducto: req.body.tipoProducto,
                cantidad: req.body.cantidad,
                pesoUnidad: req.body.pesoUnidad,
                medidaPeso: req.body.medidaPeso,
                total: total
            });

            // Crear automáticamente una entrada en la tabla de inventario
            await ModeloInventario.create({
                stock: cantidad,
                fechaEntrada: producto.fechaEntrada,
                ProductoId: producto.id,
            });

            contenido.tipo = 1;
            contenido.datos = producto;
            contenido.msj = "Producto guardado correctamente";
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
 * @function editarProducto
 * @description edita el producto
**/
exports.editarProducto = async (req, res) => {
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
            const { tipoProducto, cantidad, pesoUnidad, medidaPeso, fechaEntrada } = req.body;
            let total = 0;

            if (cantidad && pesoUnidad && medidaPeso) {
                if (medidaPeso === 'kg') {
                    total = cantidad * pesoUnidad;
                } else if (medidaPeso === 'lb') {
                    total = (cantidad * pesoUnidad) * 2.20462; // Convertir de libras a kilogramos
                }
            }

            const producto = await ModeloProducto.findByPk(id);
            if (!producto) {
                contenido.tipo = 0;
                contenido.msj = "Producto no encontrado";
                return Respuesta.enviar(404, contenido, res);
            }

            await producto.update({ tipoProducto, cantidad, pesoUnidad, medidaPeso, total, fechaEntrada });

            // Actualizar inventario si es necesario
            const inventario = await ModeloInventario.findOne({ where: { ProductoId: producto.id } });
            if (inventario) {
                await inventario.update({ stock: cantidad, fechaEntrada });
            }

            contenido.tipo = 1;
            contenido.datos = producto;
            contenido.msj = "Producto actualizado correctamente";
            Respuesta.enviar(200, contenido, res);
        } catch (error) {
            console.log(error);
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }
};


