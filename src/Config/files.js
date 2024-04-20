/**
 * Configuracion del multer
 * @author Alessandro Cardona
 * @date 2021 - 02 - 20
 * @namespace config/files
 */

const multer = require("multer");
const path = require("path");

/**
 * @memberof config/files
 * @function diskStorageEmpleados
 * @param {object} req Objeto que es proporcionado por Express donde se incrustara la información del archivo recibido
 * @param {file} file El archivo que capturara el multer
 * @param {function} cb Función callback que se encargara de incrustar la información del archivo en el objeto de request
 * @description Función que sera llamada en la función uploadImagenEmpleado para realizar el almacenamiento de las imágenes
 */
const diskStorageEmpleados = multer.diskStorage({
  destination: (req, file, cb) => { 
    cb(null, path.join(__dirname,"../../public/uploads/images/empleados"));
  },

  filename: (req, file, cb) => {
    if (
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg"
    ) {
      const uniqueSuffix = Math.round(Math.random() * (99998 - 10001)) + 10001;

      cb(
        null,
        "empleado-" +
          Date.now() +
          uniqueSuffix +
          "-" +
          req.query.id +
          "-" +
          file.mimetype.replace("/", ".")
      );
    }
  },
});

/**
 * @memberof config/files
 * @function uploadImagenEmpleado
 * @param {function} storage Recibe, crea y almacena la información del archivo en servidor
 * @param {number} limits Limite del tamaño máximo del archivo que permitirá el multer
 */
exports.uploadImagenEmpleado = multer({
  storage: diskStorageEmpleados,
  fileFilter: (req, file, cb) => {
    
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg"){
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Solo archivos png, jpeg o jpg"));
    }
  },
  limits: {
    fileSize: 1000000, // 1MB
  },
}).single("imagen");

/**
 * @memberof config/files
 * @function diskStorageProyectos
 * @param {object} req Objeto que es proporcionado por Express donde se incrustara la información del archivo recibido
 * @param {file} file El archivo que capturara el multer
 * @param {function} cb Función callback que se encargara de incrustar la información del archivo en el objeto de request
 * @description Función que sera llamada en la función uploadImagenEmpleado para realizar el almacenamiento de las imágenes
 */
const diskStorageProyectos = multer.diskStorage({
  destination: (req, file, cb) => { 
    cb(null, path.join(__dirname,"../../public/uploads/images/proyectos"));
  },

  filename: (req, file, cb) => {
    if (
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg"
    ) {
      const uniqueSuffix = Math.round(Math.random() * (99998 - 10001)) + 10001;

      cb(
        null,
        "proyecto-" +
          Date.now() +
          uniqueSuffix +
          "-" +
          req.query.id +
          "-" +
          file.mimetype.replace("/", ".")
      );
    }
  },
});

/**
 * @memberof config/files
 * @function uploadImagenProyecto
 * @param {function} storage Recibe, crea y almacena la información del archivo en servidor
 * @param {number} limits Limite del tamaño máximo del archivo que permitirá el multer
 */
exports.uploadImagenProyecto = multer({
  storage: diskStorageProyectos,
  fileFilter: (req, file, cb) => {
    
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg"){
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Solo archivos png, jpeg o jpg"));
    }
  },
  limits: {
    fileSize: 1000000, // 1MB
  },
}).single("imagen");

/**
 * @memberof config/files
 * @function diskStorageClientes
 * @param {object} req Objeto que es proporcionado por Express donde se incrustara la información del archivo recibido
 * @param {file} file El archivo que capturara el multer
 * @param {function} cb Función callback que se encargara de incrustar la información del archivo en el objeto de request
 * @description Función que sera llamada en la función uploadImagenEmpleado para realizar el almacenamiento de las imágenes
 */
const diskStorageClientes = multer.diskStorage({
  destination: (req, file, cb) => { 
    cb(null, path.join(__dirname,"../../public/uploads/images/clientes"));
  },

  filename: (req, file, cb) => {
    if (
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg"
    ) {
      const uniqueSuffix = Math.round(Math.random() * (99998 - 10001)) + 10001;

      cb(
        null,
        "cliente-" +
          Date.now() +
          uniqueSuffix +
          "-" +
          req.query.id +
          "-" +
          file.mimetype.replace("/", ".")
      );
    }
  },
});

/**
 * @memberof config/files
 * @function uploadImagenProyecto
 * @param {function} storage Recibe, crea y almacena la información del archivo en servidor
 * @param {number} limits Limite del tamaño máximo del archivo que permitirá el multer
 */
exports.uploadImagenCliente = multer({
  storage: diskStorageClientes,
  fileFilter: (req, file, cb) => {
    
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg"){
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Solo archivos png, jpeg o jpg"));
    }
  },
  limits: {
    fileSize: 1000000, // 1MB
  },
}).single("imagen");

const diskStorageCompras = multer.diskStorage({
  destination: (req, file, cb) => { 
    cb(null, path.join(__dirname,"../../public/uploads/images/compras"));
  },

  filename: (req, file, cb) => {
    if (
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg"
    ) {
      const uniqueSuffix = Math.round(Math.random() * (99998 - 10001)) + 10001;

      cb(
        null,
        "compra-" +
          Date.now() +
          uniqueSuffix +
          "-" +
          req.query.id +
          "-" +
          file.mimetype.replace("/", ".")
      );
    }
  },
});

exports.uploadImagenCompra = multer({
  storage: diskStorageCompras,
  fileFilter: (req, file, cb) => {
    
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg"){
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Solo archivos png, jpeg o jpg"));
    }
  },
  limits: {
    fileSize: 1000000, // 1MB
  },
}).single("imagen");
