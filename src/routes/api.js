/**
 * Rutas de la api
 * @author Carlos Flores
 * @date 2021 - 02 - 20
 * @namespace routes/api
 */

const express = require("express");
const router = express.Router();

//Importar las rutas
const cargos = require("./empleados/cargosRoute");
const empleados = require("./empleados/empleadosRoute");
const profesiones = require('./clientes/profesionesRoute');
const clientes = require('./clientes/clientesRoute');
const autenticacion = require('./autenticacion/autenticacionRoute');
const usuario = require('./empleados/usuariosRoute');
const bancos = require('./bancos/bancosRoute');
const cuentas = require('./bancos/cuentasRoute');
const pos = require('./bancos/posRoute');
const lugares = require('./lugares/lugaresRoute');
const municipios = require('./lugares/municipiosRoute');
const departamentos = require('./lugares/departamentosRoute');
const paises = require('./lugares/paisesRoute');
const cajas = require('./cajas/cajasRoute');
const aperturas = require('./cajas/aperturasRoute');
const estaciones = require('./configuraciones/estacionesRoute');
const cierres = require('./cajas/cierresRoute');
const pagos = require('./cajas/pagosRoute');
const alquiler = require('./alquiler/alquilerRoute');
const proveedor = require('./inventario/proveedorRoute');
const producto = require('./inventario/productoRoute');
const inventario = require('./inventario/inventarioRoute');
const nota = require('./notaPeso/notaRoute');
const detalle = require('./notaPeso/detalleRoute');
const factura = require('./factura/facturaRoute')
const ticket = require('./ticket/ticketRoute');

/**
 * @memberof routes/api
 * @name cargos
 * @description Contiene las rutas de los cargos de los empleados
 */
router.use("/cargos", cargos);

/**
 * @memberof routes/api
 * @name empleados
 * @description Contiene las rutas de los empleados
 */
router.use("/empleados", empleados);

/**
 * @memberof routes/clientes
 * @name clientes
 * @description Contiene las rutas de los lotes
 */
router.use("/clientes", clientes);

/**
 * @memberof routes/usuarios
 * @name usuarios
 * @description Contiene las rutas de los usuarios
 */
router.use("/usuarios", usuario);

/**
 * @memberof routes/autenticacion
 * @name autenticacion
 * @description Contiene las rutas de la autenticacion
 */
router.use("/autenticacion", autenticacion);

/**
 * @memberof routes/bancos
 * @name bancos
 * @description Contiene las rutas del bancos
 */
router.use("/bancos", bancos);

/**
 * @memberof routes/profesiones
 * @name profesiones
 * @description Contiene las rutas de las profesiones
 */
router.use("/profesiones", profesiones);

/**
 * @memberof routes/cuentas
 * @name cuentas
 * @description Contiene las rutas de las cuentas
 */
router.use("/cuentas", cuentas);

/**
 * @memberof routes/pos
 * @name pos
 * @description Contiene las rutas de las cuentas
 */
router.use("/pos", pos);

/**
 * @memberof routes/lugares
 * @name lugares
 * @description Contiene las rutas de los lugares
 */
router.use("/lugares", lugares);

/**
 * @memberof routes/municipios
 * @name municipios
 * @description Contiene las rutas de los municipios
 */
router.use("/municipios", municipios);

/**
 * @memberof routes/departamentos
 * @name departamentos
 * @description Contiene las rutas de los departamentos
 */
router.use("/departamentos", departamentos);

/**
 * @memberof routes/paises
 * @name paises
 * @description Contiene las rutas de los departamentos
 */
router.use("/paises", paises);

/**
 * @memberof routes/cajas
 * @name cajas
 * @description Contiene las rutas de los cajas
 */
router.use("/cajas", cajas);

/**
 * @memberof routes/cajas
 * @name cajas
 * @description Contiene las rutas de los cajas
 */
router.use("/aperturas", aperturas);

/**
 * @memberof routes/estaciones
 * @name cajas
 * @description Contiene las rutas de las estaciones
 */
router.use("/estaciones", estaciones);

/**
 * @memberof routes/cierres
 * @name cajas
 * @description Contiene las rutas de las estaciones
 */
router.use("/cierres", cierres);

/**
 * @memberof routes/pagos
 * @name cajas
 * @description Contiene las rutas de los pagos
 */
router.use("/pagos", pagos);

/**
 * @memberof routes/alquiler
 * @name alquiler
 * @description Contiene las rutas de alquiler
 */
router.use("/alquiler", alquiler);

/**
 * @memberof routes/proveedor
 * @name proveedor
 * @description Contiene las rutas de proveedor
 */
router.use("/proveedor", proveedor);

/**
 * @memberof routes/producto
 * @name producto
 * @description Contiene las rutas de producto
 */
router.use("/producto", producto);

/**
 * @memberof routes/inventario
 * @name inventario
 * @description Contiene las rutas de inventario
 */
router.use("/inventario", inventario);

/**
 * @memberof routes/nota
 * @name nota
 * @description Contiene las rutas de NotaPeso
 */
router.use("/nota", nota);

/**
 * @memberof routes/detalle
 * @name detalle
 * @description Contiene las rutas de detalleNota
 */
router.use("/detalle", detalle);

/**
 * @memberof routes/factura
 * @name factura
 * @description Contiene las rutas de factura
 */
router.use("/factura", factura);

/**
 * @memberof routes/ticket
 * @name ticket
 * @description Contiene las rutas de ticket
 */
router.use("/ticket", ticket);

module.exports = router;