
const estacionController = require('../../controller/configuraciones/estacionController');
const { body, query } = require("express-validator");
var router = require("express").Router();
const ModeloEstacion = require('../../models/configuracion/estacion');
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
 * @memberof routes/api/estacion
 * @method listar
 * @description Lista todos los estaciones guardados en la base de datos
 * {@link server/api/estaciones/listar} 
 */
router.get("/listar", estacionController.listarEstaciones);

/**
 * @memberof routes/api/estacion
 * @method buscarid
 * @description Lista todos los estacion de los empleados guardados en la base de datos
 * {@link server/api/estaciones/buscarid}
 * @param {integer} id del estacion 
 */
router.get("/buscarid", 
query("id").isInt().withMessage("El id debe ser un número entero"),
estacionController.buscarIdEstacion);

/**
 * @memberof routes/api/estacion
 * @method buscarip
 * @description Lista todos los estacion de los empleados guardados en la base de datos
 * {@link server/api/estaciones/buscarid}
 * @param {integer} ip del estacion 
 */
router.get("/buscarip", 
estacionController.buscarIpEstacion);

/**
 * @memberof routes/api/estacion
 * @method buscarnombre
 * @description Lista todos los empleados guardados en la base de datos con los datos de busqueda
 * {@link server/api/estaciones/buscarnombre}
 * @param {string} nombre del estacion 
 */
router.get("/buscarnombre", 
query("nombre").isLength({min: 3, max: 50}).withMessage("El limite de caracteres de de 3 - 50"),
estacionController.buscarNombreEstacion);

/**
 * @memberof routes/api/estacion
 * @method guardar
 * @description POST. Guardar los datos de un estacion
 * 
 * {@link server/api/estaciones/guardar}
 * @param {string} nombre.required Nombre del estacion
 * @param {string} nombresegundo Segundo nombre del estacion
 * @param {boolean} activo Estado del estacion activo o inactivo 
 */
router.post("/guardar", 
body("nombre").isLength({min: 3, max: 50}).withMessage("El limite de caracteres es de 3 - 50")
.custom(async value => {
  if(!value){
      throw new Error('El nombre no permite valores nulos');
  }
  else{
      const buscarCaja = await ModeloEstacion.findOne({
        where: {nombre: value}
      });
      if (buscarCaja) {
        throw new Error('El nombre del estacion ya exite');
      }
  }
}),
body("ip").isIP().withMessage("Solo se permiten ipv4"),
estacionController.guardarEstacion);

/**
 * @memberof routes/api/estacion
 * @method editar
 * @description PUT. Guardar los datos de un estacion
 * {@link server/api/estaciones/editar}
 * @param {string} nombre.required Nombre del estacion 
 */
router.put("/editar", 
query("id").isInt().withMessage("El id debe ser un número entero")
.custom(async value => {
    if(!value){
        throw new Error('El id no permite valores nulos');
    }
    else{
        const buscarCaja= await ModeloEstacion.findOne({
          where: {id: value}
        });
        if (!buscarCaja) {
          throw new Error('El Id del estacion no exite');
        }
    }
  }),
body("nombre").isLength({min: 3, max: 50}).withMessage("El limite de caracteres es de 3 - 50"),
body("ip").isIP().withMessage("Solo se permiten ipv4"),
estacionController.editarEstacion);

module.exports = router; 