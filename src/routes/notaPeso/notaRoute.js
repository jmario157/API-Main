
const notaController = require('../../controller/notaPeso/notaController');
const { body, query } = require("express-validator");
var router = require("express").Router();
const ModeloNota = require('../../models/notaPeso/notaPeso');
const ModeloProducto = require('../../models/Inventario/producto');
const ModeloCliente = require('../../models/clientes/cliente');
const ModeloDetalle = require('../../models/notaPeso/detalleNota')
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
 * @memberof routes/api/nota
 * @method listar
 * @description Lista todos los notas guaradados en la base de datos
 * {@link server/api/notas/listar} 
 */
router.get("/listar", notaController.listarNota);

/**
 * @memberof routes/api/nota
 * @method buscarid
 * @description Lista todos los notas guardados en la base de datos
 * {@link server/api/notas/buscarid}
 * @param {integer} id del nota 
 */
router.get("/buscarid",
    query("id").isInt().withMessage("El id debe ser un número entero"),
    notaController.buscarIdNota);


router.get('/buscarFechaIngreso',
    query('fechaIngreso').isDate().withMessage('Favor introduzca la fecha que ingreso el producto'),
    notaController.buscarFechaIngreso
);
/**
 * @memberof routes/api/nota
 * @method guardar
 * @description POST. Guardar los datos de un nota
 * 
 * {@link server/api/notas/guardar}
 * @param {string} estado.required estado del nota
 * @param {int} clienteId.required 
 * @param {int} ProductoId 
 * @param {int} DetalleId.required 
 */
router.post("/guardar",
    //body("fechaIngreso").isDate().withMessage("Favor introduzca la fecha que ingreso la nota"),
    body("estado").optional().isBoolean().withMessage("El estado tiene que ser boleano"),
    body("clienteId").isInt().withMessage("clienteId debe ser un numero entero")
        .custom(async value => {
            if (!value) {
                throw new Error('clienteId no permite valores nulos');
            }
            else {
                const buscarCliente = await ModeloCliente.findOne({
                    where: { id: value }
                });
                if (!buscarCliente) {
                    throw new Error('clienteId no exite');
                }
            }
        }),
    body("ProductoId").isInt().withMessage("ProductoId debe ser un numero entero")
        .custom(async value => {
            if (!value) {
                throw new Error('ProductoId no permite valores nulos');
            }
            else {
                const buscarProducto = await ModeloProducto.findOne({
                    where: { id: value }
                });
                if (!buscarProducto) {
                    throw new Error('ProductoId no exite');
                }
            }
        }),
    body("DetalleId").isArray().withMessage("DetalleId debe ser un arreglo de objetos")
        .custom(async value => {
            if (!value || value.length === 0) {
                throw new Error('DetalleId no permite valores nulos o vacíos');
            }
            for (const detalle of value) {
                if (!detalle.pesada || !detalle.cantidad || !detalle.pesoBruto || !detalle.tara) {
                    throw new Error('Todos los campos de DetalleId son requeridos');
                }
            }
        }),
    
    notaController.guardarNota
); 

/**
 * @memberof routes/api/nota
 * @method editar
 * @description POST. editar los datos de un nota
 * 
 * {@link server/api/notas/editar}
 * @param {string} estado.required estado del nota
 * @param {int} clienteId.required 
 * @param {int} ProductoId 
 * @param {int} DetalleId.required 
 */
router.put("/editar",
    query("id").isInt().withMessage("El id debe ser un número entero")
        .custom(async value => {
            if (!value) {
                throw new Error('El id no permite valores nulos');
            }
            else {
                const buscarNota = await ModeloNota.findOne({
                    where: { id: value }
                });
                if (!buscarNota) {
                    throw new Error('El Id de la nota no exite');
                }
            }
        }),
    //body("fechaIngreso").isDate().withMessage("Favor introduzca la fecha que ingreso la nota"),
    body("estado").optional().isBoolean().withMessage("El estado tiene que ser boleano"),
    body("clienteId").isInt().withMessage("clienteId debe ser un numero entero")
        .custom(async value => {
            if (!value) {
                throw new Error('clienteId no permite valores nulos');
            }
            else {
                const buscarCliente = await ModeloCliente.findOne({
                    where: { id: value }
                });
                if (!buscarCliente) {
                    throw new Error('clienteId no exite');
                }
            }
        }),
    body("ProductoId").isInt().withMessage("ProductoId debe ser un numero entero")
        .custom(async value => {
            if (!value) {
                throw new Error('ProductoId no permite valores nulos');
            }
            else {
                const buscarProducto = await ModeloProducto.findOne({
                    where: { id: value }
                });
                if (!buscarProducto) {
                    throw new Error('ProductoId no exite');
                }
            }
        }),
    body("DetalleId").isArray().withMessage("DetalleId debe ser un arreglo de objetos")
        .custom(async value => {
            if (!value || value.length === 0) {
                throw new Error('DetalleId no permite valores nulos o vacíos');
            }
            for (const detalle of value) {
                if (!detalle.pesada || !detalle.cantidad || !detalle.pesoBruto || !detalle.tara) {
                    throw new Error('Todos los campos de DetalleId son requeridos');
                }
            }
        }),
    
    notaController.editarNota
);

router.put("/activar",
    query("id").isInt().withMessage("El id debe ser un numero entero"),
    body("activo").isBoolean().withMessage("Solo se permiten valores boleanos"),
    notaController.activarNota);

module.exports = router;