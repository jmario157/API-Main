/**
 * Controlador de usuarios
 * @author Carlos Flores
 * @date 20/06/2023
 * 
 */
const multer = require("multer");
const fs = require("fs");
const path = require("path");
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

/**
 * @function listarUsuarios
 * @description Lista los usuarios
 */
exports.listarUsuarios = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    try {
        await ModeloUsuario.findAll(
            {
                attributes: ['id', 'login', 'correo', 'logueado', 'activo', 'estado'],
                include: [
                    {
                        model: ModeloEmpleado,
                        attributes: ['primernombre', 'segundonombre', 'primerapellido', 'segundoapellido', 'Imagen']
                    },
                    {
                        model: ModeloUsuarioAcceso,
                        attributes: ['ruta', 'permisos', 'activo']
                    },
                ],
            }
        ).
            then((data) => {
                contenido.tipo = 1;
                contenido.datos = data;
                Respuesta.enviar(200, contenido, res);
            }).
            catch((er) => {
                contenido.tipo = 0;
                contenido.msj = "Error al cargar los datos de usuarios";
                Respuesta.enviar(500, contenido, res);
            });
    } catch (error) {
        contenido.tipo = 0;
        contenido.msj = "Error en el servidor";
        Respuesta.enviar(500, contenido, res);
    }
}

/**
 * @function buscarIdUsuario
 * @description Busca los datos de un usuario por su id
 */
exports.buscarIdUsuario = async (req, res) => {
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
            const { id } = req.query;
            await ModeloUsuario.findOne({
                attributes: ['id', 'login', 'correo', 'logueado', 'activo', 'estado'],
                include: [
                    {
                        model: ModeloEmpleado,
                        attributes: ['primernombre', 'segundonombre', 'primerapellido', 'segundoapellido', 'Imagen']
                    },
                    {
                        model: ModeloUsuarioAcceso,
                        attributes: ['ruta', 'permisos', 'activo']
                    },
                ],
                where: { id: id }
            }).
                then((data) => {
                    contenido.tipo = 1;
                    contenido.datos = data;
                    Respuesta.enviar(200, contenido, res);
                }).
                catch((er) => {
                    console.log(er);
                    contenido.tipo = 0;
                    contenido.msj = "Error al cargar los datos del usuario";
                    Respuesta.enviar(500, contenido, res);
                });
        } catch (error) {
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }
}


/**
 * @function buscarLoginUsuario
 * @description Busca los datos de un usuario por su login
 */
exports.buscarLoginUsuario = async (req, res) => {
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
            const { login } = req.query;
            await ModeloUsuario.findAll({
                attributes: ['id', 'login', 'correo', 'logueado', 'activo', 'estado'],
                include: [
                    {
                        model: ModeloEmpleado,
                        attributes: ['primernombre', 'segundonombre', 'primerapellido', 'segundoapellido', 'Imagen']
                    },
                    {
                        model: ModeloUsuarioAcceso,
                        attributes: ['ruta', 'permisos', 'activo']
                    },
                ],
                where: {
                    login: login
                }
            }).
                then((data) => {
                    contenido.tipo = 1;
                    contenido.datos = data;
                    Respuesta.enviar(200, contenido, res);
                }).
                catch((er) => {
                    console.log(er);
                    contenido.tipo = 0;
                    contenido.msj = "Error al cargar los datos del usuario";
                    Respuesta.enviar(500, contenido, res);
                });
        } catch (error) {
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }
}

/**
 * @function buscarNombreUsuario
 * @description Busca los datos de un usuario por su nombre de empleado
 */
exports.buscarNombreUsuario = async (req, res) => {
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
            const { nombre } = req.query;
            await ModeloEmpleado.findAll({
                attributes: ['primernombre', 'segundonombre', 'primerapellido', 'segundoapellido', 'Imagen'],
                include: [
                    {
                        model: ModeloUsuario,
                        attributes: ['id', 'login', 'correo', 'logueado', 'activo', 'estado']
                    },
                    {
                        model: ModeloUsuarioAcceso,
                        attributes: ['ruta', 'permisos', 'activo']
                    },
                ],
                where: {
                    [Op.or]: {
                        primernombre: {
                            [Op.like]: nombre
                        },
                        segundonombre: {
                            [Op.like]: nombre
                        }
                    }
                }
            }).
                then((data) => {
                    contenido.tipo = 1;
                    contenido.datos = data;
                    Respuesta.enviar(200, contenido, res);
                }).
                catch((er) => {
                    console.log(er);
                    contenido.tipo = 0;
                    contenido.msj = "Error al cargar los datos del usuario";
                    Respuesta.enviar(500, contenido, res);
                });
        } catch (error) {
            console.log(error);
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }
}


/**
 * @function guardarUsuario
 * @description Guarda los datos de un usuario
 */
