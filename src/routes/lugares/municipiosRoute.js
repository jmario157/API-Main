
const municipioController = require('../../controller/lugares/municipioController');
const { body, query } = require("express-validator");
var router = require("express").Router();
const ModeloDepartamentos = require('../../models/lugares/departamento');
const ModeloMunicipios = require('../../models/lugares/municipios');

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
 * @memberof routes/api/municipios
 * @method listar
 * @description Lista todos los municipios guaradados en la base de datos
 * {@link server/api/lugares/listar} 
 */
router.get("/listar", municipioController.listarMunicipios);

/**
 * @memberof routes/api/lugar
 * @method listar
 * @description Lista todos los lugar de los empleados guardados en la base de datos
 * {@link server/api/lugares/buscarid}
 * @param {integer} id del lugar 
 */
router.get("/buscarid",
    query("id").isInt().withMessage("El id debe ser un número entero"),
    municipioController.buscarIdMunicipio);

/**
 * @memberof routes/api/lugar
 * @method buscarnombre
 * @description Lista todos los empleados guardados en la base de datos con los datos de busqueda
 * {@link server/api/lugares/buscarnombre}
 * @param {string} nombre del lugar 
 */
router.get("/buscarnombre",
    query("nombre").isLength({ min: 3, max: 50 }).withMessage("El limite de caracteres de de 3 - 50"),
    municipioController.buscarNombreMunicipio);

/**
 * @memberof routes/api/lugar
 * @method guardar
 * @description POST. Guardar los datos de un lugar
 * {@link server/api/lugares/guardar}
 * @param {string} nombre.required Nombre del lugar 
 */
router.post("/guardar",
    body("nombre").isLength({ min: 3, max: 50 }).withMessage("El limite de caracteres es de 3 - 50"),
    body("departamentoId").isInt().withMessage("Debe seleccionar un departamento valido")
        .custom(async value => {
            if (!value) {
                throw new Error('El departamento no permite valores nulos');
            }
            else {
                const buscarDepartamentoId = await ModeloDepartamentos.findOne({
                    where: { id: value }
                });
                if (!buscarDepartamentoId) {
                    throw new Error('El departamento no existe');
                }
            }
        }),
        municipioController.guardarMunicipio);

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
                const buscarMunicipioId = await ModeloMunicipios.findOne({
                    where: { id: value }
                });
                if (!buscarMunicipioId) {
                    throw new Error('El Id del municipio no exite');
                }
            }
        }),
    body("nombre").isLength({ min: 3, max: 50 }).withMessage("El limite de caracteres es de 3 - 50"),
    body("departamentoId").isInt().withMessage("Debe seleccionar un departamento valido")
        .custom(async value => {
            if (!value) {
                throw new Error('El departamento no permite valores nulos');
            }
            else {
                const buscarDepartamentoId = await ModeloDepartamentos.findOne({
                    where: { id: value }
                });
                if (!buscarDepartamentoId) {
                    throw new Error('El departamento no existe');
                }
            }
        }),
    municipioController.editarMunicipio);

module.exports = router;