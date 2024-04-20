const { Empleados } = require('./empleados');
const { Configuracion } = require('./configuracion');
const { Cajas } = require('./cajas');
const { Bancos } = require('./bancos');
const { Clientes } = require('./clientes');
const { Pagos } = require('./pagos');
const { Lugares } = require('./lugares');
const { Alquiler } = require('./alquiler');
const { Inventario } = require('./Inventario');
const { NotaPeso } = require('./notaPeso')
const { Factura } = require('./factura')
const { Ticket } = require('./ticket');
var { tablaAmortizacion } = require("../helpers/amortizacion");


exports.CrearModelos = () => {
  Lugares();
  Empleados();
  Configuracion();
  Cajas();
  Bancos();
  Clientes();
  Pagos();
  Alquiler();
  Inventario();
  NotaPeso();
  Factura();
  Ticket();
};