
const posController = require('../../controller/bancos/posController');
const { body, query } = require("express-validator");
var router = require("express").Router();
const ModeloPos = require('../../models/bancos/pos');
const ModeloBanco = require('../../models/bancos/banco');
const ModeloCuenta = require('../../models/bancos/cuenta');
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
 * @memberof routes/api/pos
 * @method listar
 * @description Lista todos los pos guardados en la base de datos
 * {@link server/api/bancos/listar} 
 */
router.get("/listar", posController.listarPos);

/**
 * @memberof routes/api/pos
 * @method buscarid
 * @description Lista todos los pos de los bancos guardados en la base de datos
 * {@link server/api/bancos/buscarid}
 * @param {integer} id del pos 
 */
router.get("/buscarid", 
query("id").isInt().withMessage("El id debe ser un número entero"),
posController.buscarIdpos);

/**
 * @memberof routes/api/pos
 * @method buscaridbanco
 * @description Lista todos los pos de los bancos guardados en la base de datos
 * {@link server/api/bancos/buscarid}
 * @param {integer} bancoId del pos 
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
posController.buscarIdBanco);

/**
 * @memberof routes/api/pos
 * @method buscarnombre
 * @description Lista todos los empleados guardados en la base de datos con los datos de busqueda
 * {@link server/api/pos/buscarnombre}
 * @param {string} nombre del pos 
 */
router.get("/buscarnombre", 
query("nombre").isLength({min: 3, max: 50}).withMessage("El limite de caracteres de de 3 - 50"),
posController.buscarNombrepos);

/**
 * @memberof routes/api/pos
 * @method buscarnumero
 * @description Lista todos los empleados guardados en la base de datos con los datos de busqueda
 * {@link server/api/pos/buscarnombre}
 * @param {string} nombre del pos 
 */
router.get("/numero", 
query("numero").isLength({min: 3, max: 50}).withMessage("El limite de caracteres de de 3 - 50"),
posController.buscarNumeropos);

/**
 * @memberof routes/api/pos
 * @method guardar
 * @description POST. Guardar los datos de un pos
 * 
 * {@link server/api/pos/guardar}
 * @param {string} nombre.required Nombre del pos
 * @param {integer} cuentaId.required Id de la cuenta vinculada
 * @param {boolean} activo Estado del pos activo o inactivo 
 */
router.post("/guardar",
body("nombre").isLength({min: 3, max: 50}).withMessage("El limite de caracteres es de 3 - 50"),
body("cuentumId").isInt().withMessage("El id debe ser un número entero")
.custom(async value => {
    if(!value){
        throw new Error('El Id de la cuenta no permite valores nulos');
    }
    else{
        const buscarCuenta = await ModeloCuenta.findOne({
          where: {id: value}
        });
        if (!buscarCuenta) {
          throw new Error('El Id de la cuenta no exite');
        }
    }
  }),
body("activo").optional().isBoolean().withMessage("Solo se permiten valores boleanos"),
posController.guardarpos);

/**
 * @memberof routes/api/pos
 * @method editar
 * @description PUT. Guardar los datos de un pos
 * {@link server/api/pos/editar}
 * @param {string} nombre.required Nombre del pos 
 */
router.put("/editar", 
query("id").isInt().withMessage("El id debe ser un número entero")
.custom(async value => {
    if(!value){
        throw new Error('El id no permite valores nulos');
    }
    else{
        const buscarPos = await ModeloPos.findOne({
          where: {id: value}
        });
        if (!buscarPos) {
          throw new Error('El Id del pos no exite');
        }
    }
  }),
  body("nombre").isLength({min: 3, max: 50}).withMessage("El limite de caracteres es de 3 - 50"),
  body("cuentumId").isInt().withMessage("El id debe ser un número entero")
.custom(async value => {
    if(!value){
        throw new Error('El Id de la cuenta no permite valores nulos');
    }
    else{
        const buscarCuenta = await ModeloCuenta.findOne({
          where: {id: value}
        });
        if (!buscarCuenta) {
          throw new Error('El Id de la cuenta no exite');
        }
    }
  }),
  body("activo").optional().isBoolean().withMessage("Solo se permiten valores boleanos"),  
  posController.editarpos);

/**
 * @memberof routes/api/pos
 * @method activar
 * @description PUT. Actualiza si un pos esta activo o inactivo
 * {@link server/api/pos/activar}
 * @param {boolean} activo.required Los valores pueden ser true o false 
 */
router.put("/activar", 
query("id").isInt().withMessage("El id debe ser un numero entero"),
body("activo").isBoolean().withMessage("Solo se permiten valores boleanos"),
posController.activarpos);

module.exports = router;