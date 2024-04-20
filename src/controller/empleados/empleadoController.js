/**
 * Controlador de empleados
 * @author Carlos Flores
 * @date 08/06/2023
 * 
 */
const multer = require("multer");
const fs = require("fs");
const path = require("path");
//Importar modelos
const ModeloCargo = require("../../models/empleados/cargo");
const ModeloEmpleado = require('../../models/empleados/empleado');
//importar helpers
const Respuesta = require("../../helpers/respuesta");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const msjErrores = require("../../helpers/msjErrores");
const myFiles = require("../../Config/files");

/**
 * @function listarEmpleados
 * @description Lista los empleados
 */
exports.listarEmpleados = async (req, res) => {
    var contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };
    await ModeloEmpleado.findAll(
        {
            include:
                { model: ModeloCargo }
        }
    ).
        then((data) => {
            contenido.tipo = 1;
            contenido.datos = data;
            contenido.msj = "Consulta ejecutada correctamente";
            Respuesta.enviar(200, contenido, res);
        }).
        catch((er) => {
            contenido.tipo = 0;
            contenido.msj = "Error al cargar los datos de los empleados";
            Respuesta.enviar(500, contenido, res);
        });
}

/**
 * @function buscarIdEmpleado
 * @description Busca los datos de un empleado por su id
 */
exports.buscarIdEmpleado = async (req, res) => {
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
        const { id } = req.query;
        await ModeloEmpleado.findOne(
            {
                include: {
                    model: ModeloCargo,
                    attributes: ['nombre', 'descripcion'],
                },
                where: { id: id },
            },
        ).
            then((data) => {
                contenido.tipo = 1;
                contenido.datos = data;
                contenido.msj = "Consulta ejecutada correctamente";
                Respuesta.enviar(200, contenido, res);
            }).
            catch((er) => {
                contenido.tipo = 0;
                contenido.msj = "Error al cargar los datos del empleado";
                Respuesta.enviar(500, contenido, res);
            });
    }
}
/**
 * @function buscarNombreEmpleado
 * @description Busca los datos de un empleado por su nombre y apallido
 */
exports.buscarEmpleado = async (req, res) => {
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
        const { filtro, activo } = req.query;
        await ModeloEmpleado.findOne(
            {
                include: {
                    model: ModeloCargo,
                    attributes: ['nombre', 'descripcion'],
                },
                where: {
                    [Op.or]: {
                        identidad: { [Op.like]: filtro },
                        primernombre: { [Op.like]: filtro },
                        segundonombre: { [Op.like]: filtro },
                        primerapellido: { [Op.like]: filtro },
                        segundoapellido: { [Op.like]: filtro },
                    },
                    activo: activo
                },
            },
        ).
            then((data) => {
                contenido.tipo = 1;
                contenido.datos = data;
                Respuesta.enviar(200, contenido, res);
            }).
            catch((er) => {
                contenido.tipo = 0;
                contenido.msj = "Error al cargar los datos del empleado";
                Respuesta.enviar(500, contenido, res);
            });
    }
}

/**
 * @function guardarEmpleado
 * @description Guarda los datos de un empleado
 */
exports.guardarEmpleado = async (req, res) => {
    var contenido = {
        tipo: 2,
        datos: [],
        msj: [],
    };
    contenido.msj = msjErrores.lista(validationResult(req));
    if (contenido.msj.length > 0) {
        Respuesta.enviar(200, contenido, res);
    }
    else {
        try {
            await ModeloEmpleado.create({ ...req.body }).then((data2) => {
                contenido.tipo = 1;
                contenido.datos = data2;
                contenido.msj = "Registro guardado correctamente";
                Respuesta.enviar(200, contenido, res);
            }).catch((er) => {
                contenido.tipo = 2;
                contenido.datos = er;
                contenido.msj = "Error al guardar el registro";
                Respuesta.enviar(500, contenido, res);
            });
        }
        catch (er) {
            contenido.tipo = 0;
            contenido.datos = er;
            contenido.msj = "Error al guardar el registro";
            Respuesta.enviar(500, contenido, res);
        }

    }

}

/**
 * @function editarEmpleado
 * @description Actualiza los datos de un empleado
 */
