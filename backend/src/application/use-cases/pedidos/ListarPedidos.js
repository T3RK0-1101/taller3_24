class ListarPedidos {
  constructor({ pedidoRepository }) {
    this.pedidoRepository = pedidoRepository;
  }

  // El administrador ve todos los pedidos; el cliente solo los suyos.
  async ejecutar(solicitante) {
    const filtros = solicitante.rol === "admin" ? {} : { usuarioId: solicitante.id };
    return this.pedidoRepository.listar(filtros);
  }
}

module.exports = ListarPedidos;
