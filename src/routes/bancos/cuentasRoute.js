
const cuentaController = require('../../controller/bancos/cuentaController');
const { body, query } = require("express-validator");
var router = require("express").Router();
const ModeloCuenta = require('../../models/bancos/cuenta');
const ModeloBanco = require('../../models/bancos/banco');
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
 * @memberof routes/api/cuenta
 * @method listar
 * @description Lista todos los cuentas guardados en la base de datos
 * {@link server/api/bancos/listar} 
 */
router.get("/listar", cuentaController.listarCuentas);

/**
 * @memberof routes/api/cuenta
 * @method buscarid
 * @description Lista todos los cuenta de los bancos guardados en la base de datos
 * {@link server/api/bancos/buscarid}
 * @param {integer} id del cuenta 
 */
router.get("/buscarid", 
query("id").isInt().withMessage("El id debe ser un número entero"),
cuentaController.buscarIdCuenta);

/**
 * @memberof routes/api/cuenta
 * @method buscaridbanco
 * @description Lista todos los cuenta de los bancos guardados en la base de datos
 * {@link server/api/bancos/buscarid}
 * @param {integer} bancoId del cuenta 
 */
router.get("/buscaridbanco", 
query("bancoId").isInt().withMessage("El id debe ser un número entero")
.custom(async value => {
  if(!value){
      throw new Error('El Id del banco no permite valores nulos');
  }
  else{
      const buscarBanco = await ModeloBanco.findOne({
        where: {id: value}
      });
      if (!buscarBanco) {
        throw new Error('El Id del banco no exite');
      }
  }
}),
cuentaController.buscarIdBanco);

/**
 * @memberof routes/api/cuenta
 * @method buscarnombre
 * @description Lista todos los empleados guardados en la base de datos con los datos de busqueda
 * {@link server/api/cuentas/buscarnombre}
 * @param {string} nombre del cuenta 
 */
router.get("/buscarnombre", 
query("nombre").isLength({min: 3, max: 50}).withMessage("El limite de caracteres de de 3 - 50"),
cuentaController.buscarNombreCuenta);

/**
 * @memberof routes/api/cuenta
 * @method buscarnumero
 * @description Lista todos los empleados guardados en la base de datos con los datos de busqueda
 * {@link server/api/cuentas/buscarnombre}
 * @param {string} numero del cuenta 
 */
router.get("/numero", 
query("numero").isLength({min: 3, max: 50}).withMessage("El limite de caracteres de de 3 - 50"),
cuentaController.buscarNumeroCuenta);

/**
 * @memberof routes/api/cuenta
 * @method guardar
 * @description POST. Guardar los datos de un cuenta
 * 
 * {@link server/api/cuentas/guardar}
 * @param {string} numero.required Numero del cuenta
 * @param {string} numero.required Nombre del cuenta
 * @param {integer} bancoId.required Id del banco
 * @param {boolean} activo Estado del cuenta activo o inactivo 
 */
router.post("/guardar",
body("numero").isLength({min: 3, max: 50}).withMessage("El limite de caracteres de de 3 - 50"), 
body("nombre").isLength({min: 3, max: 50}).withMessage("El limite de caracteres es de 3 - 50"),
body("bancoId").isInt().withMessage("El id debe ser un número entero")
.custom(async value => {
    if(!value){
        throw new Error('El Id del banco no permite valores nulos');
    }
    else{
        const buscarBanco = await ModeloBanco.findOne({
          where: {id: value}
        });
        if (!buscarBanco) {
          throw new Error('El Id del banco no exite');
        }
    }
  }),
body("activo").optional().isBoolean().withMessage("Solo se permiten valores boleanos"),
cuentaController.guardarCuenta);

/**
 * @memberof routes/api/cuenta
 * @method editar
 * @description PUT. Guardar los datos de un cuenta
 * {@link server/api/cuentas/editar}
 * @param {string} nombre.required Nombre del cuenta 
 */
router.put("/editar", 
query("id").isInt().withMessage("El id debe ser un número entero")
.custom(async value => {
    if(!value){
        throw new Error('El id no permite valores nulos');
    }
    else{
        const buscarCuenta = await ModeloCuenta.findOne({
          where: {id: value}
        });
        if (!buscarCuenta) {
          throw new Error('El Id del cuenta no exite');
        }
    }
  }),
  body("nombre").isLength({min: 3, max: 50}).withMessage("El limite de caracteres es de 3 - 50"),
  body("bancoId").isInt().withMessage("El id debe ser un número entero")
.custom(async value => {
    if(!value){
        throw new Error('El Id del banco no permite valores nulos');
    }
    else{
        const buscarBanco = await ModeloBanco.findOne({
          where: {id: value}
        });
        if (!buscarBanco) {
          throw new Error('El Id del banco no exite');
        }
    }
  }),
  body("activo").optional().isBoolean().withMessage("Solo se permiten valores boleanos"),  
  cuentaController.editarCuenta);

/**
 * @memberof routes/api/cuenta
 * @method activar
 * @description PUT. Actualiza si un cuenta esta activo o inactivo
 * {@link server/api/cuentas/activar}
 * @param {boolean} activo.required Los valores pueden ser true o false 
 */
router.put("/activar", 
query("id").isInt().withMessage("El id debe ser un numero entero"),
body("activo").isBoolean().withMessage("Solo se permiten valores boleanos"),
cuentaController.activarCuenta);

module.exports = router;