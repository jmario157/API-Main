const { body, query } = require("express-validator");
const ticketController = require('../../controller/ticket/ticketController');
const ModeloTicket = require('../../models/ticket/ticket');
var router = require("express").Router();
const { Op } = require('sequelize');

router.get("/", (req, res) => {
    const data = {
        apiName: "API - SIGBIR",
        propietario: "DESOFIW",
    };
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(data);
});

router.get("/listar", ticketController.listarTickets);

router.get('/buscarid',
    query('id').isInt().withMessage('El id debe ser un número entero'),
    ticketController.buscarTicketPorId
);

router.post('/crear',
    body("title").isLength().withMessage('El título es requerido'),
    body("description").isLength().withMessage('La descripción es requerida'),
    body("activo").optional().isBoolean().withMessage("Solo se permiten valores boleanos"),
    ticketController.guardarTicket
);

router.put('/editar',
    query("id").isInt().withMessage("El id debe ser un número entero")
        .custom(async value => {
            if (!value) {
                throw new Error('El id no permite valores nulos');
            }
            else {
                const buscarTicket = await ModeloTicket.findOne({
                    where: { id: value }
                });
                if (!buscarTicket) {
                    throw new Error('El Id del ticket no existe');
                }
            }
        }),
    body("title").isLength().withMessage('El título es requerido'),
    body("description").isLength().withMessage('La descripción es requerida'),
    body("activo").optional().isBoolean().withMessage("Solo se permiten valores boleanos"),
    ticketController.editarTicket
);

router.put("/activar",
    query("id").isInt().withMessage("El id debe ser un numero entero"),
    body("activo").isBoolean().withMessage("Solo se permiten valores boleanos"),
    ticketController.activarTicket
);

module.exports = router;