exports.guardarUsuario = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    const { numeros } = req.body;
    console.log(numeros);
    contenido.msj = msjErrores.lista(validationResult(req));
    if (contenido.msj.length > 0) {
        Respuesta.enviar(400, contenido, res);
    }
    else {
        try {
            const { rutas } = req.body;
            await ModeloUsuario.create({ ...req.body }).then((data) => {
                contenido.tipo = 1;
                contenido.datos = data;
                contenido.msj = "Registro guardado correctamente";
                rutas.forEach(async element => {
                    await ModeloUsuarioAcceso.create({
                        usuarioId: data.id,
                        ruta: element.ruta,
                        permisos: element.permisos
                    }).then((d) => {
                        
                    }).catch((e) => {
                        contenido.tipo = 0;
                        contenido.datos = e;
                        contenido.msj = "Error al guardar el registro";
                    })
                });
                Respuesta.enviar(200, contenido, res);
            }).catch((er2) => {
                contenido.tipo = 0;
                contenido.datos = er2;
                contenido.msj = "Error al guardar el registro";
                Respuesta.enviar(500, contenido, res);
            });
        } catch (error) {
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }

}

/**
 * @function editarUsuario
 * @description Actualiza los datos de un usuario
 */
exports.editarUsuario = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    contenido.msj = msjErrores.lista(validationResult(req));
    if (contenido.msj.length > 0) {
        Respuesta.enviar(400, contenido, res);
    }
    else {
        try {
            const { id } = req.query;
            const { login, correo, empleadoId, rutas } = req.body;
            await ModeloUsuario.findOne({
                where: {
                    [Op.and]: [
                        { login: login },
                        { id: { [Op.not]: id } }
                    ]
                }
            }).then(async (data) => {
                if (!data) {
                    await ModeloUsuario.findOne({
                        where: {
                            [Op.and]: [
                                { correo: correo },
                                { id: { [Op.not]: id } }
                            ]

                        }
                    }).then(async (data1) => {
                        if (!data1) {
                            await ModeloUsuario.update(
                                { login: login, correo: correo, empleadoId: empleadoId },
                                { where: { id: id } }
                            ).then(async (data3) => {
                                contenido.tipo = 1;
                                contenido.datos = data3;
                                contenido.msj = "Registro actualizado correctamente";
                                await ModeloUsuarioAcceso.destroy({where: {usuarioId: id}});
                                
                                rutas.forEach(async element => {
                                    console.log(element);
                                    await ModeloUsuarioAcceso.create({
                                        usuarioId: id,
                                        ruta: element.ruta,
                                        permisos: element.permisos
                                    }).then((d) => {
                                        console.log(d);
                                    }).catch((e) => {
                                        console.log(e);
                                        contenido.tipo = 0;
                                        contenido.datos = e;
                                        contenido.msj = "Error al guardar el registro";
                                    })
                                });
                                Respuesta.enviar(200, contenido, res);
                            }).catch((er3) => {
                                console.log(er3);
                                contenido.tipo = 0;
                                contenido.datos = er3;
                                contenido.msj = "Error al actualizar el registro";
                                Respuesta.enviar(500, contenido, res);
                            });
                        }
                    }).catch((er2) => {
                        contenido.tipo = 2;
                        contenido.datos = [];
                        contenido.msj = "El correo no esta disponible ingrese otro";
                        Respuesta.enviar(400, contenido, res);
                    });
                }
                else{
                    contenido.tipo = 2;
                        contenido.datos = [];
                        contenido.msj = "El login no esta disponible ingrese otro";
                        Respuesta.enviar(400, contenido, res);
                }
            }).catch((er) => {
                contenido.tipo = 2;
                contenido.datos = [];
                contenido.msj = "El login no esta disponible ingrese otro";
                Respuesta.enviar(400, contenido, res);
            });
        } catch (error) {
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }

}

/**
 * @function activarUsuario
 * @description Actualiza el estado de un usuario
 */
exports.activarUsuario = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    contenido.msj = msjErrores.lista(validationResult(req));
    if (contenido.msj.length > 0) {
        Respuesta.enviar(400, contenido, res);
    }
    else {
        try {
            const { id } = req.query;
            await ModeloUsuario.update(
                { ...req.body },
                { where: { id: id } }
            ).then((data2) => {
                contenido.tipo = 1;
                contenido.datos = data2;
                contenido.msj = "Registro actualizado correctamente";
            }).catch((er2) => {
                contenido.tipo = 0;
                contenido.datos = er2;
                contenido.msj = "Error al actualizar el registro";
            });
            Respuesta.enviar(200, contenido, res);
        } catch (error) {
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }

}

/**
 * @function estadoUsuario
 * @description Actualiza el estado de un usuario
 */
exports.estadoUsuario = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    contenido.msj = msjErrores.lista(validationResult(req));
    if (contenido.msj.length > 0) {
        Respuesta.enviar(400, contenido, res);
    }
    else {
        try {
            const { id } = req.query;
            await ModeloUsuario.update(
                { ...req.body },
                { where: { id: id } }
            ).then((data2) => {
                contenido.tipo = 1;
                contenido.datos = data2;
                contenido.msj = "Registro actualizado correctamente";
            }).catch((er2) => {
                contenido.tipo = 0;
                contenido.datos = er2;
                contenido.msj = "Error al actualizar el registro";
            });
            Respuesta.enviar(200, contenido, res);
        } catch (error) {
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }

}
