
const lugarController = require('../../controller/lugares/lugarController');
const { body, query } = require("express-validator");
var router = require("express").Router();
const ModeloDepartamentos = require('../../models/lugares/departamento');
const ModeloMunicipios = require('../../models/lugares/municipios');
const ModeloLugar = require('../../models/lugares/lugar');

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
 * @memberof routes/api/lugar
 * @method listar
 * @description Lista todos los lugares guaradados en la base de datos
 * {@link server/api/lugares/listar} 
 */
router.get("/listar", lugarController.listarLugares);
router.get("/listardepartamentos", lugarController.listarDepartamentos);
router.get("/listarmunicipios", lugarController.listarMunicipios);

/**
 * @memberof routes/api/lugar
 * @method listar
 * @description Lista todos los lugar de los empleados guardados en la base de datos
 * {@link server/api/lugares/buscarid}
 * @param {integer} id del lugar 
 */
router.get("/buscarid",
    query("id").isInt().withMessage("El id debe ser un número entero"),
    lugarController.buscarIdLugar);

/**
 * @memberof routes/api/lugar
 * @method buscarnombre
 * @description Lista todos los empleados guardados en la base de datos con los datos de busqueda
 * {@link server/api/lugares/buscarnombre}
 * @param {string} nombre del lugar 
 */
router.get("/buscarnombre",
    query("nombre").isLength({ min: 3, max: 50 }).withMessage("El limite de caracteres de de 3 - 50"),
    lugarController.buscarNombreLugar);

/**
 * @memberof routes/api/lugar
 * @method guardar
 * @description POST. Guardar los datos de un lugar
 * {@link server/api/lugares/guardar}
 * @param {string} nombre.required Nombre del lugar 
 */
router.post("/guardar",
    body("nombre").isLength({ min: 3, max: 50 }).withMessage("El limite de caracteres es de 3 - 50"),
    body("municipioId").isInt().withMessage("Debe seleccionar un municipio valido")
        .custom(async value => {
            if (!value) {
                throw new Error('El municipio no permite valores nulos');
            }
            else {
                const buscarMunicipioId = await ModeloMunicipios.findOne({
                    where: { id: value }
                });
                if (!buscarMunicipioId) {
                    throw new Error('El municipio no existe');
                }
            }
        }),
    body("lugar").optional().isLength({ min: 3, max: 50 }).withMessage("El limite de caracteres es de 3 - 50"),
    lugarController.guardarLugar);

/**
 * @memberof routes/api/lugar
 * @method editar
 * @description PUT. Guardar los datos de un lugar
 * {@link server/api/lugares/editar}
 * @param {string} nombre.required Nombre del lugar 
 */
router.put("/editar",
    query("id").isInt().withMessage("El id debe ser un número entero")
        .custom(async value => {
            if (!value) {
                throw new Error('El id no permite valores nulos');
            }
            else {
                const buscarLugarId = await ModeloLugar.findOne({
                    where: { id: value }
                });
                if (!buscarLugarId) {
                    throw new Error('El Id del lugar no exite');
                }
            }
        }),
    body("nombre").isLength({ min: 3, max: 50 }).withMessage("El limite de caracteres es de 3 - 50"),
    body("municipioId").isInt().withMessage("Debe seleccionar un municipio valido")
        .custom(async value => {
            if (!value) {
                throw new Error('El municipio no permite valores nulos');
            }
            else {
                const buscarMunicipioId = await ModeloMunicipios.findOne({
                    where: { id: value }
                });
                if (!buscarMunicipioId) {
                    throw new Error('El municipio no existe');
                }
            }
        }),
    lugarController.editarLugar);
/**
 * @memberof routes/api/lugar
 * @method editar
 * @description PUT. Guardar los datos de un lugar
 * {@link server/api/lugares/editar}
 * @param {string} nombre.required Nombre del lugar 
 */
router.put("/exportar",
lugarController.ExportarDatos);
module.exports = router;