const DomainError = require("../../../domain/errors/DomainError");
const reponerStock = require("./reponerStock");

class EliminarPedido {
  constructor({ unitOfWork }) {
    this.unitOfWork = unitOfWork;
  }

  async ejecutar(id) {
    await this.unitOfWork.ejecutar(async ({ pedidoRepository, productoRepository }) => {
      const pedido = await pedidoRepository.buscarPorId(id, { bloquear: true });
      if (!pedido) throw DomainError.notFound("Pedido no encontrado");

      // Si el pedido seguía pendiente, su stock aún estaba apartado: se devuelve.
      if (pedido.estaPendiente()) await reponerStock(pedido, productoRepository);

      await pedidoRepository.eliminar(pedido.id);
    });
  }
}

module.exports = EliminarPedido;
