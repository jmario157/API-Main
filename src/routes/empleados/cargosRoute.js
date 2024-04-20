
const cargoController = require('../../controller/empleados/cargoController');
const { body, query } = require("express-validator");
var router = require("express").Router();
const ModeloCargo = require('../../models/empleados/cargo');

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
 * @memberof routes/api/cargos
 * @method listar
 * @description Lista todos los cargos de los empleados guaradados en la base de datos
 * {@link server/api/cargos/listar} 
 */
router.get("/listar", cargoController.listarCargos);

/**
 * @memberof routes/api/cargos
 * @method listar
 * @description Lista todos los cargos de los empleados guaradados en la base de datos
 * {@link server/api/cargos/buscarid}
 * @param {integer} id del cargo 
 */
router.get("/buscarid", 
query("id").isInt().withMessage("El id debe ser un número entero"),
cargoController.buscarIdCargo);

/**
 * @memberof routes/api/cargos
 * @method buscarnombre
 * @description Lista todos los empleados guardados en la base de datos con los datos de busqueda
 * {@link server/api/cargos/buscarnombre}
 * @param {string} nombre del cargo 
 */
router.get("/buscarnombre", 
query("nombre").isLength({min: 3, max: 50}).withMessage("El limite de caracteres de de 3 - 50"),
cargoController.buscarNombreCargo);

/**
 * @memberof routes/api/cargos
 * @method guardar
 * @description POST. Guardar los datos de un cargo
 * {@link server/api/cargos/guardar}
 * @param {string} nombre.required Nombre del cargo 
 */
router.post("/guardar", 
body("nombre").isLength({min: 3, max: 50}).withMessage("El limite de caracteres de de 3 - 50")
.custom(async value => {
    if(!value){
        throw new Error('El nombre no permite valores nulos');
    }
    else{
        const buscarNombre = await ModeloCargo.findOne({where: {nombre: value}});
        if (buscarNombre) {
          throw new Error('El nombre ya esta en uso');
        }
    }
  }),
cargoController.guardarCargo);

/**
 * @memberof routes/api/cargos
 * @method editar
 * @description PUT. Guardar los datos de un cargo
 * {@link server/api/cargos/editar}
 * @param {string} nombre.required Nombre del cargo 
 */
router.put("/editar", 
query("id").isInt().withMessage("El id debe ser un numero entero")
.custom(async value => {
    if(!value){
        throw new Error('El id no permite valores nulos');
    }
    else{
        const buscarId = await ModeloCargo.findOne({where: {id: value}});
        if (!buscarId) {
          throw new Error('El id no existe');
        }
    }
  }),
body("nombre").isLength({min: 3, max: 50}).withMessage("El limite de caracteres de de 3 - 50"),
cargoController.editarCargo);

/**
 * @memberof routes/api/cargos
 * @method activar
 * @description PUT. Actualiza si un cargo esta activo o inactivo
 * {@link server/api/cargos/activar}
 * @param {boolean} activo.required Los valores pueden ser true o false 
 */
router.put("/activar", 
query("id").isInt().withMessage("El id debe ser un numero entero")
.custom(async value => {
    if(!value){
        throw new Error('El id no permite valores nulos');
    }
    else{
        const buscarId = await ModeloCargo.findOne({where: {id: value}});
        if (!buscarId) {
          throw new Error('El id no existe');
        }
    }
  }),
body("activo").isBoolean().withMessage("Solo se permiten valores boleanos"),
cargoController.activarCargo);

module.exports = router;