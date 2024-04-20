
const paisController = require('../../controller/lugares/paisController');
const { body, query } = require("express-validator");
var router = require("express").Router();
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
 * @memberof routes/api/paises
 * @method listar
 * @description Lista todos los paises guaradados en la base de datos
 * {@link server/api/lugares/listar} 
 */
router.get("/listar", paisController.listarPaises);

/**
 * @memberof routes/api/pais
 * @method listar
 * @description Lista todos los pais de los empleados guardados en la base de datos
 * {@link server/api/lugares/buscarid}
 * @param {integer} id del pais 
 */
router.get("/buscarid",
    query("id").isInt().withMessage("El id debe ser un número entero"),
    paisController.buscarIdPais);

/**
 * @memberof routes/api/pais
 * @method buscarnombre
 * @description Lista todos los empleados guardados en la base de datos con los datos de busqueda
 * {@link server/api/lugares/buscarnombre}
 * @param {string} nombre del pais 
 */
router.get("/buscarnombre",
    query("nombre").isLength({ min: 3, max: 50 }).withMessage("El limite de caracteres de de 3 - 50"),
    paisController.buscarNombrePais);

/**
 * @memberof routes/api/pais
 * @method guardar
 * @description POST. Guardar los datos de un pais
 * {@link server/api/lugares/guardar}
 * @param {string} nombre.required Nombre del pais 
 */
router.post("/guardar",
    body("nombre").isLength({ min: 3, max: 50 }).withMessage("El limite de caracteres es de 3 - 50"),
        paisController.guardarPais);

/**
 * @memberof routes/api/pais
 * @method editar
 * @description PUT. Guardar los datos de un pais
 * {@link server/api/lugares/editar}
 * @param {string} nombre.required Nombre del pais 
 */
router.put("/editar",
    query("id").isInt().withMessage("El id debe ser un número entero")
        .custom(async value => {
            if (!value) {
                throw new Error('El id no permite valores nulos');
            }
            else {
                const buscarPaisId = await ModeloPais.findOne({
                    where: { id: value }
                });
                if (!buscarPaisId) {
                    throw new Error('El Id del pais no exite');
                }
            }
        }),
    body("nombre").isLength({ min: 3, max: 50 }).withMessage("El limite de caracteres es de 3 - 50"),
    paisController.editarPais);

    router.put("/exportar",
    paisController.ExportarDatos);

module.exports = router;