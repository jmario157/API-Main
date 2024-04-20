const { body, query } = require("express-validator");
const productoController = require('../../controller/inventario/productoController');
const ModeloProducto = require('../../models/Inventario/producto');
var router = require("express").Router();
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
 * @memberof routes/api/producto
 * @method listar
 * @description Lista todos los productos guaradados en la base de datos
 * {@link server/api/productos/listar} 
 */false,
    router.get("/listar", productoController.listarProductos);

/**
 * @memberof routes/api/producto
 * @method buscarid
 * @description Lista todos los productos guardados en la base de datos
 * {@link server/api/producto/buscarIdProducto}
 * @param {integer} id del producto 
 */
router.get('/buscarid',
    query('id').isInt().withMessage('El id debe ser un número entero'),
    productoController.buscarIdProducto
);

/**
 * @memberof routes/api/producto
 * @method buscarMaquinaria
 * @description Lista todos los productos con el nombre especificada
 * {@link server/api/producto/buscarNombreProducto}
 * @param {string} maquinaria
 */
router.get('/buscarnombre',
    query('nombre').isLength({ min: 3, max: 50 }).withMessage('El límite de caracteres es de 3 - 50'),
    productoController.buscarNombreProducto
);

/**
 * @memberof routes/api/producto
 * @method guardar
 * @description POST. Guardar los datos de un producto
 * 
 * {@link server/api/producto/guardar}
 * @param {string} nombre.required Nombre del producto
 * @param {float} precio.required Precio del producto
 */

router.post('/crear',
    //body("fechaEntrada").isDate().withMessage('Ingrese la fecha de entrada del producto'),
    body("tipoProducto").isIn(['Cafe en uva', 'Cafe en oro', 'Cafe pergamino humedo', 'Cafe pergamino seco']).withMessage('Tipo de producto no válido')
    .custom(async value => {
        if (!value) {
            throw new Error('El tipoProducto no permite valores nulos');
        }
        else {
            const buscarProducto = await ModeloProducto.findOne({
                where: { tipoProducto: value }
            });
            if (buscarProducto) {
                throw new Error('Ya existe un producto con este nombre');
            }
        }
    }),
    body("cantidad").isInt().withMessage('La cantidad debe ser un número entero'),
    body("pesoUnidad").isFloat().withMessage('El costo debe ser un número decimal'),
    body("medidaPeso").isIn(['kg', 'lb']).withMessage('La unidad de peso debe ser "lb" o "kg"'),
    productoController.guardarProducto
);

/**
 * @memberof routes/api/producto
 * @method editar
 * @description PUT. Guardar los datos de un producto
 * {@link server/api/producto/editar}
 * @param {string} nombre.required Nombre del producto
 * @param {float} precio.required Precio del producto 
 */
router.put('/editar',
    query("id").isInt().withMessage("El id debe ser un número entero")
        .custom(async value => {
            if (!value) {
                throw new Error('El id no permite valores nulos');
            }
            else {
                const buscarProducto = await ModeloProducto.findOne({
                    where: { id: value }
                });
                if (!buscarProducto) {
                    throw new Error('El Id del producto no exite');
                }
            }
        }),
    //body("fechaEntrada").isDate().withMessage('Ingrese la fecha de entrada del producto'),
    body("tipoProducto").isIn(['Cafe en uva', 'Cafe en oro', 'Cafe pergamino humedo', 'Cafe pergamino seco']).withMessage('Tipo de producto no válido'),
    body("cantidad").isInt().withMessage('La cantidad debe ser un número entero'),
    body("pesoUnidad").isFloat().withMessage('El costo debe ser un número decimal'),
    body("medidaPeso").isIn(['kg', 'lb']).withMessage('La unidad de peso debe ser "lb" o "kg"'),
    productoController.editarProducto
);

module.exports = router;