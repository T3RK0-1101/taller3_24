const DomainError = require("../../../domain/errors/DomainError");
const Usuario = require("../../../domain/entities/Usuario");
const reponerStock = require("./reponerStock");

class ActualizarEstadoPedido {
  constructor({ unitOfWork }) {
    this.unitOfWork = unitOfWork;
  }

  async ejecutar(id, estado, solicitante) {
    return this.unitOfWork.ejecutar(async ({ pedidoRepository, productoRepository }) => {
      const pedido = await pedidoRepository.buscarPorId(id, { bloquear: true });
      if (!pedido) throw DomainError.notFound("Pedido no encontrado");

      // Admin y gestor pueden completar o cancelar cualquier pedido; el cliente solo cancelar los suyos.
      if (!Usuario.gestionaPedidos(solicitante.rol)) {
        if (!pedido.perteneceA(solicitante.id)) {
          throw DomainError.forbidden("No puedes modificar pedidos de otros usuarios");
        }
        if (estado !== "cancelado") {
          throw DomainError.forbidden("Solo puedes cancelar tus pedidos");
        }
      }

      pedido.cambiarEstado(estado);
      if (estado === "cancelado") await reponerStock(pedido, productoRepository);

      await pedidoRepository.actualizarEstado(pedido.id, pedido.estado);
      return pedidoRepository.buscarPorId(pedido.id);
    });
  }
}

module.exports = ActualizarEstadoPedido;
