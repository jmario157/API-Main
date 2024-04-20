/**
 * Configuracion del JWT con passport
 * @author Alessandro Cardona
 * @date 2021 - 02 - 20
 * @namespace config/security
 */

// Importar passport
const passport = require("passport");

// Importar el modelo
const User = require("../models/empleados/usuario");
const ModeloUsuarioAcceso = require('../models/empleados/usuarioacceso');
//const modelAuthAndUser = new authAndUserModel();

// Importar Estrategia JSON Web Token
const jWTStrategy = require("passport-jwt").Strategy;

// Configurar el extractor
const extractJWT = require("passport-jwt").ExtractJwt;

// Importar JSON Web Token
const jWT = require("jsonwebtoken");

// Importar moment
const moment = require("moment");

// Expiracion
/**
 * @memberof config/security
 * @function expirationTime
 * @description Tiene el valor del tiempo que durara el token
 */
const expirationTime = moment.duration(10, "days").asSeconds(); // Es en segundos (10 diaS de expiracion)

/**
 * @memberof config/security
 * @function getToken
 * @param {objet} data Objeto que sera incrustado en el cuerpo del token
 * @returns token que sera de utilidad para autenticar el usuario mas adelante
 */
// En la data va un json osea que va entre llaves asi sea solo un campo
exports.getToken = (data) => {
  //const my = Date.now() + 1000 * 60 * 10; //moment.duration(10, "minutes").asSeconds();
  //console.log(my);
  return jWT.sign(data, process.env.MYSECRETKEY, { expiresIn: expirationTime });
};

const opts = {};
opts.jwtFromRequest = extractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.MYSECRETKEY;

/**
 * @memberof config/security
 * @function jwtPassport
 * @description Se encarga de procesar el token capturado buscando por correo electrónico al usuario y su actividad (activo).
 * @returns El usuario al req, pudiendo se invocado de la siguiente manera: req.user
 */
exports.jwtPassport = passport.use(
  new jWTStrategy(opts, async (payload, done) => {
    //console.log(payload);
    await User.findOne({
      include:{
        model: ModeloUsuarioAcceso,
        attributes: ['ruta', 'permisos', 'activo']
    },
      where: { id: payload.id, activo: true, estado: 'AC' },
    })
      .then((result) => {
        if (!result) {
          return done(null, false);
        } else {
          const user = {
            id: result.id,
            correo: result.correo,
            login: result.login,
            activo: result.activo,
            // AccesoTotal: result.AccesoTotal, Utilize esto cuando necesite acceder a rutas de administrador en algun otro servidor
            // Habilitado: result.Habilitado, Utilize esto cuando necesite acceder a rutas de administrador en algun otro servidor
          };
          return done(null, user);
        }
      })
      .catch((error) => {
        return done(error, false);
      });
  })
);

// Permitir que passport lea los valores del objeto usuario
// Serializar el usuario
passport.serializeUser((User, callback) => {
  callback(null, User);
});

// Deserializar el usuario
passport.deserializeUser((User, callback) => {
  callback(null, User);
});

/**
 * @memberof config/security
 * @function verifyUser
 * @description Es el middleware que se encargara de capturar y evaluar el token
 * @returns Si el token del usuario es correcto pasara a la siguiente función, si no lo es, devolverá un error 401
 * esta función se invoca entre la ruta y el función de la ruta para verificar si el token es valido
 */
exports.verifyUser = passport.authenticate("jwt", { session: false, failureRedirect: '/api/autenticacion/errorlogin' });

/**
 * @memberof config/security
 * @function verifyAdmin
 * @description Verificar si la credencial de administrador que viene en el token es valida, de ser validad pasara a la siguiente función, de no serlo devolverá un error de no autorización
 * esta función es llamada entre las rutas que se desean proteger para los administradores
 */
// Verificar si es un usuario administrador
exports.verifyAdmin = (req, res, next) => {
  if (!req.user.AccesoTotal && !req.user.Habilitado) {
    res.setHeader("Content-Type", "application/json");
    res.status(403).json({
      message: "No esta autorizado para esta acción",
    });
  } else {
    next();
  }
};
