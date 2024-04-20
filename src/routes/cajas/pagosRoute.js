
const pagoController = require('../../controller/pagos/pagoController');
const { body, query } = require("express-validator");
var router = require("express").Router();
const ModeloCaja = require('../../models/pagos/pago');
const ModeloCliente = require('../../models/clientes/cliente');
const ModeloCuenta = require('../../models/bancos/cuenta');
const ModeloPos = require('../../models/bancos/pos');
const ModeloUsuario = require('../../models/empleados/usuario');
const ModeloEstacion = require('../../models/configuracion/estacion');
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
 * @memberof routes/api/pago
 * @method listar
 * @description Lista todos los pagos guardados en la base de datos
 * {@link server/api/pagos/listar} 
 */
router.get("/listar", pagoController.listarPagos);

/**
 * @memberof routes/api/pago
 * @method buscarid
 * @description Lista todos los pago de los empleados guardados en la base de datos
 * {@link server/api/pagos/buscarid}
 * @param {integer} id del pago 
 */
router.get("/buscarid", 
query("id").isInt().withMessage("El id debe ser un número entero"),
pagoController.buscarIdPago);

/**
 * @memberof routes/api/pago
 * @method buscarnombre
 * @description Lista todos los empleados guardados en la base de datos con los datos de busqueda
 * {@link server/api/pagos/buscarnombre}
 * @param {string} nombre del pago 
 */
router.get("/buscaridcliente", 
query("clienteId").isInt().withMessage("El id debe ser un número entero"),
pagoController.buscarIdCliente);

/**
 * @memberof routes/api/pago
 * @method buscarnombre
 * @description Lista todos los empleados guardados en la base de datos con los datos de busqueda
 * {@link server/api/pagos/buscarnombre}
 * @param {string} nombre del pago 
 */
router.get("/datoscierre", 
query("cajaId").isInt().withMessage("El id debe ser un número entero")
.custom(async value => {
  if(!value){
      throw new Error('No permite valores nulos');
  }
  else{
      const buscarCaja = await ModeloCaja.findOne({
        where: {id: value}
      });
      if (!buscarCaja) {
        throw new Error('No existe una caja con este id');
      }
  }
}),
pagoController.generarDatosCierre);

/**
 * @memberof routes/api/pago
 * @method editar
 * @description PUT. Guardar los datos de un pago
 * {@link server/api/pagos/editar}
 * @param {string} nombre.required Nombre del pago 
 */
router.put("/editar", 
query("id").isInt().withMessage("El id debe ser un número entero")
.custom(async value => {
    if(!value){
        throw new Error('El id no permite valores nulos');
    }
    else{
        const buscarCaja= await ModeloCaja.findOne({
          where: {id: value}
        });
        if (!buscarCaja) {
          throw new Error('El Id del pago no exite');
        }
    }
  }),
body("nombre").isLength({min: 3, max: 50}).withMessage("El limite de caracteres es de 3 - 50"),
body("estado").optional().isIn(['CE', 'AB']).withMessage("Solo se permiten valores AB, CE"),
pagoController.editarPago);

module.exports = router;