// Puerto de salida: contrato para notificar pedidos por correo electrónico.
// La capa de aplicación depende de esta abstracción, no de ningún proveedor concreto.
class EmailServicePort {
  // Envía al cliente el comprobante del pedido con las instrucciones de pago.
  async enviarConfirmacionPedido(_pedido, _cliente) {
    throw new Error("EmailServicePort.enviarConfirmacionPedido no implementado");
  }

  // Avisa al administrador que llegó un nuevo pedido.
  async notificarNuevoPedidoAdmin(_pedido, _cliente) {
    throw new Error("EmailServicePort.notificarNuevoPedidoAdmin no implementado");
  }
}

module.exports = EmailServicePort;
