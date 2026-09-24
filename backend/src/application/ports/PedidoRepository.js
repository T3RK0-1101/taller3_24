// oxlint-disable no-unused-vars -- los parámetros documentan el contrato que implementa cada adaptador
// Puerto de salida: persistencia de pedidos y su detalle.
class PedidoRepository {
  async crear(pedido) { throw new Error("No implementado: crear"); }
  async buscarPorId(id, opciones) { throw new Error("No implementado: buscarPorId"); }
  async listar(filtros) { throw new Error("No implementado: listar"); }
  async actualizarEstado(id, estado) { throw new Error("No implementado: actualizarEstado"); }
  async eliminar(id) { throw new Error("No implementado: eliminar"); }
}

module.exports = PedidoRepository;
