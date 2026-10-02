const Pedido = require("../../../domain/entities/Pedido");

class CrearPedido {
  constructor({ unitOfWork, emailService }) {
    this.unitOfWork = unitOfWork;
    this.emailService = emailService;
  }

  async ejecutar({ usuarioId, items }) {
    const normalizados = Pedido.normalizarItems(items);
    const ids = normalizados.map((i) => i.productoId);

    // Todo ocurre en una sola transacción: si algo falla, no se descuenta stock ni se crea el pedido.
    const pedido = await this.unitOfWork.ejecutar(async ({ productoRepository, pedidoRepository }) => {
      const productos = await productoRepository.bloquearPorIds(ids);
      const mapa = new Map(productos.map((p) => [p.id, p]));

      const nuevo = Pedido.crear({ usuarioId, items: normalizados, productos: mapa });

      for (const producto of productos) {
        await productoRepository.actualizarStock(producto.id, producto.stock);
      }

      return pedidoRepository.crear(nuevo);
    });

    await this.notificar(pedido);
    return pedido;
  }

  // El pedido ya está confirmado: un fallo del correo no debe revertirlo.
  async notificar(pedido) {
    if (!this.emailService) return;

    const resultados = await Promise.allSettled([
      this.emailService.enviarConfirmacionPedido(pedido, pedido.cliente),
      this.emailService.notificarNuevoPedidoAdmin(pedido, pedido.cliente),
    ]);

    for (const r of resultados) {
      if (r.status === "rejected") {
        console.error(`No se pudo enviar una notificación del pedido #${pedido.id}:`, r.reason.message);
      }
    }
  }
}

module.exports = CrearPedido;
