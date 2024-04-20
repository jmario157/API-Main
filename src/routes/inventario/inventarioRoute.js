const { body, query } = require("express-validator");
const inventarioController = require('../../controller/inventario/inventarioController');
const ModeloInventario = require('../../models/Inventario/inventario');
const ModeloProducto = require('../../models/Inventario/producto');
const router = require("express").Router();
const { Op } = require('sequelize');

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
 * @memberof routes/api/inventario
 * @method listar
 * @description Lista todos los inventarios guaradados en la base de datos
 * {@link server/api/inventarios/listar} 
 */
router.get("/listar", inventarioController.listarInventario);

/**
 * @memberof routes/api/inventario
 * @method buscarid
 * @description Lista todos los inventarios guardados en la base de datos
 * {@link server/api/inventario/buscarIdinventario}
 * @param {integer} id del inventario 
 */
router.get('/buscarid',
    query('id').isInt().withMessage('El id debe ser un número entero'),
    inventarioController.buscarIdInventario
);

/**
 * @memberof routes/api/inventario
 * @method guardar
 * @description POST. Guardar los datos de un inventario
 * 
 * {@link server/api/inventario/guardar}
 * @param {Int} ProductoId.required ProductoId del inventario
 */
router.post('/crear',
    body("ProductoId").isInt().withMessage("Debe seleccionar un producto válido")
        .custom(async value => {
            if (!value) {
                throw new Error('El producto no permite valores nulos');
            }
            else {
                const buscarProducto = await ModeloProducto.findOne({
                    where: { id: value }
                });
                if (!buscarProducto) {
                    throw new Error('El producto no existe');
                }
            }
        }),
    inventarioController.guardarInventario
);

/**
 * @memberof routes/api/inventario
 * @method editar
 * @description POST. editar los datos de un inventario
 * 
 * {@link server/api/inventario/editar}
 * @param {Int} ProductoId.required ProductoId del inventario
 */
router.put('/editar',
    query("id").isInt().withMessage("El id debe ser un número entero")
        .custom(async value => {
            if (!value) {
                throw new Error('El id no permite valores nulos');
            }
            else {
                const buscarInventario = await ModeloInventario.findOne({
                    where: { id: value }
                });
                if (!buscarInventario) {
                    throw new Error('El Id del inventario no exite');
                }
            }
        }),
    body("ProductoId").isInt().withMessage("Debe seleccionar un producto válido")
        .custom(async value => {
            if (!value) {
                throw new Error('El producto no permite valores nulos');
            }
            else {
                const buscarProducto = await ModeloProducto.findOne({
                    where: { id: value }
                });
                if (!buscarProducto) {
                    throw new Error('El producto no existe');
                }
            }
        }),
    inventarioController.editarInventario
);

module.exports = router;