exports.editarEmpleado = async (req, res) => {
    var contenido = {
        tipo: 2,
        datos: [],
        msj: [],
    };
    contenido.msj = msjErrores.lista(validationResult(req));
    if (contenido.msj.length > 0) {
        Respuesta.enviar(400, contenido, res);
    }
    else {
        const { id } = req.query;
        const { identidad } = req.body;
        const buscarIdentidad = await ModeloEmpleado.findOne({
            where: {
                id: {
                    [Op.not]: id
                },
                identidad: identidad
            }
        })
        if (!buscarIdentidad) {
            await ModeloEmpleado.update(
                { ...req.body },
                { where: { id: id } }
            ).then((data2) => {
                contenido.tipo = 1;
                contenido.datos = data2;
                contenido.msj = "Registro actualizado correctamente";
                Respuesta.enviar(200, contenido, res);
            }).catch((er2) => {
                contenido.tipo = 0;
                contenido.datos = er2;
                contenido.msj = "Error al actualizar el registro";
                Respuesta.enviar(500, contenido, res);
            });
        }
        else {
            contenido.tipo = 2;
            contenido.datos = [];
            contenido.msj = [{ campo: "identidad", msj: "La identidad ya esta en uso por otro empleado" }];
            Respuesta.enviar(400, contenido, res);
        }
    }

}

/**
 * @function activarEmpleado
 * @description Actualiza el estado de un cargo
 */
exports.activarEmpleado = async (req, res) => {
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
        const { activo } = req.body;
        const { id } = req.query;

        await ModeloEmpleado.findOne({
            where: {
                id: id
            }
        }).
            then(async (data) => {
                if (data) {
                    await ModeloCargo.update(
                        { ...req.body },
                        { where: { id: id } }
                    ).then((data2) => {
                        contenido.tipo = 1;
                        contenido.datos = data2;
                        contenido.msj = "Registro actualizado correctamente";
                        Respuesta.enviar(200, contenido, res);
                    }).catch((er2) => {
                        contenido.tipo = 0;
                        contenido.datos = er2;
                        contenido.msj = "Error al actualizar el registro";
                        Respuesta.enviar(500, contenido, res);
                    });
                }
                else {
                    contenido.tipo = 2;
                    contenido.datos = data;
                    contenido.msj = "El id del cargo no existe";
                    Respuesta.enviar(400, contenido, res);
                }
            }).
            catch((er) => {
                contenido.tipo = 0;
                contenido.msj = "Error al buscar los datos del cargo";
                Respuesta.enviar(500, contenido, res);
            });
    }

}

/**
 * @function validarImagenEmpleado
 * @description Valida la imagen enviada
 */
exports.validarImagenEmpleado = (req, res, next) => {
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
        myFiles.uploadImagenEmpleado(req, res, async (err) => {

            if (err instanceof multer.MulterError) {
                contenido.tipo = 2;
                contenido.datos = [];
                contenido.msj = [{ campo: "imagen", msj: "El tamaño maximo de la imagen es de 1MB" }];
                Respuesta.enviar(400, contenido, res);
            } else if (err) {
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
 * @function actualizarImagenEmpleado
 * @description Actualiza la imagen del empleado
 */
exports.actualizarImagenEmpleado = async (req, res) => {
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
            var buscarEmpleado = await ModeloEmpleado.findOne(
                { where: { id: id } }
            );
            if (!buscarEmpleado) {
                contenido.tipo = 2;
                contenido.datos = [];
                contenido.msj = [{ campo: "id", msj: "El id del empleado no existe" }];
                Respuesta.enviar(400, contenido, res);
            }
            else {
                const imagenAnterior = fs.existsSync(path.join(__dirname, '../../public/uploads/images/empleados/' + buscarEmpleado.Imagen));
                if (imagenAnterior) {
                    fs.unlinkSync(path.join(__dirname, '../../public/uploads/images/empleados/' + buscarEmpleado.Imagen)
                    );
                }
                const imagenNueva = fs.existsSync(path.join(__dirname, '../../public/uploads/images/empleados/' + req.file.filename));
                if (!imagenNueva) {
                    contenido.tipo = 2;
                    contenido.datos = [];
                    contenido.msj = [{ campo: "imagen", msj: "La imagen no existe o no se guardo correctamente" }];
                    Respuesta.enviar(400, contenido, res);
                }
                else {
                    buscarEmpleado.set({
                        Imagen: imagen,
                    });
                    await buscarEmpleado.save();
                    contenido.tipo = 1;
                    contenido.datos = buscarEmpleado;
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





