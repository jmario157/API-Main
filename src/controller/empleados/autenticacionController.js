/**
 * Controlador de autenticacion
 * @author Carlos Flores
 * @date 29/06/2023
 * 
 */
//Importar modelos
const ModeloUsuario = require("../../models/empleados/usuario");
const ModeloEmpleado = require("../../models/empleados/empleado");
const ModeloUsuarioAcceso = require("../../models/empleados/usuarioacceso");
//importar helpers
const Respuesta = require("../../helpers/respuesta");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const msjErrores = require("../../helpers/msjErrores");
const myFiles = require("../../Config/files");
const security = require("../../Config/security");
const SendEmail = require("../../helpers/email");
const moment = require("moment");

/**
 * @function iniciarSesion
 * @description Inicia sesion
 */
exports.iniciarSesion = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    console.log(req.ips);
    console.log(req.headers['user-agent']);
    
    contenido.msj = msjErrores.lista(validationResult(req));
    if (contenido.msj.length > 0) {
        contenido.tipo=2;
        console.log(contenido);
        Respuesta.enviar(400, contenido, res);
    }
    else {
        try {
            const { login, contrasena } = req.body;
            console.log(req.body);
            var buscarUsuario =
                await ModeloUsuario.findOne({
                    attributes: ['id', 'login', 'correo', 'contrasena', 'logueado'],
                    include: [
                        {
                            model: ModeloEmpleado,
                            attributes: ['primernombre', 'segundonombre', 'primerapellido', 'segundoapellido', 'Imagen'],
                        },
                        {
                            model: ModeloUsuarioAcceso,
                            attributes: ['ruta', 'permisos', 'activo']
                        },
                    ],
                    where: {
                        [Op.and]: {
                            activo: 1,
                            estado: 'AC',
                            [Op.or]: {
                                login: login,
                                correo: login
                            },
                        }

                    }
                });
            if (!buscarUsuario) {
                contenido.tipo = 2;
                contenido.msj = "El usuario esta inactivo o esta bloqueado";
                Respuesta.enviar(400, contenido, res);
            }
            else {
                if (buscarUsuario.comparePassword(contrasena, buscarUsuario.contrasena)) {
                    const token = await security.getToken({ id: buscarUsuario.id });
                    contenido.tipo = 1;
                    contenido.datos = {
                        jwt: token,
                        usuario: {
                            id: buscarUsuario.id,
                            login: buscarUsuario.login,
                            correo: buscarUsuario.correo,
                            empleado: buscarUsuario.empleado,
                            usuarioaccesos: buscarUsuario.usuarioaccesos 
                        }
                    };
                    contenido.msj = "Inicio de sesion correctamente";
                    Respuesta.enviar(200, contenido, res);
                }
                else {
                    buscarUsuario.fallidos += 1;
                    if (buscarUsuario.fallidos >= 5) {
                        buscarUsuario.estado = 'BL';
                    }
                    await buscarUsuario.save();
                    contenido.tipo = 2;
                    contenido.msj = "El usuario no exite o la contraseña es incorrecta";
                    Respuesta.enviar(400, contenido, res);
                }
            }
        } catch (error) {
            console.log(error);
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }
}


/**
 * @function generarPin
 * @description Genera un pin que es enviado a correo para poder reestablecer la contraseña
 */
exports.generarPin = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    contenido.msj = msjErrores.lista(validationResult(req));
    if (contenido.msj.length > 0) {
        Respuesta.enviar(200, contenido, res);
    }
    else {
        try {
            const { correo } = req.body;
            var buscarUsuario = await ModeloUsuario.findOne({
                attributes: ['id', 'login', 'correo'],
                include: {
                    model: ModeloEmpleado,
                    attributes: ['primernombre', 'segundonombre', 'primerapellido', 'segundoapellido', 'Imagen'],
                },
                where: {
                    correo: correo
                }
            });
            if (!buscarUsuario) {
                contenido.tipo = 1;
                contenido.datos = data;
                contenido.msj = "El correo no existe";
                Respuesta.enviar(400, contenido, res);
            } else {
                const pin = Math.floor(Math.random() * (999999 - 100000)) + 100000;
                const expiration =
                    Date.now() + moment.duration(1, "minute").asMilliseconds();
                buscarUsuario.set({ pin: pin });
                await buscarUsuario.save()
                .then((data)=>{
                    contenido.tipo = 1;
                    contenido.datos = {pin};
                    contenido.msj = "Se envio el pin";
                    Respuesta.enviar(200, contenido, res);
                }).catch((er)=>{
                    contenido.tipo = 2;
                    contenido.datos = data;
                    contenido.msj = "Error al generar el pin";
                    Respuesta.enviar(400, contenido, res);
                });
                /*const confirmSend = await SendEmail.sendAMail(
                    "SEND_PIN",
                    correo,
                    pin,
                    moment(expiration).format("LT L"),
                    process.env.COMPANY_NAME
                );*/
            }

        } catch (error) {
            console.log(error);
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }
}

/**
 * @function reestablecerContrasena
 * @description Reestablece la contraseña del usuario
 */
exports.reestablecerContrasena = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    contenido.msj = msjErrores.lista(validationResult(req));
    if (contenido.msj.length > 0) {
        Respuesta.enviar(200, contenido, res);
    }
    else {
        try {
            const { correo, pin, contrasena } = req.body;
            var buscarUsuario = await ModeloUsuario.findOne({
                attributes: ['id', 'login', 'correo'],
                include: {
                    model: ModeloEmpleado,
                    attributes: ['primernombre', 'segundonombre', 'primerapellido', 'segundoapellido', 'Imagen'],
                },
                where: {
                    correo: correo,
                    pin: pin
                }
            });
            if (!buscarUsuario) {
                contenido.tipo = 1;
                contenido.datos = data;
                contenido.msj = "El correo no existe o el pin es invalido";
                Respuesta.enviar(400, contenido, res);
            } else {
                
                buscarUsuario.set({ contrasena: buscarUsuario.genHash(contrasena.toString()), pin: '000000', estado: 'AC' });
                await buscarUsuario.save().then((data)=>{
                    contenido.tipo = 1;
                    contenido.datos = [];
                    contenido.msj = "Se reestablecio la contraseña";
                    Respuesta.enviar(200, contenido, res);
                }).catch((er)=>{
                    contenido.tipo = 2;
                    contenido.datos = [];
                    contenido.msj = "Error al actualizar la contrasena";
                    Respuesta.enviar(400, contenido, res);
                });
                /*const confirmSend = await SendEmail.sendAMail(
                    "SEND_PIN",
                    to,
                    contrasena,
                    null,
                    process.env.COMPANY_NAME
                );*/
            }
        } catch (error) {
            console.log(error);
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }
}

/**
 * @function errorLogin
 * @description Le indica al usuario que es necesario iniciar sesión nuevamente
 */
exports.errorLogin = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    contenido.tipo = 2;
    contenido.msj = "Es necesario que inicie sesión";
    Respuesta.enviar(400, contenido, res);
}