
const usuarioController = require('../../controller/empleados/usuarioController');
const { body, query } = require("express-validator");
var router = require("express").Router();
const ModeloUsuario = require('../../models/empleados/usuario');
const ModeloEmpleado = require('../../models/empleados/empleado');
const { Op } = require('sequelize');
const security = require("../../Config/security");


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
 * @memberof routes/api/usuario
 * @method listar
 * @description Lista todos los usuarios guaradados en la base de datos
 * {@link server/api/usuarios/listar} 
 */
router.get("/listar", security.verifyUser, usuarioController.listarUsuarios);

/**
 * @memberof routes/api/usuario
 * @method buscarid
 * @description Lista todos los usuario de los empleados guardados en la base de datos
 * {@link server/api/usuarios/buscarid}
 * @param {integer} id del usuario 
 */
router.get("/buscarid", 
query("id").isInt().withMessage("El id debe ser un número entero"),
usuarioController.buscarIdUsuario);

/**
 * @memberof routes/api/usuario
 * @method buscarlogin
 * @description Lista todos los empleados guardados en la base de datos con los datos de busqueda
 * {@link server/api/usuarios/buscarnombre}
 * @param {string} login del usuario 
 */
router.get("/buscarlogin", 
query("login").isLength({min: 3, max: 50}).withMessage("El limite de caracteres de de 3 - 50"),
usuarioController.buscarLoginUsuario);

/**
 * @memberof routes/api/usuario
 * @method buscarnombre
 * @description Lista todos los empleados guardados en la base de datos con los datos de busqueda
 * {@link server/api/usuarios/buscarnombre}
 * @param {string} nombre del empleado 
 */
router.get("/buscarnombre", 
query("nombre").isLength({min: 3, max: 50}).withMessage("El limite de caracteres de de 3 - 50"),
usuarioController.buscarNombreUsuario);

/**
 * @memberof routes/api/usuario
 * @method guardar
 * @description POST. Guardar los datos de un usuario
 * 
 * {@link server/api/usuarios/guardar}
 * @param {string} identidad.required Numero de identidad del usuario
 * @param {string} login.required Login de usuario
 * @param {string} correo.required Correo electrónico del usuario
 * @param {string} contrasena.required Contraseña del usuario esta se encripta al momento de guardar 
 */
router.post("/guardar",
body("login").isLength({min: 3, max: 50}).withMessage("El limite de caracteres es de 3 - 50")
.custom(async value => {
  if(!value){
      throw new Error('El login no permite valores nulos');
  }
  else{
      const buscarUsuario = await ModeloUsuario.findOne({
        where: {login: value}
      });
      if (buscarUsuario) {
        throw new Error('El login no esta disponible ingrese otro');
      }
  }
}),
body("correo").isEmail().withMessage("Debe ser un correo valido")
.custom(async value => {
  if(!value){
      throw new Error('El correo no permite valores nulos');
  }
  else{
      const buscarUsuario = await ModeloUsuario.findOne({
        where: {correo: value}
      });
      if (buscarUsuario) {
        throw new Error('El correo no esta disponible ingrese otro');
      }
  }
}),
body("contrasena").isLength({min: 6, max: 12}).withMessage("El limite de caracteres es de 6 - 12"),
body("empleadoId").isInt().withMessage("El id debe ser un número entero")
.custom(async value => {
    if(!value){
        throw new Error('El empleadoId no permite valores nulos');
    }
    else{
        const buscarEmpleado = await ModeloEmpleado.findOne({
          where: {id: value}
        });
        if (!buscarEmpleado) {
          throw new Error('El empleadoId del empleado no exite');
        }
    }
  }),
usuarioController.guardarUsuario);

/**
 * @memberof routes/api/usuario
 * @method editar
 * @description PUT. Guardar los datos de un usuario
 * {@link server/api/usuarios/editar}
 * @param {string} nombre.required Nombre del usuario 
 */
router.put("/editar", 
query("id").isInt().withMessage("El id debe ser un número entero")
.custom(async value => {
    if(!value){
        throw new Error('El id no permite valores nulos');
    }
    else{
        const buscarUsuario = await ModeloUsuario.findOne({
          where: {id: value}
        });
        if (!buscarUsuario) {
          throw new Error('El Id del usuario no exite');
        }
    }
  }),
  body("login").isLength({min: 3, max: 50}).withMessage("El limite de caracteres es de 3 - 50"),
  body("correo").isEmail().withMessage("Debe ser un correo valido"),
  body("empleadoId").isInt().withMessage("El id debe ser un número entero")
  .custom(async value => {
      if(!value){
          throw new Error('El id no permite valores nulos');
      }
      else{
          const buscarEmpleado = await ModeloEmpleado.findOne({
            where: {id: value}
          });
          if (!buscarEmpleado) {
            throw new Error('El Id del empleado no exite');
          }
      }
    }),
  usuarioController.editarUsuario);

/**
 * @memberof routes/api/usuario
 * @method activar
 * @description PUT. Actualiza si un usuario esta activo o inactivo
 * {@link server/api/usuarios/activar}
 * @param {boolean} activo.required Los valores pueden ser true o false 
 */
router.put("/activar", 
query("id").isInt().withMessage("El id debe ser un numero entero"),
body("activo").isBoolean().withMessage("Solo se permiten valores boleanos"),
usuarioController.activarUsuario);

/**
 * @memberof routes/api/usuario
 * @method estado
 * @description PUT. Actualiza el estado del usuario
 * {@link server/api/usuarios/estado}
 * @param {boolean} estado.required Los valores pueden ser 'AC'=activo, 'IN'=inactivo, 'BL'=bloqueado 
 */
router.put("/activar", 
query("id").isInt().withMessage("El id debe ser un numero entero"),
body("estado").isIn(['AC','IN', 'BL']).withMessage("Solo se permiten valores 'AC'=activo, 'IN'=inactivo, 'BL'=bloqueado"),
usuarioController.estadoUsuario);

module.exports = router;