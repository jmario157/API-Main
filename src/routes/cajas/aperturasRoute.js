
const aperturaController = require('../../controller/cajas/aperturaController');
const { body, query } = require("express-validator");
var router = require("express").Router();
const ModeloApertura = require('../../models/cajas/apertura');
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
 * @memberof routes/api/apertura
 * @method listar
 * @description Lista todos los aperturas guardados en la base de datos
 * {@link server/api/aperturas/listar} 
 */
router.get("/listar", aperturaController.listarAperturas);

/**
 * @memberof routes/api/apertura
 * @method buscarid
 * @description Lista todos los apertura de los empleados guardados en la base de datos
 * {@link server/api/aperturas/buscarid}
 * @param {integer} id del apertura 
 */
router.get("/buscarid",
  query("id").isInt().withMessage("El id debe ser un número entero"),
  aperturaController.buscarIdApertura);

/**
 * @memberof routes/api/apertura
 * @method guardar
 * @description POST. Guardar los datos de un apertura
 * 
 * {@link server/api/aperturas/guardar}
 * @param {string} nombre.required Nombre del apertura
 * @param {string} nombresegundo Segundo nombre del apertura
 * @param {boolean} activo Estado del apertura activo o inactivo 
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
  body("efectivo").isDecimal().withMessage("Debe escribir el valor del efectivo"),
  aperturaController.guardarApertura);

/**
 * @memberof routes/api/apertura
 * @method editar
 * @description PUT. Guardar los datos de un apertura
 * {@link server/api/aperturas/editar}
 * @param {string} nombre.required Nombre del apertura 
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
          throw new Error('El Id del apertura no exite');
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
  body("efectivo").isDecimal().withMessage("Debe escribir el valor del efectivo"),
  aperturaController.editarApertura);

/**
 * @memberof routes/api/apertura
 * @method activar
 * @description PUT. Actualiza si un apertura esta activo o inactivo
 * {@link server/api/aperturas/activar}
 * @param {boolean} activo.required Los valores pueden ser true o false 
 */
router.put("/anular",
  query("id").isInt().withMessage("El id debe ser un numero entero")
  .custom(async value => {
    if (!value) {
      throw new Error('El id no permite valores nulos');
    }
    else {
      const buscarCaja = await ModeloApertura.findOne({
        where: { id: value }
      });
      if (!buscarCaja) {
        throw new Error('El Id del apertura no exite');
      }
    }
  }),
  body("anulado").isBoolean().withMessage("Solo se permiten valores boleanos"),
  aperturaController.anularApertura);

module.exports = router;