/**
 * Controlador de alquiler
 * @author Jose Mario Salgado
 * @date 20/01/2024
 * 
 */

const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const ModeloProveedor = require('../../models/Inventario/proveedor');
const Respuesta = require('../../helpers/respuesta');
const msjErrores = require('../../helpers/msjErrores');


/**
 * @function listarClientes
 * @description Obtener todos los proveedores.
 */
exports.listarProveedor = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    ModeloProveedor.findAll()
    .then(proveedor => {
        contenido.tipo = 1;
        contenido.datos = proveedor;
        Respuesta.enviar(200, contenido, res);
    })
    .catch(err => {
        contenido.tipo = 0;
        contenido.msj = `Error al botener el proveedor: ${err.message}`;
        Respuesta.enviar(500, contenido, res);
    })
};

/** 
 * @function buscarIdProveedor
 * @description obtiene el proveedor por su id
**/
exports.buscarIdProveedor = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    const proveedorId = req.query.id;

    ModeloProveedor.findByPk(proveedorId)
        .then(proveedor => {
            if (proveedor) {
                contenido.tipo = 1;
                contenido.datos = proveedor;
                Respuesta.enviar(200, contenido, res);
            } else {
                contenido.msj = 'Proveedor no encontrado';
                Respuesta.enviar(404, contenido, res);
            }
        })
        .catch(err => {
            contenido.tipo = 0;
            contenido.msj = `Error al obtener el proveedor: ${err.message}`;
            Respuesta.enviar(500, contenido, res);
        });
};

/** 
 * @function buscarnombreProveedor
 * @description busca el proveedor por su nombre
**/
exports.buscarnombreProveedor = async (req, res) => {
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
            const {nombreProveedor} = req.query;
            await ModeloProveedor.findAll({
                where: {
                    [Op.or]: {
                        nombreProveedor: {
                            [Op.like]: nombreProveedor
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
 * @function guardarProveedor
 * @description esta accion guarda el proveedor
**/
exports.guardarProveedor = async (req, res) => {
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
            await ModeloProveedor.create({ ...req.body }).then((data) => {
                contenido.tipo = 1;
                contenido.datos = data;
                contenido.msj = "Proveedor guardado correctamente";
                Respuesta.enviar(200, contenido, res);
            }).catch((er2) => {
                console.log(er2)
                contenido.tipo = 0;
                contenido.datos = er2;
                contenido.msj = "Error al guardar el proveedor";
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
 * @function editarProveedor
 * @description esta accion actualiza el proveedor
**/
exports.editarProveedor = async (req, res) => {
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
            const { nombreProveedor } = req.body;
            const buscarProveedor = await ModeloProveedor.findOne({
                where:{
                    [Op.and]: [
                        { nombreProveedor: nombreProveedor },
                        { id: { [Op.not]: id } }
                    ]
                }
            });
            console.log(buscarProveedor);
            if(buscarProveedor){
                contenido.tipo = 1;
                contenido.datos = [];
                contenido.msj = "Ya existe un proveedor con este nombre";
                Respuesta.enviar(400, contenido, res);
            }
            else{
                await ModeloProveedor.update(
                    { ...req.body },
                    { where: { id: id } }
                ).then(async(data) => {
                    contenido.tipo = 1;
                    contenido.datos = data;
                    contenido.msj = "Proveedor actualizado correctamente";
                    Respuesta.enviar(200, contenido, res);
                }).catch((er2) => {
                    contenido.tipo = 0;
                    contenido.datos = er2;
                    contenido.msj = "Error al actualizar el proveedor";
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