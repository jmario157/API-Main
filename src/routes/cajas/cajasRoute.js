
const cajaController = require('../../controller/cajas/cajaController');
const { body, query } = require("express-validator");
var router = require("express").Router();
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
 * @memberof routes/api/caja
 * @method listar
 * @description Lista todos los cajas guardados en la base de datos
 * {@link server/api/cajas/listar} 
 */
router.get("/listar", cajaController.listarCajas);

/**
 * @memberof routes/api/caja
 * @method buscarid
 * @description Lista todos los caja de los empleados guardados en la base de datos
 * {@link server/api/cajas/buscarid}
 * @param {integer} id del caja 
 */
router.get("/buscarid", 
query("id").isInt().withMessage("El id debe ser un número entero"),
cajaController.buscarIdCaja);

/**
 * @memberof routes/api/caja
 * @method buscarid
 * @description Lista todos los caja de los empleados guardados en la base de datos
 * {@link server/api/cajas/buscarid}
 * @param {integer} id del caja 
 */
router.get("/buscarip", 
cajaController.buscarIpCaja);

/**
 * @memberof routes/api/caja
 * @method buscarnombre
 * @description Lista todos los empleados guardados en la base de datos con los datos de busqueda
 * {@link server/api/cajas/buscarnombre}
 * @param {string} nombre del caja 
 */
router.get("/buscarnombre", 
query("nombre").isLength({min: 3, max: 50}).withMessage("El limite de caracteres de de 3 - 50"),
cajaController.buscarNombreCaja);

/**
 * @memberof routes/api/caja
 * @method guardar
 * @description POST. Guardar los datos de un caja
 * 
 * {@link server/api/cajas/guardar}
 * @param {string} nombre.required Nombre del caja
 * @param {string} nombresegundo Segundo nombre del caja
 * @param {boolean} activo Estado del caja activo o inactivo 
 */
router.post("/guardar", 
body("nombre").isLength({min: 3, max: 50}).withMessage("El limite de caracteres es de 3 - 50")
.custom(async value => {
  if(!value){
      throw new Error('El nombre no permite valores nulos');
  }
  else{
      const buscarCaja = await ModeloCaja.findOne({
        where: {nombre: value}
      });
      if (buscarCaja) {
        throw new Error('El nombre del caja ya exite');
      }
  }
}),
body("estado").optional().isIn(['CE', 'AB']).withMessage("Solo se permiten valores AB, CE"),
cajaController.guardarCaja);

/**
 * @memberof routes/api/caja
 * @method editar
 * @description PUT. Guardar los datos de un caja
 * {@link server/api/cajas/editar}
 * @param {string} nombre.required Nombre del caja 
 */
router.put("/editar", 
query("id").isInt().withMessage("El id debe ser un número entero")
.custom(async value => {
    if(!value){
        throw new Error('El id no permite valores nulos');
    }
    else{
        const buscarCaja= await ModeloCaja.findOne({
          where: {id: value}
        });
        if (!buscarCaja) {
          throw new Error('El Id del caja no exite');
        }
    }
  }),
body("nombre").isLength({min: 3, max: 50}).withMessage("El limite de caracteres es de 3 - 50"),
body("estado").optional().isIn(['CE', 'AB']).withMessage("Solo se permiten valores AB, CE"),
cajaController.editarCaja);

/**
 * @memberof routes/api/caja
 * @method activar
 * @description PUT. Actualiza si un caja esta activo o inactivo
 * {@link server/api/cajas/activar}
 * @param {boolean} activo.required Los valores pueden ser true o false 
 */
router.put("/activar", 
query("id").isInt().withMessage("El id debe ser un numero entero"),
body("activo").isBoolean().withMessage("Solo se permiten valores boleanos"),
cajaController.activarCaja);

module.exports = router;