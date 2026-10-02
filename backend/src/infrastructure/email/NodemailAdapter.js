const nodemailer = require("nodemailer");
const EmailServicePort = require("../../application/ports/EmailServicePort");
const { plantillaCliente, plantillaAdmin } = require("./plantillas");

// Adaptador de salida: implementa EmailServicePort con Nodemailer (SMTP).
class NodemailAdapter extends EmailServicePort {
  constructor({ emailConfig, pagoConfig }) {
    super();
    this.config = emailConfig;
    this.pago = pagoConfig;
    this.transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.port === 465,
      auth: { user: emailConfig.user, pass: emailConfig.pass },
    });
  }

  async #enviar(para, { asunto, html, texto }) {
    const info = await this.transporter.sendMail({
      from: this.config.from,
      to: para,
      subject: asunto,
      html,
      text: texto,
    });
    const vista = nodemailer.getTestMessageUrl(info);
    console.log(`Correo enviado a ${para}${vista ? ` | Vista previa: ${vista}` : ""}`);
    return info;
  }

  async enviarConfirmacionPedido(pedido, cliente) {
    const correo = plantillaCliente({ pedido, cliente, pago: this.pago });
    return this.#enviar(cliente.email, correo);
  }

  async notificarNuevoPedidoAdmin(pedido, cliente) {
    if (!this.config.adminEmail) return null;
    const correo = plantillaAdmin({ pedido, cliente });
    return this.#enviar(this.config.adminEmail, correo);
  }
}

module.exports = NodemailAdapter;
