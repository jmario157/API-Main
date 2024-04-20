/**
 * Controlador de alquiler
 * @author Jose Mario Salgado
 * @date 20/01/2024
 * 
 */

const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const Alquiler = require('../../models/alquiler/alquiler');
const Respuesta = require('../../helpers/respuesta');
const msjErrores = require('../../helpers/msjErrores');

/**
 * @function getAll
 * @description Obtener todos los alquileres.
 */
exports.getAll = (req, res) => {
    const contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };

    Alquiler.findAll()
        .then(alquileres => {
            contenido.tipo = 1;
            contenido.datos = alquileres;
            Respuesta.enviar(200, contenido, res);
        })
        .catch(err => {
            contenido.tipo = 0;
            contenido.msj = `Error al obtener los alquileres: ${err.message}`;
            Respuesta.enviar(500, contenido, res);
        });
};

/**
 * @function getById
 * @description Obtener alquiler por su ID.
 */
exports.getById = (req, res) => {
    const contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };

    const alquilerId = req.query.id;

    Alquiler.findByPk(alquilerId)
        .then(alquiler => {
            if (alquiler) {
                contenido.tipo = 1;
                contenido.datos = alquiler;
                Respuesta.enviar(200, contenido, res);
            } else {
                contenido.msj = 'Alquiler no encontrado';
                Respuesta.enviar(404, contenido, res);
            }
        })
        .catch(err => {
            contenido.tipo = 0;
            contenido.msj = `Error al obtener el alquiler: ${err.message}`;
            Respuesta.enviar(500, contenido, res);
        });
};

/**
 * @function buscarMaquinaria
 * @description Obtiene el alquiler por el nombre de la maquinaria.
 */
exports.buscarMaquinaria = async (req, res) => {
    const contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };

    contenido.msj = msjErrores.lista(validationResult(req));

    if (contenido.msj.length > 0) {
        Respuesta.enviar(200, contenido, res);
    } else {
        try {
            const { maquinaria } = req.query;
            
            await Alquiler.findAll({
                where: {
                    [Op.or]: {
                        maquinaria: {
                            [Op.like]: maquinaria
                        },
                    }
                }
            }).then((data) => {
                contenido.tipo = 1;
                contenido.datos = data;
                Respuesta.enviar(200, contenido, res);
            }).catch((er) => {
                console.log(er);
                contenido.tipo = 0;
                contenido.msj = "Error al cargar los datos del alquiler";
                Respuesta.enviar(500, contenido, res);
            });

        } catch (error) {
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }
};

/**
 * @function buscarDuracion
 * @description Obtiene el alquiler por la duracion de este.
 */
exports.buscarDuracion = async (req, res) => {
    const contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };

    contenido.msj = msjErrores.lista(validationResult(req));

    if (contenido.msj.length > 0) {
        Respuesta.enviar(200, contenido, res);
    } else {
        try {
            const { duracion } = req.query;

            await Alquiler.findAll({
                where: {
                    duracion: {
                        [Op.eq]: duracion
                    }
                }
            }).then((data) => {
                contenido.tipo = 1;
                contenido.datos = data;
                Respuesta.enviar(200, contenido, res);
            }).catch((er) => {
                console.log(er);
                contenido.tipo = 0;
                contenido.msj = "Error al cargar los datos del alquiler";
                Respuesta.enviar(500, contenido, res);
            });

        } catch (error) {
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }
};

/**
 * @function buscarCosto
 * @description Obtiene el alquiler por el costo asignado.
 */
exports.buscarCosto = async (req, res) => {
    const contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };

    contenido.msj = msjErrores.lista(validationResult(req));

    if (contenido.msj.length > 0) {
        Respuesta.enviar(200, contenido, res);
    } else {
        try {
            const { costo } = req.query;

            await Alquiler.findAll({
                where: {
                    costo: {
                        [Op.eq]: costo
                    }
                }
            }).then((data) => {
                contenido.tipo = 1;
                contenido.datos = data;
                Respuesta.enviar(200, contenido, res);
            }).catch((er) => {
                console.log(er);
                contenido.tipo = 0;
                contenido.msj = "Error al cargar los datos del alquiler";
                Respuesta.enviar(500, contenido, res);
            });

        } catch (error) {
            contenido.tipo = 0;
            contenido.msj = "Error en el servidor";
            Respuesta.enviar(500, contenido, res);
        }
    }
};

/**
 * @function create
 * @description Crear un nuevo alquiler.
 */
exports.create = (req, res) => {
    const contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };

    const nuevoAlquiler = req.body;

    Alquiler.create(nuevoAlquiler)
        .then(result => {
            contenido.tipo = 1;
            contenido.datos = { id: result.id, message: 'Alquiler creado correctamente' };
            Respuesta.enviar(200, contenido, res);
        })
        .catch(err => {
            contenido.tipo = 0;
            contenido.msj = `Error al crear el alquiler: ${err.message}`;
            Respuesta.enviar(500, contenido, res);
        });
};

/**
 * @function update
 * @description Actualizar un alquiler por su ID.
 */
exports.update = (req, res) => {
    const contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };

    const alquilerId = req.query.id;
    const datosActualizados = req.body;

    Alquiler.update(datosActualizados, { where: { id: alquilerId } })
        .then(() => {
            contenido.tipo = 1;
            contenido.datos = { message: 'Alquiler actualizado correctamente' };
            Respuesta.enviar(200, contenido, res);
        })
        .catch(err => {
            contenido.tipo = 0;
            contenido.msj = `Error al actualizar el alquiler: ${err.message}`;
            Respuesta.enviar(500, contenido, res);
        });
};

/**
 * @function deleteById
 * @description Eliminar un alquiler por su ID.
 */
exports.deleteById = (req, res) => {
    const contenido = {
        tipo: 0,
        datos: [],
        msj: [],
    };

    const alquilerId = req.params.id;

    Alquiler.destroy({ where: { id: alquilerId } })
        .then(() => {
            contenido.tipo = 1;
            contenido.datos = { message: 'Alquiler eliminado correctamente' };
            Respuesta.enviar(200, contenido, res);
        })
        .catch(err => {
            contenido.tipo = 0;
            contenido.msj = `Error al eliminar el alquiler: ${err.message}`;
            Respuesta.enviar(500, contenido, res);
        });
};
