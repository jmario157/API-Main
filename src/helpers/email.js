/**
 * Configuración de la plantilla del correo electrónico
 * @author Alessandro Cardona
 * @date 2021 - 02 - 20
 * @namespace helpers/email
 */

//Requerimos el paquete
const nodemailer = require("nodemailer");

const EmailConfig = require("../Config/email");

// Importar Handlebars
const hbs = require("handlebars");
const fs = require("fs");
const path = require("path");

/**
 * @memberof helpers/email
 * @function sendAMail
 * @param {string} type El tipo de plantilla que se desea usar
 * @param {email} to A quien se dirige el correo electrónico
 * @param {numbe} secretPin El código secreto o contraseña nueva
 * @param {date} expirationTime La fecha de expiración en el formato como la genera js (segundos)
 * @param {string} companyName Nombre de la compañía que usa el servidor
 * @returns {promise} Retorna una promesa, al enviarse el correo electrónico
 */
exports.sendAMail = async (
  type,
  to,
  secretPin,
  expirationTime,
  companyName
) => {
  const data = {
    usuario: to,
    secretPin,
    expirationTime,
    companyName,
  };

  let content;
  let mailOptions;
  let template;
  let html;

  switch (type) {
    // Para enviar el pin
    case "SEND_PIN":
      // Cargar el archivo
      content = fs.readFileSync(
        path.resolve(
          __dirname,
          "../../views/emails/restore_password_email.hbs"
        ),
        "utf8"
      );
      // Decirle el template
      template = hbs.compile(content.toString());
      html = template(data);

      // Crear el correo electrónico
      mailOptions = {
        from: `${companyName} ${EmailConfig.user}`,
        to,
        subject: `Restablece tu contraseña de ${companyName}`,
        text: `¡Has solicitado restablecer tu contraseña de ${companyName}! Autoriza el contenido HTML.`,
        html,
      };

      break;

    // Para resetear la contrasena
    case "RESET_PASSWORD":
      content = fs.readFileSync(
        path.resolve(__dirname, "../../views/emails/new_password_email.hbs"),
        "utf8"
      );

      // Decirle el template
      template = hbs.compile(content.toString());
      html = template(data);

      // Crear el correo electrónico
      mailOptions = {
        from: `${companyName} ${EmailConfig.user}`,
        to,
        subject: `Contraseña nueva de ${companyName}`,
        text: `¡Se ha restablecido tu contraseña de ${companyName}! Autoriza el contenido HTML.`,
        html,
      };

      break;

    default:
      console.log("TIENES QUE DEFINIR EL TIPO DE CORREO PARA LA PLANTILLA");
      break;
  }
  // Crear el objeto de transporte
  const transporter = nodemailer.createTransport({
    service: EmailConfig.service,
    //port: 465,
    //secure: true,
    auth: {
      user: EmailConfig.user,
      pass: EmailConfig.pass,
    },
  });

  // Retornar la respues despues de enviar el correo electrónico
  return await transporter.sendMail(mailOptions);
};
