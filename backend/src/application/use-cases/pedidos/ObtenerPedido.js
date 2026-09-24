const DomainError = require("../../../domain/errors/DomainError");

class ObtenerPedido {
  constructor({ pedidoRepository }) {
    this.pedidoRepository = pedidoRepository;
  }

  async ejecutar(id, solicitante) {
    const pedido = await this.pedidoRepository.buscarPorId(id);
    if (!pedido) throw DomainError.notFound("Pedido no encontrado");

    if (solicitante.rol !== "admin" && !pedido.perteneceA(solicitante.id)) {
      throw DomainError.forbidden("No puedes consultar pedidos de otros usuarios");
    }
    return pedido;
  }
}

module.exports = ObtenerPedido;
