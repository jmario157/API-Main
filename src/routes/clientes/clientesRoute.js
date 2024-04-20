
const clienteController = require('../../controller/clientes/clienteController');
const { body, query } = require("express-validator");
var router = require("express").Router();
const ModeloCliente = require('../../models/clientes/cliente');
const ModeloProfesion = require('../../models/clientes/profesion');
const ModeloLugar = require('../../models/lugares/lugar');
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
 * @memberof routes/api/cliente
 * @method listar
 * @description Lista todos los clientes guaradados en la base de datos
 * {@link server/api/clientes/listar} 
 */
router.get("/listar", clienteController.listarClientes);

/**
 * @memberof routes/api/cliente
 * @method buscarid
 * @description Lista todos los cliente de los empleados guardados en la base de datos
 * {@link server/api/clientes/buscarid}
 * @param {integer} id del cliente 
 */
router.get("/buscarid",
  query("id").isInt().withMessage("El id debe ser un número entero"),
  clienteController.buscarIdCliente);

/**
 * @memberof routes/api/cliente
 * @method buscarnombre
 * @description Lista todos los empleados guardados en la base de datos con los datos de busqueda
 * {@link server/api/clientes/buscarnombre}
 * @param {string} nombre del cliente 
 */
router.get("/buscarnombre",
  query("nombre").isLength({ min: 3, max: 50 }).withMessage("El limite de caracteres de de 3 - 50"),
  clienteController.buscarNombreCliente);

/**
 * @memberof routes/api/cliente
 * @method buscarapellido
 * @description Lista todos los empleados guardados en la base de datos con los datos de busqueda
 * {@link server/api/clientes/buscarapellido}
 * @param {string} apellido del cliente 
 */
router.get("/buscarapellido",
  query("apellido").isLength({ min: 3, max: 50 }).withMessage("El limite de caracteres de de 3 - 50"),
  clienteController.buscarApellidoCliente);

/**
 * @memberof routes/api/cliente
 * @method guardar
 * @description POST. Guardar los datos de un cliente
 * 
 * {@link server/api/clientes/guardar}
 * @param {string} identidad.required Numero de identidad del cliente
 * @param {string} nombreprimero.required Primer nombre del cliente
 * @param {string} nombresegundo Segundo nombre del cliente
 * @param {string} apellidoprimero.required Primer apellido del cliente
 * @param {string} apellidosegundo Segundo apellido del cliente
 * @param {Text} direccion direccion de la residencia del cliente
 * @param {boolean} activo Estado del cliente activo o inactivo 
 * @param {char} genero M=masculino, F=Femenino 
 */
router.post("/guardar",
  body("identidad").isLength({ min: 13, max: 15 }).withMessage("El limite de caracteres es de 13 - 15"),
  body("nombreprimer").isLength({ min: 3, max: 50 }).withMessage("El limite de caracteres es de 3 - 50"),
  body("apellidoprimer").isLength({ min: 3, max: 50 }).withMessage("El limite de caracteres es de 3 - 50"),
  body("activo").optional().isBoolean().withMessage("Solo se permiten valores boleanos"),
  body("genero").isIn(['M', 'F']).withMessage("Solo se permiten valores M=masculino, F=Femenino"),
  body("profesionId").isInt().withMessage("profesionId debe ser un número entero")
    .custom(async value => {
      if (!value) {
        throw new Error('profesionId no permite valores nulos');
      }
      else {
        const buscarProfesion = await ModeloProfesion.findOne({
          where: { id: value }
        });
        if (!buscarProfesion) {
          throw new Error('profesionId no exite');
        }
      }
    }),
  body("lugarId").isInt().withMessage("Debe selecionar un lugar valido")
    .custom(async value => {
      if (!value) {
        throw new Error('El lugar no permite valores nulos');
      }
      else {
        const buscarLugar = await ModeloLugar.findOne({
          where: { id: value }
        });
        if (!buscarLugar) {
          throw new Error('El lugar no exite');
        }
      }
    }),
  body('direccion').isLength({ min: 5 }).withMessage("Debe escribir el domicilio del cliente"),
  clienteController.guardarCliente);

/**
 * @memberof routes/api/cliente
 * @method editar
 * @description PUT. Guardar los datos de un cliente
 * {@link server/api/clientes/editar}
 * @param {string} nombre.required Nombre del cliente 
 */
router.put("/editar",
  query("id").isInt().withMessage("El id debe ser un número entero")
    .custom(async value => {
      if (!value) {
        throw new Error('El id no permite valores nulos');
      }
      else {
        const buscarCliente = await ModeloCliente.findOne({
          where: { id: value }
        });
        if (!buscarCliente) {
          throw new Error('El Id del cliente no exite');
        }
      }
    }),
  body("identidad").isLength({ min: 13, max: 15 }).withMessage("El limite de caracteres es de 13 - 15"),
  body("nombreprimer").isLength({ min: 3, max: 50 }).withMessage("El limite de caracteres es de 3 - 50"),
  body("apellidoprimer").isLength({ min: 3, max: 50 }).withMessage("El limite de caracteres es de 3 - 50"),
  body("activo").optional().isBoolean().withMessage("Solo se permiten valores boleanos"),
  body("genero").isIn(['M', 'F']).withMessage("Solo se permiten valores M=masculino, F=Femenino"),
  body("profesionId").isInt().withMessage("profesionId debe ser un número entero")
    .custom(async value => {
      if (!value) {
        throw new Error('profesionId no permite valores nulos');
      }
      else {
        const buscarProfesion = await ModeloProfesion.findOne({
          where: { id: value }
        });
        if (!buscarProfesion) {
          throw new Error('profesionId no exite');
        }
      }
    }),
    body("lugarId").isInt().withMessage("Debe selecionar un lugar valido")
    .custom(async value => {
        if (!value) {
            throw new Error('El lugar no permite valores nulos');
        }
        else {
            const buscarLugar = await ModeloLugar.findOne({
                where: { id: value }
            });
            if (!buscarLugar) {
                throw new Error('El lugar no exite');
            }
        }
    }),
  body('direccion').isLength({ min: 5 }).withMessage("Debe escribir el domicilio del cliente"),
  clienteController.editarCliente);

/**
 * @memberof routes/api/cliente
 * @method activar
 * @description PUT. Actualiza si un cliente esta activo o inactivo
 * {@link server/api/clientes/activar}
 * @param {boolean} activo.required Los valores pueden ser true o false 
 */
router.put("/activar",
  query("id").isInt().withMessage("El id debe ser un numero entero"),
  body("activo").isBoolean().withMessage("Solo se permiten valores boleanos"),
  clienteController.activarCliente);

/**
 * @memberof routes/api/cliente
 * @method editarimagen
 * @description PUT. Actualiza la imagen del empleado
 * {@link server/api/clientes/editarimagen}
 * @param {integer} id.required Id del empleado a actualizar
 * @param {imgen} imagen.required Imagen del empleado a actualizar 
 */
router.put("/editarimagen",
  query("id").isInt().withMessage("El id debe ser un numero entero"),
  clienteController.validarImagenCliente,
  clienteController.actualizarImagenCliente);


module.exports = router;