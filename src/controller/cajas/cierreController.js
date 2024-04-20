/**
 * Controlador de cierres
 * @author Carlos Flores
 * @date 28/08/2023
 * 
 */

//Importar modelos
const ModeloCierre = require("../../models/cajas/cierre");
const ModeloApertura = require("../../models/cajas/apertura");
const ModeloCaja = require('../../models/cajas/caja');
const ModeloUsuario = require('../../models/empleados/usuario');
const ModeloEmpleado = require('../../models/empleados/empleado');
const ModeloPago = require('../../models/pagos/pago');
const ModeloPagoEfectivo = require('../../models/pagos/pagoefectivo');
const ModeloPagoTransferencia = require('../../models/pagos/pagotransferencia');
const ModeloPagoTarjeta = require('../../models/pagos/pagotarjeta');
//importar helpers
const Respuesta = require("../../helpers/respuesta");
const { validationResult } = require("express-validator");
const { Op, fn, col, query } = require("sequelize");
const msjErrores = require("../../helpers/msjErrores");

/**
 * @function listarCierres
 * @description Lista los cierres
 */
exports.listarCierres = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    try {
        await ModeloCierre.findAll(
            {
                include: [
                    {
                        model: ModeloCaja,
                        attributes: ['nombre'],
                    },
                    {
                        model: ModeloUsuario,
                        attributes: ['login'],
                        include: {
                            model: ModeloEmpleado,
                            attributes: ['primernombre', 'segundonombre', 'primerapellido', 'segundoapellido'],
                        }
                    },
                    {
                        model: ModeloApertura,
                        attributes: ['efectivo'],
                    },
                ],
            }
        ).
            then((data) => {
                contenido.tipo = 1;
                contenido.datos = data;
                Respuesta.enviar(200, contenido, res);
            }).
            catch((er) => {
                contenido.tipo = 0;
                contenido.msj = "Error al cargar los datos de cierres";
                Respuesta.enviar(500, contenido, res);
            });
    } catch (error) {
        contenido.tipo = 0;
        contenido.msj = "Error en el servidor";
        Respuesta.enviar(500, contenido, res);
    }
}

/**
 * @function buscarIdCierre
 * @description Busca los datos de un cierre por su id
 */
exports.buscarIdCierre = async (req, res) => {
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
            await ModeloCierre.findOne({
                include: [
                    {
                        model: ModeloCaja,
                        attributes: ['nombre'],
                    },
                    {
                        model: ModeloUsuario,
                        attributes: ['login'],
                        include: {
                            model: ModeloEmpleado,
                            attributes: ['primernombre', 'segundonombre', 'primerapellido', 'segundoapellido'],
                        }
                    },
                    {
                        model: ModeloApertura,
                        attributes: ['efectivo'],
                    },
                ],
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
                    contenido.msj = "Error al cargar los datos del cierre";
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
 * @function datosCierre
 * @description Lista los datos del cierre
 */
exports.datosCierre = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    try {
        const cajaId = req.query.id;
        var pagos=0, efectivo = 0, tarjetas = 0, transferencias = 0
        const listaPagos = await ModeloPago.findAll(
            {
                attributes: ['pago'],
                include:[{
                    model: ModeloPagoEfectivo,
                    attributes:['monto'],
                },
                {
                    model: ModeloPagoTarjeta,
                    attributes:['monto'],
                },
                {
                    model: ModeloPagoTransferencia,
                    attributes:['monto'],
                }
            ],
                where: {
                    cierreId: null, cajaId: cajaId
                }
            }
        );
        console.log(listaPagos);
        listaPagos.forEach(p => {
            pagos+=p.pago;
            p.pagoefectivos.forEach(pe=> {
                efectivo+= pe.monto;
            });
            p.pagotarjeta.forEach(pt=> {
                tarjetas+= pt.monto;
            });
            p.pagotransferencia.forEach(pt=> {
                transferencias+= pt.monto;
            });
        });
        contenido.tipo = 1;
                contenido.datos = {
                    pago: pagos,
                    pagoefectivos: efectivo,
                    pagotarjeta: tarjetas,
                    pagotransferencia: transferencias
                };
                Respuesta.enviar(200, contenido, res);
    } catch (error) {
        console.log(error);
        contenido.tipo = 0;
        contenido.msj = "Error en el servidor";
        Respuesta.enviar(500, contenido, res);
    }
}

/**
 * @function guardarCierre
 * @description Guarda los datos de un cierre
 */
exports.guardarCierre = async (req, res) => {
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
            await ModeloCierre.create({ ...req.body }).then((data) => {
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
 * @function editarCierre
 * @description Actualiza los datos de un cierre
 */
exports.editarCierre = async (req, res) => {
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

            await ModeloCierre.update(
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
 * @function anularCierre
 * @description Actualiza el estado de un cierre
 */
exports.anularCierre = async (req, res) => {
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
            await ModeloCierre.update(
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