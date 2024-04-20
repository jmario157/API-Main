/**
 * Controlador de pagos
 * @author Carlos Flores
 * @date 23/08/2023
 * 
 */

//Importar modelos
const db = require("../../Config/db");
const ModeloPago = require("../../models/pagos/pago");
const ModeloCuenta = require("../../models/bancos/cuenta");
const ModeloCliente = require('../../models/clientes/cliente');
const ModeloUsuario = require('../../models/empleados/usuario');
const ModeloEmpleado = require('../../models/empleados/empleado');
const ModeloPagoEfectivo = require('../../models/pagos/pagoefectivo');
const ModeloPagoTarjeta = require('../../models/pagos/pagotarjeta');
const ModeloPos = require('../../models/bancos/pos');
const ModeloBanco = require('../../models/bancos/banco');
const ModeloPagoTrasferencia = require('../../models/pagos/pagotransferencia');

//importar helpers
const Respuesta = require("../../helpers/respuesta");
const { validationResult } = require("express-validator");
const { Op, col, fn } = require("sequelize");
const msjErrores = require("../../helpers/msjErrores");

/**
 * @function listarPagos
 * @description Lista los pagos
 */
exports.listarPagos = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    try {
        await ModeloPago.findAll(
            {
                include: [
                    {
                        model: ModeloCliente,
                        attributes: ['identidad', 'nombreprimer', 'nombresegundo', 'apellidoprimer', 'apellidosegundo'],
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
                        model: ModeloPagoEfectivo,
                        attributes: ['monto'],
                    },
                    {
                        model: ModeloPagoTarjeta,
                        attributes: ['monto'],
                        include: {
                            model: ModeloPos,
                            attributes: ['nombre'],
                        }
                    },
                    {
                        model: ModeloPagoTrasferencia,
                        attributes: ['monto'],
                        include: {
                            model: ModeloCuenta,
                            attributes: ['numero'],
                            include: {
                                model: ModeloBanco,
                                attributes: ['nombre']
                            }
                        }
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
                contenido.msj = "Error al cargar los datos de pagos";
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
 * @description Busca los datos de un pago por su id
 */
exports.buscarIdPago = async (req, res) => {
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
            await ModeloPago.findOne({
                include: [
                    {
                        model: ModeloCliente,
                        attributes: ['identidad', 'nombreprimer', 'nombresegundo', 'apellidoprimer', 'apellidosegundo'],
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
                        model: ModeloPagoEfectivo,
                        attributes: ['monto'],
                    },
                    {
                        model: ModeloPagoTarjeta,
                        attributes: ['monto'],
                        include: {
                            model: ModeloPos,
                            attributes: ['nombre'],
                        }
                    },
                    {
                        model: ModeloPagoTrasferencia,
                        attributes: ['monto'],
                        include: {
                            model: ModeloCuenta,
                            attributes: ['numero'],
                            include: {
                                model: ModeloBanco,
                                attributes: ['nombre']
                            }
                        }
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
                    contenido.msj = "Error al cargar los datos del pago";
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
 * @function generarDatosCierre
 * @description Genera los datos para realizar el cierre de caja
 */
exports.generarDatosCierre = async (req, res) => {
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
            const { cajaId } = req.query;
            await ModeloPago.findAll({
                attributes: [
                    'id', 'pago', 'recibido',
                    [fn('sum', col('pagoefectivos.monto')),'totalEfectivo'],
                    [fn('sum', col('pagotarjeta.monto')),'totalPos'],
                    [fn('sum', col('pagotransferencia.monto')),'totalTransferencia'],
                ],
                include: [
                    {
                        model: ModeloUsuario,
                        attributes: ['login'],
                        include: {
                            model: ModeloEmpleado,
                            attributes: ['primernombre', 'segundonombre', 'primerapellido', 'segundoapellido'],
                        }
                    },
                    {
                        model: ModeloPagoEfectivo,
                        attributes: [],
                    },
                    {
                        model: ModeloPagoTarjeta,
                        attributes: [],
                    },
                    {
                        model: ModeloPagoTrasferencia,
                        attributes: [],
                    },
                ],
                where: { cajaId: cajaId },
                group: ['pago.id']
            }).
                then((data) => {
                    contenido.tipo = 1;
                    contenido.datos = data;
                    Respuesta.enviar(200, contenido, res);
                }).
                catch((er) => {
                    console.log(er);
                    contenido.tipo = 0;
                    contenido.msj = "Error al cargar los datos del pago";
                    Respuesta.enviar(500, contenido, res);
                });
        } catch (error) {
            console.log(error);
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }
}

/**
 * @function buscarIdCliente
 * @description Busca los datos de un pago por su id
 */
exports.buscarIdCliente = async (req, res) => {
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
            await ModeloPago.findOne({
                include: [
                    {
                        model: ModeloPagoEfectivo,
                        attributes: ['monto'],
                    },
                    {
                        model: ModeloPagoTarjeta,
                        attributes: ['monto'],
                        include: {
                            model: ModeloPos,
                            attributes: ['nombre'],
                        }
                    },
                    {
                        model: ModeloPagoTrasferencia,
                        attributes: ['monto'],
                        include: {
                            model: ModeloCuenta,
                            attributes: ['numero'],
                            include: {
                                model: ModeloBanco,
                                attributes: ['nombre']
                            }
                        }
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
                    contenido.msj = "Error al cargar los datos del pago";
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
 * @function guardarPago
 * @description Guarda los datos de un pago
 */
exports.guardarPago = async (req, res) => {
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
        const t = await db.transaction();
        try {
            var pagoId = 0;
            var valido = false;
            const pago = req.body;
            await ModeloPago.create({ ...pago }, { transaction: t })
                .then((dataPago) => {
                    pagoId = dataPago.id;
                    contenido.datos = { pagoId: pagoId };
                })
                .catch((errorPago) => {
                    console.log(errorPago);
                    contenido.tipo = 2;
                    contenido.datos = [];
                    contenido.msj = "Error al guardar el pago";
                    valido = false;
                });
            if (valido && pago.efectivo) {
                await ModeloPagoEfectivo.create({ ...pago.efectivo, pagoId }, { transaction: t })
                    .catch((errorPagoEfectivo) => {
                        contenido.tipo = 2;
                        contenido.datos = [];
                        contenido.msj = "Error al guardar el pago en efectivo";
                        valido = false;
                    });
            }
            if (valido && pago.transferencia) {
                var transferencias = [];
                pago.transferencia.forEach(f => {
                    transferencias.push({ ...f, pagoId })
                });
                await ModeloPagoTrasferencia.bulkCreate(transferencias, { transaction: t })
                    .catch((errorPagotransferencias) => {
                        contenido.tipo = 2;
                        contenido.datos = [];
                        contenido.msj = "Error al guardar el pago en transferencias";
                        valido = false;
                    });
            }
            if (valido && pago.tarjeta) {
                var tarjetas = [];
                pago.tarjeta.forEach(f => {
                    tarjetas.push({ ...f, pagoId })
                });
                await ModeloPagoTarjeta.bulkCreate(tarjetas, { transaction: t })
                    .catch((errorPagoTarjetas) => {
                        contenido.tipo = 2;
                        contenido.datos = [];
                        contenido.msj = "Error al guardar el pago en tarjetas";
                        valido = false;
                    });
            }
            if (valido) {
                await t.commit();
                Respuesta.enviar(200, contenido, res);
            }
            else {
                await t.rollback();
                Respuesta.enviar(400, contenido, res);
            }
        } catch (error) {
            await t.rollback();
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }

}

/**
 * @function editarPago
 * @description Actualiza los datos de un pago
 */
exports.editarPago = async (req, res) => {
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
            const buscarBanco = await ModeloPago.findOne({
                where: {
                    nombre: nombre,
                    id: { [Op.not]: id }
                }
            });
            if (buscarBanco) {
                contenido.tipo = 2;
                contenido.datos = buscarBanco;
                contenido.msj = "Ya existe un pago con esta nombre";
                Respuesta.enviar(400, contenido, res);
            } else {
                await ModeloPago.update(
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
            }
        } catch (error) {
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }

}

/**
 * @function activarBanco
 * @description Actualiza el estado de un pago
 */
exports.activarBanco = async (req, res) => {
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
            await ModeloPago.update(
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