
const autenticacionController = require('../../controller/empleados/autenticacionController');
const { body, query } = require("express-validator");
var router = require("express").Router();
const ModeloUsuario = require('../../models/empleados/usuario');
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
 * @memberof routes/api/autenticacion
 * @method iniciarsesion
 * @description Valida las credenciales del usuario para iniciar sesion
 * {@link server/api/autenticacion/iniciarsesion} 
 */
router.post("/iniciarsesion", 
body("login").isLength({min: 3, max: 50}).withMessage("El limite de caracteres es de 3 - 50"),
body("contrasena").isLength({min: 3, max: 50}).withMessage("El limite de caracteres es de 3 - 50"),
autenticacionController.iniciarSesion);

/**
 * @memberof routes/api/autenticacion
 * @method generarpin
 * @description Genera el pin genesario para actualizar la contraseña
 * {@link server/api/autenticacion/generarpin} 
 */
router.put("/generarpin", 
body("correo").isEmail().withMessage("Debe ser un correo valido")
.custom(async value => {
  if(!value){
      throw new Error('El correo no permite valores nulos');
  }
  else{
      const buscarUsuario = await ModeloUsuario.findOne({
        where: {correo: value}
      });
      if (!buscarUsuario) {
        throw new Error('El correo no esta disponible ingrese otro');
      }
  }
}),
autenticacionController.generarPin);

/**
 * @memberof routes/api/autenticacion
 * @method reestablecer
 * @description Actualiza la contraseña
 * {@link server/api/autenticacion/restablecer} 
 */
router.put("/reestablecer", 
body("correo").isEmail().withMessage("Debe ser un correo valido")
.custom(async value => {
  if(!value){
      throw new Error('El correo no permite valores nulos');
  }
  else{
      const buscarUsuario = await ModeloUsuario.findOne({
        where: {correo: value}
      });
      if (!buscarUsuario) {
        throw new Error('El correo no esta disponible ingrese otro');
      }
  }
}),
body("contrasena").isLength({min: 6, max: 12}).withMessage("El limite de caracteres es de 6 - 12"),
body("pin").isInt().withMessage("El pin debe ser un número entero"),
autenticacionController.reestablecerContrasena);

/**
 * @memberof routes/api/autenticacion
 * @method errorlogin
 * @description Actualiza la contraseña
 * {@link server/api/autenticacion/restablecer} 
 */
router.get("/errorlogin", 
autenticacionController.errorLogin);

module.exports = router;