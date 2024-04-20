/**
 * Controlador de clientes
 * @author Carlos Flores
 * @date 20/06/2023
 * 
 */
const multer = require("multer");
const fs = require("fs");
const path = require("path");
//Importar modelos
const ModeloCliente = require("../../models/clientes/cliente");
const ModeloClienteTelefono = require("../../models/clientes/clientetelefono");
const ModeloProfesion = require('../../models/clientes/profesion');
const ModeloLugar = require('../../models/lugares/lugar');
const ModeloMunicipio = require('../../models/lugares/municipios');
const ModeloDepartamento = require('../../models/lugares/departamento');
//importar helpers
const Respuesta = require("../../helpers/respuesta");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const msjErrores = require("../../helpers/msjErrores");
const myFiles = require("../../Config/files");

/**
 * @function listarClientes
 * @description Lista los clientes
 */
exports.listarClientes = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    try {
        console.log(req.ip);
        console.log(req.headers['user-agent']);
        await ModeloCliente.findAll(
            {
                include:[
                    {
                        model: ModeloClienteTelefono,
                        attributes: ['numero'],
                    },
                    {
                        model: ModeloProfesion,
                        attributes: ['nombre'],
                    },
                    {
                        model: ModeloLugar,
                        attributes: ['nombre'],
                        include: {
                            model: ModeloMunicipio,
                            attributes: ['nombre'],
                            include: {
                                model: ModeloDepartamento,
                                attributes: ['nombre'],
                            }
                        }
                    }
                ],
                order: [
                    ['nombreprimer', 'DESC'],
                    ['nombresegundo', 'DESC'],
                    ['apellidoprimer', 'DESC'],
                    ['apellidoprimer', 'DESC']
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
                contenido.msj = "Error al cargar los datos de clientes";
                Respuesta.enviar(500, contenido, res);
            });
    } catch (error) {
        contenido.tipo = 0;
        contenido.msj = "Error en el servidor";
        Respuesta.enviar(500, contenido, res);
    }
}

/**
 * @function buscarIdCliente
 * @description Busca los datos de un cliente por su id
 */
