//const express = require('express');
const { body, query } = require("express-validator");
const alquilerController = require('../../controller/alquiler/alquilerController');
const ModeloAlquiler = require('../../models/alquiler/alquiler');
var router = require("express").Router();
const { Op } = require('sequelize');


// Ruta principal con la información básica de la API
router.get('/', (req, res) => {
    const data = {
        apiName: 'API - SIGBIR',
        propietario: 'DESOFIW',
    };
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(data);
});

// Rutas CRUD para Alquiler
router.get('/listar', alquilerController.getAll);

/**
 * @memberof routes/api/alquiler
 * @method buscarid
 * @description Lista todos los alquileres guardados en la base de datos
 * {@link server/api/alquiler/buscarid}
 * @param {integer} id del alquiler 
 */
router.get('/buscarid', 
    query('id').isInt().withMessage('El id debe ser un número entero'),
    alquilerController.getById
);

/**
 * @memberof routes/api/alquiler
 * @method buscarMaquinaria
 * @description Lista todos los alquileres con la maquinaria especificada
 * {@link server/api/alquiler/buscarMaquinaria}
 * @param {string} maquinaria
 */
router.get('/buscarMaquinaria', 
    query('maquinaria').isLength({ min: 3, max: 50 }).withMessage('El límite de caracteres es de 3 - 50'),
    alquilerController.buscarMaquinaria
);

/**
 * @memberof routes/api/alquiler
 * @method buscarDuracion
 * @description Lista todos los alquileres con la duración especificada
 * {@link server/api/alquiler/buscarDuracion}
 * @param {integer} duracion
 */
router.get('/buscarDuracion', 
    query('duracion').isInt().withMessage('La duración debe ser un número entero'),
    alquilerController.buscarDuracion
);

/**
 * @memberof routes/api/alquiler
 * @method buscarCosto
 * @description Lista todos los alquileres con el costo especificado
 * {@link server/api/alquiler/buscarCosto}
 * @param {float} costo
 */
router.get('/buscarCosto', 
    query('costo').isFloat().withMessage('El costo debe ser un número decimal'),
    alquilerController.buscarCosto
);

router.post('/crear',
    query("id").isInt().withMessage("El id debe ser un número entero"),
    body('maquinaria').isLength({ min: 3, max: 50 }).withMessage('El límite de caracteres es de 3 - 50'),
    body('duracion').isInt().withMessage('La duración debe ser un número entero'),
    body('costo').isFloat().withMessage('El costo debe ser un número decimal'),
    alquilerController.create
);

router.put('/editar',
    query('id').isInt().withMessage('El ID debe ser un número entero')
    .custom(async value => {
        if (!value) {
            throw new Error('El id no permite valores nulos');
        }
        else {
            const buscarAlquiler = await ModeloAlquiler.findOne({
                where: { id: value }
            });
            if (!buscarAlquiler) {
                throw new Error('El Id del cliente no exite');
            }
        }
    }),
    body('maquinaria').isLength({ min: 3, max: 50 }).withMessage('El límite de caracteres es de 3 - 50'),
    body('duracion').isInt().withMessage('La duración debe ser un número entero'),
    body('costo').isFloat().withMessage('El costo debe ser un número decimal'),
    alquilerController.update
);

router.delete('/eliminar/:id', alquilerController.deleteById);

module.exports = router;
