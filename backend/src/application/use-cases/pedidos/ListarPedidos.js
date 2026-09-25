const Usuario = require("../../../domain/entities/Usuario");

class ListarPedidos {
  constructor({ pedidoRepository }) {
    this.pedidoRepository = pedidoRepository;
  }

  // El personal de pedidos (admin y gestor) ve todos; el cliente solo los suyos.
  async ejecutar(solicitante) {
    const filtros = Usuario.gestionaPedidos(solicitante.rol) ? {} : { usuarioId: solicitante.id };
    return this.pedidoRepository.listar(filtros);
  }
}

module.exports = ListarPedidos;
