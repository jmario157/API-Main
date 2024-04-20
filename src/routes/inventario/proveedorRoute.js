const { body, query } = require("express-validator");
const proveedorController = require('../../controller/inventario/proveedorController');
const ModeloProveedor = require('../../models/Inventario/proveedor');
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
 */
router.get("/listar", proveedorController.listarProveedor);

/**
 * @memberof routes/api/producto
 * @method buscarid
 * @description Lista todos los productos guardados en la base de datos
 * {@link server/api/producto/buscarIdProducto}
 * @param {integer} id del producto 
 */
router.get('/buscarid',
    query('id').isInt().withMessage('El id debe ser un número entero'),
    proveedorController.buscarIdProveedor
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
    proveedorController.buscarnombreProveedor
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
    body("nombreProveedor").isLength({ min: 3, max: 50 }).withMessage('El límite de caracteres es de 3 - 50')
    .custom(async value => {
        if (!value) {
            throw new Error('El nombre no permite valores nulos');
        }
        else {
            const buscarProveedor = await ModeloProveedor.findOne({
                where: { nombreProveedor: value }
            });
            if (buscarProveedor) {
                throw new Error('Ya existe un proveedor con este nombre');
            }
        }
    }),
    body("direccionProveedor").isLength({ min: 5, max: 100 }).withMessage('Escriba la direccion porfavor'),
    body("telefonoProveedor").isNumeric().withMessage('Escriba el numero de telefono porfavor'),
    body("correoProveedor").isEmail().withMessage('Escriba el correo del proveedor'),
    proveedorController.guardarProveedor
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
    body("nombreProveedor").isLength({ min: 3, max: 50 }).withMessage('El límite de caracteres es de 3 - 50'),
    body("direccionProveedor").isLength({ min: 5, max: 100 }).withMessage('Escriba la direccion porfavor'),
    body("telefonoProveedor").isNumeric().withMessage('Escriba el numero de telefono porfavor'),
    body("correoProveedor").isEmail().withMessage('Escriba el correo del proveedor'),
    proveedorController.editarProveedor
);

module.exports = router;