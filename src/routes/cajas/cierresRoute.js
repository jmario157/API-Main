
const cierreController = require('../../controller/cajas/cierreController');
const { body, query } = require("express-validator");
var router = require("express").Router();
const ModeloApertura = require('../../models/cajas/cierre');
const ModeloCierre = require('../../models/cajas/cierre');
const ModeloUsuario = require('../../models/empleados/usuario');
const ModeloCaja = require('../../models/cajas/caja');
const { Op } = require('sequelize');

/**
 * 
 */
router.get("/", (req, res) => {

  const data = {
    apiName: "API - SIGBIR",
    propietario: "DESOFIW",
  };
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json(data);
});
/**
 * @memberof routes/api/cierre
 * @method listar
 * @description Lista todos los cierres guardados en la base de datos
 * {@link server/api/cierres/listar} 
 */
router.get("/listar", cierreController.listarCierres);

/**
 * @memberof routes/api/cierre
 * @method buscarid
 * @description Lista todos los cierre de los empleados guardados en la base de datos
 * {@link server/api/cierres/buscarid}
 * @param {integer} id del cierre 
 */
router.get("/buscarid",
  query("id").isInt().withMessage("El id debe ser un número entero"),
  cierreController.buscarIdCierre);

/**
 * @memberof routes/api/cierre
 * @method datosCierre
 * @description Lista todos los cierre de los empleados guardados en la base de datos
 * {@link server/api/cierres/buscarid}
 * @param {integer} id del cierre 
 */
router.get("/datos",
  query("id").isInt().withMessage("El id debe ser un número entero"),
  cierreController.datosCierre);

/**
 * @memberof routes/api/cierre
 * @method guardar
 * @description POST. Guardar los datos de un cierre
 * 
 * {@link server/api/cierres/guardar}
 * @param {string} nombre.required Nombre del cierre
 * @param {string} nombresegundo Segundo nombre del cierre
 * @param {boolean} activo Estado del cierre activo o inactivo 
 */
router.post("/guardar",
  body("cajaId").isInt().withMessage("Seleccione la caja")
    .custom(async value => {
      if (!value) {
        throw new Error('El id de caja no permite valores nulos');
      }
      else {
        const buscarCaja = await ModeloCaja.findOne({
          where: { id: value }
        });
        if (!buscarCaja) {
          throw new Error('El id de caja no existe');
        }
      }
    }),
  body("usuarioId").isInt().withMessage("Seleccione el usuario")
    .custom(async value => {
      if (!value) {
        throw new Error('El id de usuario no permite valores nulos');
      }
      else {
        const buscarUsuario = await ModeloUsuario.findOne({
          where: { id: value }
        });
        if (!buscarUsuario) {
          throw new Error('El id de usuario no existe');
        }
      }
    }),
  body("aperturaId").isInt().withMessage("Seleccione la apertura")
    .custom(async value => {
      if (!value) {
        throw new Error('El id de apertura no permite valores nulos');
      }
      else {
        const buscarApertura = await ModeloApertura.findOne({
          where: { id: value }
        });
        if (!buscarApertura) {
          throw new Error('El id de apertura no existe');
        }
      }
    }),
  body("efectivo").isDecimal().withMessage("Debe escribir el valor del efectivo"),
  body("pos").isDecimal().withMessage("Debe escribir el valor de tarjetas"),
  body("transferencias").isDecimal().withMessage("Debe escribir el valor de las transferencias"),
  body("efectivosistema").isDecimal().withMessage("Debe escribir el valor del efectivo"),
  body("possistema").isDecimal().withMessage("Debe escribir el valor de tarjetas"),
  body("transferenciassistema").isDecimal().withMessage("Debe escribir el valor de las transferencias"),
  cierreController.guardarCierre);

/**
 * @memberof routes/api/cierre
 * @method editar
 * @description PUT. Guardar los datos de un cierre
 * {@link server/api/cierres/editar}
 * @param {string} nombre.required Nombre del cierre 
 */
router.put("/editar",
  query("id").isInt().withMessage("El id debe ser un número entero")
    .custom(async value => {
      if (!value) {
        throw new Error('El id no permite valores nulos');
      }
      else {
        const buscarCaja = await ModeloApertura.findOne({
          where: { id: value }
        });
        if (!buscarCaja) {
          throw new Error('El Id del cierre no exite');
        }
      }
    }),
  body("cajaId").isInt().withMessage("Seleccione la caja")
    .custom(async value => {
      if (!value) {
        throw new Error('El id de caja no permite valores nulos');
      }
      else {
        const buscarCaja = await ModeloCaja.findOne({
          where: { id: value }
        });
        if (!buscarCaja) {
          throw new Error('El id de caja no existe');
        }
      }
    }),
  body("usuarioId").isInt().withMessage("Seleccione el usuario")
    .custom(async value => {
      if (!value) {
        throw new Error('El id de usuario no permite valores nulos');
      }
      else {
        const buscarUsuario = await ModeloUsuario.findOne({
          where: { id: value }
        });
        if (!buscarUsuario) {
          throw new Error('El id de usuario no existe');
        }
      }
    }),
  body("aperturaId").isInt().withMessage("Seleccione la apertura")
    .custom(async value => {
      if (!value) {
        throw new Error('El id de apertura no permite valores nulos');
      }
      else {
        const buscarApertura = await ModeloApertura.findOne({
          where: { id: value }
        });
        if (!buscarApertura) {
          throw new Error('El id de apertura no existe');
        }
      }
    }),
  body("efectivo").isDecimal().withMessage("Debe escribir el valor del efectivo"),
  body("pos").isDecimal().withMessage("Debe escribir el valor de tarjetas"),
  body("transferencias").isDecimal().withMessage("Debe escribir el valor de las transferencias"),
  body("efectivosistema").isDecimal().withMessage("Debe escribir el valor del efectivo"),
  body("possistema").isDecimal().withMessage("Debe escribir el valor de tarjetas"),
  body("transferenciassistema").isDecimal().withMessage("Debe escribir el valor de las transferencias"),
  cierreController.editarCierre);

/**
 * @memberof routes/api/cierre
 * @method activar
 * @description PUT. Actualiza si un cierre esta activo o inactivo
 * {@link server/api/cierres/activar}
 * @param {boolean} activo.required Los valores pueden ser true o false 
 */
router.put("/anular",
  query("id").isInt().withMessage("El id debe ser un numero entero")
    .custom(async value => {
      if (!value) {
        throw new Error('El id no permite valores nulos');
      }
      else {
        const buscarCierre = await ModeloCierre.findOne({
          where: { id: value }
        });
        if (!buscarCierre) {
          throw new Error('El Id del cierre no exite');
        }
      }
    }),
  body("anulado").isBoolean().withMessage("Solo se permiten valores boleanos"),
  cierreController.anularCierre);

module.exports = router;