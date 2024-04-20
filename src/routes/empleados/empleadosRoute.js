
const empleadoController = require('../../controller/empleados/empleadoController');
const { body, query } = require("express-validator");
var router = require("express").Router();
const ModeloEmpleado = require('../../models/empleados/empleado');
const ModeloCargo = require('../../models/empleados/cargo');
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
 * @memberof routes/api/empleado
 * @method listar
 * @description Lista todos los empleados guaradados en la base de datos
 * {@link server/api/empleados/listar} 
 */
router.get("/listar", empleadoController.listarEmpleados);

/**
 * @memberof routes/api/empleado
 * @method buscarid
 * @description Lista todos los empleados guardados en la base de datos
 * {@link server/api/empleados/buscarid}
 * @param {integer} id del empleado 
 */
router.get("/buscarid", 
query("id").isInt().withMessage("El id debe ser un número entero"),
empleadoController.buscarIdEmpleado);

/**
 * @memberof routes/api/empleado
 * @method buscar
 * @description Lista todos los empleados guardados en la base de datos
 * {@link server/api/empleados/buscar?filtro=%nombre%&activo=1}
 * @param { string } filtro busca la identidad, nombre o apellido con un estado activo o inactivo utilizar % como comodines de autocompletado Ej. Car%
 * @param { boolean } activo 1 o 0
 */
router.get("/buscar", 
query("filtro").isLength({min: 3, max: 50}).withMessage("El limite de caracteres de de 3 - 50"),
query("activo").isBoolean().withMessage("Solo se permiten valores boleanos"),
empleadoController.buscarEmpleado);

/**
 * @memberof routes/api/empleados
 * @method guardar
 * @description POST. Guardar los datos de un empleado
 * {@link server/api/cargos/guardar}
 * @param {string} primernombre.required Primer Nombre del empleado
 * @param {string} segundonombre Segundo Nombre del empleado
 * @param {string} primerapellido.required Primer apellido del empleado
 * @param {string} segundoapellido Segundo apellido del empleado 
 * @param {double} Salario Salario del empleado
 * @param {date} fechaingreso Fecha de ingreso del empleado
 * @param {boolean} activo estado del empleado true o false
 * 
 */
router.post("/guardar", 
body("identidad").isLength({min: 3, max: 50}).withMessage("El limite de caracteres de de 3 - 50")
.custom(async value => {
    if(!value){
        throw new Error('La identidad no permite valores nulos');
    }
    else{
        const buscarIdentidad = await ModeloEmpleado.findOne({where: {identidad: value}});
        if (buscarIdentidad) {
          throw new Error('La identidad ya esta en uso');
        }
    }
  }),
body("primernombre").isLength({min: 3, max: 50}).withMessage("El limite de caracteres de de 3 - 50"),
body("primerapellido").isLength({min: 3, max: 50}).withMessage("El limite de caracteres de de 3 - 50"),
body("cargoId").isInt().withMessage("El id debe ser un número entero")
.custom(async value => {
    if(!value){
        throw new Error('El cargoId no permite valores nulos');
    }
    else{
        const buscarCargoId = await ModeloCargo.findOne({where: {id: value}});
        if (!buscarCargoId) {
          throw new Error('El cargoId no existe');
        }
    }
  }),
empleadoController.guardarEmpleado);

/**
 * @memberof routes/api/empleados
 * @method editar
 * @description PUT. Actualiza los datos del empleado
 * {@link server/api/empleados/editar}
 * @param {string} primernombre.required Primer Nombre del empleado
 * @param {string} segundonombre Segundo Nombre del empleado
 * @param {string} primerapellido.required Primer apellido del empleado
 * @param {string} segundoapellido Segundo apellido del empleado 
 * @param {double} Salario Salario del empleado
 * @param {date} fechaingreso Fecha de ingreso del empleado
 * @param {boolean} activo estado del empleado true o false
 */
router.put("/editar", 
query("id").isInt().withMessage("El id debe ser un numero entero"),
body("identidad").isLength({min: 3, max: 50}).withMessage("El limite de caracteres de de 3 - 50"),
body("primernombre").isLength({min: 3, max: 50}).withMessage("El limite de caracteres de de 3 - 50"),
body("primerapellido").isLength({min: 3, max: 50}).withMessage("El limite de caracteres de de 3 - 50"),
body("cargoId").isInt().withMessage("El cargoId debe ser un número entero")
.custom(async value => {
    if(!value){
        throw new Error('El cargoId no permite valores nulos');
    }
    else{
        const buscarCargoId = await ModeloCargo.findOne({where: {id: value}});
        if (!buscarCargoId) {
          throw new Error('El cargoId no existe');
        }
    }
  }),
empleadoController.editarEmpleado);

/**
 * @memberof routes/api/cargos
 * @method activar
 * @description PUT. Actualiza si un cargo esta activo o inactivo
 * {@link server/api/cargos/activar}
 * @param {boolean} activo.required Los valores pueden ser true o false 
 */
router.put("/activar", 
query("id").isInt().withMessage("El id debe ser un numero entero"),
body("activo").isBoolean().withMessage("Solo se permiten valores boleanos"),
empleadoController.activarEmpleado);

/**
 * @memberof routes/api/cargos
 * @method editarimagen
 * @description PUT. Actualiza la imagen del empleado
 * {@link server/api/cargos/editarimagen}
 * @param {integer} id.required Id del empleado a actualizar
 * @param {imgen} imagen.required Imagen del empleado a actualizar 
 */
router.put("/editarimagen", 
query("id").isInt().withMessage("El id debe ser un numero entero"),
empleadoController.validarImagenEmpleado,
empleadoController.actualizarImagenEmpleado);

module.exports = router;