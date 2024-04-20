
const facturaController = require('../../controller/factura/facturaController');
const { body, query } = require("express-validator");
var router = require("express").Router();
const ModeloFactura = require('../../models/factura/factura');
const ModeloProducto = require('../../models/Inventario/producto');
const ModeloCliente = require('../../models/clientes/cliente');
const ModeloNotaPeso = require('../../models/notaPeso/notaPeso')
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
 * @memberof routes/api/factura
 * @method listar
 * @description Lista todas las facturas guardadas en la base de datos
 * {@link server/api/factura/listar} 
 */
router.get("/listar", facturaController.listarFacturas);

/**
 * @memberof routes/api/factura
 * @method buscarid
 * @description Lista todas las facturas guardadas en la base de datos
 * {@link server/api/factura/buscarid}
 * @param {integer} id del factura 
 */
router.get("/buscarid",
    query("id").isInt().withMessage("El id debe ser un número entero"),
    facturaController.buscarIdFactura);


router.get('/buscarFechaEmision',
    query('fechaEmision').isDate().withMessage('Favor introduzca la fecha que ingreso el producto'),
    facturaController.buscarFechaEmision
);
/**
 * @memberof routes/api/factura
 * @method guardar
 * @description POST. Guardar los datos de un factura
 * 
 * {@link server/api/facturas/guardar}
 * @param {date} Fecha de emision de la factura
 * @param {enum} Tipo de pago de la factura
 * @param {float} Total de los pesos netos de la nota de peso
 */
router.post("/guardar",
    //body("fechaEmision").isDate().withMessage("Favor introduzca la fecha de emisión de la factura"),
    body("tipoPago").isIn(['Efectivo', 'Tarjeta', 'Transferencia']).withMessage("El tipo de pago puede ser efectivo, tarjeta o transferencia"),
    body("NotumId").isArray().withMessage("NotumId debe ser un array de IDs de notas de peso")
        .custom(async (value, { req }) => {
            if (!value.every(id => Number.isInteger(id))) {
                throw new Error('Los IDs de notas de peso deben ser números enteros');
            }
            // Puedes agregar más validaciones si es necesario
            return true;
        }),
    facturaController.guardarFactura
);


/**
 * @memberof routes/api/factura
 * @method editar
 * @description PUT. Editar los datos de un factura
 * 
 * {@link server/api/facturas/editar}
 * @param {date} Fecha de emision de la factura
 * @param {enum} Tipo de pago de la factura
 * @param {float} Total de los pesos netos de la nota de peso
 */
router.put("/editar",
    query("id").isInt().withMessage("El id debe ser un número entero")
        .custom(async value => {
            if (!value) {
                throw new Error('El id no permite valores nulos');
            }
            else {
                const buscarFactura = await ModeloFactura.findOne({
                    where: { id: value }
                });
                if (!buscarFactura) {
                    throw new Error('El Id de la nota no exite');
                }
            }
        }),
    //body("fechaEmision").isDate().withMessage("Favor introduzca la fecha de emisión de la factura"),
    body("tipoPago").isIn(['Efectivo', 'Tarjeta', 'Transferencia']).withMessage("El tipo de pago puede ser efectivo, tarjeta o transferencia"),
    body("NotumId").isArray().withMessage("NotumId debe ser un array de IDs de notas de peso")
        .custom(async (value, { req }) => {
            if (!value.every(id => Number.isInteger(id))) {
                throw new Error('Los IDs de notas de peso deben ser números enteros');
            }
            // Puedes agregar más validaciones si es necesario
            return true;
        }),
    facturaController.editarFactura
);

module.exports = router;