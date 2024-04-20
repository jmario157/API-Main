
const detalleController = require('../../controller/notaPeso/detalleController');
const { body, query } = require("express-validator");
var router = require("express").Router();
const ModeloDetalle = require('../../models/notaPeso/detalleNota');
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
 * @memberof routes/api/detalle
 * @method listar
 * @description Lista todos los detalles guaradados en la base de datos
 * {@link server/api/detalles/listar} 
 */
router.get("/listar", detalleController.listarDetalle);

/**
 * @memberof routes/api/detalle
 * @method buscarid
 * @description Lista todos los detalles guardados en la base de datos
 * {@link server/api/detalles/buscarid}
 * @param {integer} id del detalle 
 */
router.get("/buscarid",
    query("id").isInt().withMessage("El id debe ser un número entero"),
    detalleController.buscarIdDetalle);


router.get('/buscarPesada',
    query('pesada').isDate().withMessage('Favor introduzca que pesada es'),
    detalleController.buscarPesada
);

/**
 * @memberof routes/api/detalle
 * @method guardar
 * @description POST. Guardar los datos de un detalle
 * 
 * {@link server/api/detalles/guardar}
 * @param {int} pesada.required pesada del detalle
 * @param {int} cantidad.required cantidad del detalle
 * @param {float} pesoBruto.required pesoBruto del detalle
 * @param {float} tara.required tara del detalle
 */
router.post("/guardar",
    body("pesada").isInt().withMessage('La pesada debe ser un numero entero'),
    body("cantidad").isInt().withMessage('La cantidad debe ser un número entero'),
    body("pesoBruto").isFloat().withMessage('El pesoNeto debe ser un número decimal'),
    body("tara").isFloat().withMessage('La tara debe ser un número decimal'),
    detalleController.guardarDetalle
);

/**
 * @memberof routes/api/detalle
 * @method editar
 * @description POST. editar los datos de un detalle
 * 
 * {@link server/api/detalles/editar}
 * @param {int} pesada.required pesada del detalle
 * @param {int} cantidad.required cantidad del detalle
 * @param {float} pesoBruto.required pesoBruto del detalle
 * @param {float} tara.required tara del detalle
 */
router.put("/editar",
    query("id").isInt().withMessage("El id debe ser un número entero")
        .custom(async value => {
            if (!value) {
                throw new Error('El id no permite valores nulos');
            }
            else {
                const buscarDetalle = await ModeloDetalle.findOne({
                    where: { id: value }
                });
                if (!buscarDetalle) {
                    throw new Error('El Id del detalle no exite');
                }
            }
    }),
    body("pesada").isInt().withMessage('La pesada debe ser un numero entero'),
    body("cantidad").isInt().withMessage('La cantidad debe ser un número entero'),
    body("pesoBruto").isFloat().withMessage('El pesoNeto debe ser un número decimal'),
    body("tara").isFloat().withMessage('La tara debe ser un número decimal'),
    detalleController.editarDetalle
);

module.exports = router;