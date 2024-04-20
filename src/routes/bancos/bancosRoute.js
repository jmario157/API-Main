
const bancoController = require('../../controller/bancos/bancoController');
const { body, query } = require("express-validator");
var router = require("express").Router();
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
 * @memberof routes/api/banco
 * @method listar
 * @description Lista todos los bancos guaradados en la base de datos
 * {@link server/api/bancos/listar} 
 */
router.get("/listar", bancoController.listarBancos);

/**
 * @memberof routes/api/banco
 * @method buscarid
 * @description Lista todos los banco de los empleados guardados en la base de datos
 * {@link server/api/bancos/buscarid}
 * @param {integer} id del banco 
 */
router.get("/buscarid", 
query("id").isInt().withMessage("El id debe ser un número entero"),
bancoController.buscarIdBanco);

/**
 * @memberof routes/api/banco
 * @method buscarnombre
 * @description Lista todos los empleados guardados en la base de datos con los datos de busqueda
 * {@link server/api/bancos/buscarnombre}
 * @param {string} nombre del banco 
 */
router.get("/buscarnombre", 
query("nombre").isLength({min: 3, max: 50}).withMessage("El limite de caracteres de de 3 - 50"),
bancoController.buscarNombreBanco);

/**
 * @memberof routes/api/banco
 * @method guardar
 * @description POST. Guardar los datos de un banco
 * 
 * {@link server/api/bancos/guardar}
 * @param {string} nombre.required Nombre del banco
 * @param {string} nombresegundo Segundo nombre del banco
 * @param {boolean} activo Estado del banco activo o inactivo 
 */
router.post("/guardar", 
body("nombre").isLength({min: 3, max: 50}).withMessage("El limite de caracteres es de 3 - 50")
.custom(async value => {
  if(!value){
      throw new Error('El nombre no permite valores nulos');
  }
  else{
      const buscarBanco = await ModeloBanco.findOne({
        where: {nombre: value}
      });
      if (buscarBanco) {
        throw new Error('El nombre del banco ya exite');
      }
  }
}),
body("activo").optional().isBoolean().withMessage("Solo se permiten valores boleanos"),
bancoController.guardarBanco);

/**
 * @memberof routes/api/banco
 * @method editar
 * @description PUT. Guardar los datos de un banco
 * {@link server/api/bancos/editar}
 * @param {string} nombre.required Nombre del banco 
 */
router.put("/editar", 
query("id").isInt().withMessage("El id debe ser un número entero")
.custom(async value => {
    if(!value){
        throw new Error('El id no permite valores nulos');
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
body("nombre").isLength({min: 3, max: 50}).withMessage("El limite de caracteres es de 3 - 50"),
body("activo").optional().isBoolean().withMessage("Solo se permiten valores boleanos"),
bancoController.editarBanco);

/**
 * @memberof routes/api/banco
 * @method activar
 * @description PUT. Actualiza si un banco esta activo o inactivo
 * {@link server/api/bancos/activar}
 * @param {boolean} activo.required Los valores pueden ser true o false 
 */
router.put("/activar", 
query("id").isInt().withMessage("El id debe ser un numero entero"),
body("activo").isBoolean().withMessage("Solo se permiten valores boleanos"),
bancoController.activarBanco);

module.exports = router;