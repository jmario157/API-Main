
const departamentoController = require('../../controller/lugares/departamentoController');
const { body, query } = require("express-validator");
var router = require("express").Router();
const ModeloDepartamentos = require('../../models/lugares/departamento');
const ModeloPais = require('../../models/lugares/pais');

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
 * @memberof routes/api/departamentos
 * @method listar
 * @description Lista todos los departamentos guaradados en la base de datos
 * {@link server/api/lugares/listar} 
 */
router.get("/listar", departamentoController.listarDepartamentos);

/**
 * @memberof routes/api/departamento
 * @method listar
 * @description Lista todos los departamento de los empleados guardados en la base de datos
 * {@link server/api/lugares/buscarid}
 * @param {integer} id del departamento 
 */
router.get("/buscarid",
    query("id").isInt().withMessage("El id debe ser un número entero"),
    departamentoController.buscarIdDepartamento);

/**
 * @memberof routes/api/departamento
 * @method buscarnombre
 * @description Lista todos los empleados guardados en la base de datos con los datos de busqueda
 * {@link server/api/lugares/buscarnombre}
 * @param {string} nombre del departamento 
 */
router.get("/buscarnombre",
    query("nombre").isLength({ min: 3, max: 50 }).withMessage("El limite de caracteres de de 3 - 50"),
    departamentoController.buscarNombreDepartamento);

/**
 * @memberof routes/api/departamento
 * @method guardar
 * @description POST. Guardar los datos de un departamento
 * {@link server/api/lugares/guardar}
 * @param {string} nombre.required Nombre del departamento 
 */
router.post("/guardar",
    body("nombre").isLength({ min: 3, max: 50 }).withMessage("El limite de caracteres es de 3 - 50"),
    body("paiId").isInt().withMessage("Debe seleccionar un pais valido")
        .custom(async value => {
            if (!value) {
                throw new Error('El pais no permite valores nulos');
            }
            else {
                const buscarPaisId = await ModeloPais.findOne({
                    where: { id: value }
                });
                if (!buscarPaisId) {
                    throw new Error('El pais no existe');
                }
            }
        }),
        body("numero").isLength({ min: 1, max: 50 }).withMessage("El limite de caracteres es de 1 - 50"),
        departamentoController.guardarDepartamento);

/**
 * @memberof routes/api/departamento
 * @method editar
 * @description PUT. Guardar los datos de un departamento
 * {@link server/api/lugares/editar}
 * @param {string} nombre.required Nombre del departamento 
 */
router.put("/editar",
    query("id").isInt().withMessage("El id debe ser un número entero")
        .custom(async value => {
            if (!value) {
                throw new Error('El id no permite valores nulos');
            }
            else {
                const buscarDepartamentoId = await ModeloDepartamentos.findOne({
                    where: { id: value }
                });
                if (!buscarDepartamentoId) {
                    throw new Error('El Id del departamento no exite');
                }
            }
        }),
    body("nombre").isLength({ min: 3, max: 50 }).withMessage("El limite de caracteres es de 3 - 50"),
    body("paiId").isInt().withMessage("Debe seleccionar un pais valido")
        .custom(async value => {
            if (!value) {
                throw new Error('El pais no permite valores nulos');
            }
            else {
                const buscarPaisId = await ModeloPais.findOne({
                    where: { id: value }
                });
                if (!buscarPaisId) {
                    throw new Error('El pais no existe');
                }
            }
        }),
    departamentoController.editarDepartamento);

module.exports = router;