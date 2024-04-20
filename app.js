var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var lessMiddleware = require("less-middleware");
var logger = require("morgan");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit"); // Limitador de peticiones
const helmet = require("helmet"); // Middlewares pequeños para la seguridad de la api


// Importar doenv para usar las variables de entorno
require("dotenv").config();

/**
 * Configuración del servidor
 * @author Carlos Flores
 * @date 2023 - 06 - 05
 * @namespace app
 */

// Importar la base
const db = require("./src/Config/db");
const modelos = require("./src/models");

// Importar CORS para el acceso al cliente
const cors = require("cors");
const config = require("./src/Config/cors");

var indexRouter = require("./src/routes/index");
//var usersRouter = require("./src/routes/users");

// Importar la api
const api = require("./src/routes/api");

/**
 * @function db.sync
 * @memberof app
 * @description Funcion que conecta con la base de datos
 */
// Establecer la conexion a la base
db.authenticate()
  .then(() => {
    console.log(
      "============== Se conecto con el servidor de DB =============="
    );
    modelos.CrearModelos();
  })
  .catch((error) => console.log(error));

/**
 * @memberof app
 * @function limiter
 * @description Funcion que define las peticiones en un marco de tiempo por IP
 * @param {number} windowMs Marco de tiempo en el que se permitirán peticiones a una IP
 * @param {number} max Numero máximo de petición en un marco de tiempo
 */
const limiter = rateLimit({
  windowMs: 1000 * 60 * 10, // 10 minutos
  max: 100, // Maximo de peticiones
});

var app = express();

// Usar cors
app.use(cors(config.application.cors.server));

app.use(limiter);
/**
 * @memberof app
 * @function helmet
 * @description Configura las cabeceras de las peticiones y respuestas incrementando la seguridad (Recomendado por express)
 * Si presenta problemas con que no muestra contenido, elimine o comente esta función.
 */
//app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, "public")));
/**
 * @memberof app
 * @method api/imagenes
 * @description Se crea una ruta estática para acceder a las imagenes la ruta es /api/imagenes/ + el modulo que se este trabajando por ejemplo /api/imagenes/empleados/empleado.png
 */
// usar la ruta de la api
app.use("/api/imagenes", express.static(path.join(__dirname, "public/uploads/images")));

app.use("/", indexRouter);

/**
 * @memberof app
 * @method api
 * @description Al momento de implementar el servidor para un establecimiento sustitúyalo por el nombre abreviado del establecimiento
 * ya que este sera el distintivo de las rutas que son de la aplicación o de otra función especial dentro del servidor
 * no olvide sustituirlo también en la aplicación
 */
// usar la ruta de la api
app.use("/api", api);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
