const DomainError = require("../../../domain/errors/DomainError");
const Usuario = require("../../../domain/entities/Usuario");

class ObtenerPedido {
  constructor({ pedidoRepository }) {
    this.pedidoRepository = pedidoRepository;
  }

  async ejecutar(id, solicitante) {
    const pedido = await this.pedidoRepository.buscarPorId(id);
    if (!pedido) throw DomainError.notFound("Pedido no encontrado");

    if (!Usuario.gestionaPedidos(solicitante.rol) && !pedido.perteneceA(solicitante.id)) {
      throw DomainError.forbidden("No puedes consultar pedidos de otros usuarios");
    }
    return pedido;
  }
}

module.exports = ObtenerPedido;
