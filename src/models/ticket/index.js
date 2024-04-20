const Ticket = require('./ticket');

exports.Ticket = async () => {
    await Ticket.sync().then(() => {
        console.log('Modelo Ticket creado correctamente');
    })
    .catch((er) => {
        console.log("Error al crear el modelo Ticket");
        console.log(er);
    });
}