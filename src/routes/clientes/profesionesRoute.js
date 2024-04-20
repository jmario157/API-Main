
const profesionController = require('../../controller/clientes/profesionController');
const { body, query } = require("express-validator");
var router = require("express").Router();
const ModeloProfesion = require('../../models/clientes/profesion');
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
 * @memberof routes/api/profesion
 * @method listar
 * @description Lista todos los profesions guaradados en la base de datos
 * {@link server/api/profesions/listar} 
 */
router.get("/listar", profesionController.listarProfesiones);

/**
 * @memberof routes/api/profesion
 * @method buscarid
 * @description Lista todas las profesiones de los clientes guardados en la base de datos
 * {@link server/api/profesions/buscarid}
 * @param {integer} id del profesion 
 */
router.get("/buscarid", 
query("id").isInt().withMessage("El id debe ser un número entero"),
profesionController.buscarIdProfesion);

/**
 * @memberof routes/api/profesion
 * @method buscarnombre
 * @description Lista todos los empleados guardados en la base de datos con los datos de busqueda
 * {@link server/api/profesions/buscarnombre}
 * @param {string} nombre del profesion 
 */
router.get("/buscarnombre", 
query("nombre").isLength({min: 3, max: 50}).withMessage("El limite de caracteres de de 3 - 50"),
profesionController.buscarNombreProfesion);

/**
 * @memberof routes/api/profesion
 * @method guardar
 * @description POST. Guardar los datos de un profesion
 * 
 * {@link server/api/profesions/guardar}
 * @param {string} nombre.required Nombre de la profesion
 */
router.post("/guardar",
body("nombre").isLength({min: 3, max: 50}).withMessage("El limite de caracteres es de 3 - 50")
.custom(async value => {
  if(!value){
      throw new Error('El nombre no permite valores nulos');
  }
  else{
      const buscarProfesion = await ModeloProfesion.findOne({
        where: {nombre: value}
      });
      if (buscarProfesion) {
        throw new Error('Ya existe una profesion con este nombre');
      }
  }
}),
profesionController.guardarProfesion);

/**
 * @memberof routes/api/profesion
 * @method editar
 * @description PUT. Guardar los datos de un profesion
 * {@link server/api/profesions/editar}
 * @param {string} nombre.required Nombre del profesion 
 */
router.put("/editar", 
query("id").isInt().withMessage("El id debe ser un número entero")
.custom(async value => {
    if(!value){
        throw new Error('El id no permite valores nulos');
    }
    else{
        const buscarProfesion = await ModeloProfesion.findOne({
          where: {id: value}
        });
        if (!buscarProfesion) {
          throw new Error('El Id de la profesion no exite');
        }
    }
  }),
body("nombre").isLength({min: 3, max: 50}).withMessage("El limite de caracteres es de 3 - 50"),
profesionController.editarProfesion);

module.exports = router;