exports.buscarIdCliente = async (req, res) => {
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
            await ModeloCliente.findOne({
                include:[
                    {
                        model: ModeloClienteTelefono,
                        attributes: ['numero'],
                    },
                    {
                        model: ModeloProfesion,
                        attributes: ['nombre'],
                    },
                ],
                order: [
                    ['nombreprimer', 'DESC'],
                    ['nombresegundo', 'DESC'],
                    ['apellidoprimer', 'DESC'],
                    ['apellidoprimer', 'DESC']
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
                    contenido.msj = "Error al cargar los datos del cliente";
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
 * @function buscarNombreCliente
 * @description Busca los datos de un cliente por su nombre
 */
exports.buscarNombreCliente = async (req, res) => {
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
            await ModeloCliente.findAll({
                include:[
                    {
                        model: ModeloClienteTelefono,
                        attributes: ['numero'],
                    },
                    {
                        model: ModeloProfesion,
                        attributes: ['nombre'],
                    },
                ],
                order: [
                    ['nombreprimer', 'DESC'],
                    ['nombresegundo', 'DESC'],
                    ['apellidoprimer', 'DESC'],
                    ['apellidoprimer', 'DESC']
                ], 
                where: {
                    [Op.or]: {
                        nombreprimer: {
                            [Op.like]: nombre
                        },
                        nombresegundo: {
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
                    contenido.msj = "Error al cargar los datos del cliente";
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
 * @function buscarApellidoCliente
 * @description Busca los datos de un cliente por su apellido
 */
exports.buscarApellidoCliente = async (req, res) => {
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
            const { apellido } = req.query;
            await ModeloCliente.findAll({
                include:[
                    {
                        model: ModeloClienteTelefono,
                        attributes: ['numero'],
                    },
                    {
                        model: ModeloProfesion,
                        attributes: ['nombre'],
                    },
                ],
                order: [
                    ['nombreprimer', 'DESC'],
                    ['nombresegundo', 'DESC'],
                    ['apellidoprimer', 'DESC'],
                    ['apellidoprimer', 'DESC']
                ], 
                where: {
                    [Op.or]: {
                        apellidoprimer: {
                            [Op.like]: apellido
                        },
                        apellidosegundo: {
                            [Op.like]: apellido
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
                    contenido.tipo = 0;
                    contenido.msj = "Error al cargar los datos del cliente";
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
 * @function guardarCliente
 * @description Guarda los datos de un cliente
 */
exports.guardarCliente = async (req, res) => {
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
            const { numeros } = req.body;
            await ModeloCliente.create({ ...req.body }).then((data) => {
                contenido.tipo = 1;
                contenido.datos = data;
                contenido.msj = "Registro guardado correctamente";
                numeros.forEach(async element => {
                    await ModeloClienteTelefono.create({
                        clienteId: data.id,
                        numero: element.numero
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
 * @function editarCliente
 * @description Actualiza los datos de un cliente
 */
exports.editarCliente = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    contenido.msj = msjErrores.lista(validationResult(req));
    if (contenido.msj.length > 0) {
        console.log(contenido)
        Respuesta.enviar(400, contenido, res);
    }
    else {
        try {
            const { id } = req.query;
            const { numeros } = req.body;
            await ModeloCliente.update(
                { ...req.body },
                { where: { id: id } }
            ).then(async(data) => {
                contenido.tipo = 1;
                contenido.datos = data;
                contenido.msj = "Registro guardado correctamente";
                await ModeloClienteTelefono.destroy({
                    where: {clienteId: id}
                });
                numeros.forEach(async element => {
                    await ModeloClienteTelefono.create({
                        clienteId: id,
                        numero: element.numero
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
                contenido.msj = "Error al actualizar el registro";
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
 * @function activarCliente
 * @description Actualiza el estado de un cliente
 */
exports.activarCliente = async (req, res) => {
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
            await ModeloCliente.update(
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
 * @function validarImagenCliente
 * @description Valida la imagen enviada
 */
exports.validarImagenCliente = (req, res, next) => {
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
        myFiles.uploadImagenCliente(req, res, async (err) => {

            if (err instanceof multer.MulterError) {
                contenido.tipo = 2;
                contenido.datos = [];
                contenido.msj = [{ campo: "imagen", msj: "El tamaño maximo de la imagen es de 1MB" }];
                Respuesta.enviar(400, contenido, res);
            } else if (err) {
                console.log(err);
                contenido.tipo = 2;
                contenido.datos = [];
                contenido.msj = [{ campo: "imagen", msj: "Tipos de imagen invalida" }];
                Respuesta.enviar(400, contenido, res);
            } else {
                next();
            }
        });
    }
}

/**
 * @function actualizarImagenCliente
 * @description Actualiza la imagen del cliente
 */
exports.actualizarImagenCliente = async (req, res) => {
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
            const imagen = req.file.filename;
            var buscarCliente = await ModeloCliente.findOne(
                { where: { id: id } }
            );
            if (!buscarCliente) {
                contenido.tipo = 2;
                contenido.datos = [];
                contenido.msj = [{ campo: "id", msj: "El id del cliente no existe" }];
                Respuesta.enviar(400, contenido, res);
            }
            else {
                const imagenAnterior = fs.existsSync(path.join(__dirname, '../../../public/uploads/images/clientes/' + buscarCliente.Imagen));
                if (imagenAnterior) {
                    fs.unlinkSync(path.join(__dirname, '../../../public/uploads/images/clientes/' + buscarCliente.Imagen)
                    );
                }
                const imagenNueva = fs.existsSync(path.join(__dirname, '../../../public/uploads/images/clientes/' + req.file.filename));
                if (!imagenNueva) {
                    contenido.tipo = 2;
                    contenido.datos = [];
                    contenido.msj = [{ campo: "imagen", msj: "La imagen no existe o no se guardo correctamente" }];
                    Respuesta.enviar(400, contenido, res);
                }
                else {
                    buscarCliente.set({
                        Imagen: imagen,
                    });
                    await buscarCliente.save();
                    contenido.tipo = 1;
                    contenido.datos = buscarCliente;
                    contenido.msj = "Registro actualizado correctamente";
                    Respuesta.enviar(200, contenido, res);
                }
            }

        } catch (error) {
            console.log(error);
            contenido.tipo = 0;
            contenido.datos = error;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }

    }
}