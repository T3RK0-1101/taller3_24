const Pedido = require("../../../domain/entities/Pedido");

class CrearPedido {
  constructor({ unitOfWork }) {
    this.unitOfWork = unitOfWork;
  }

  async ejecutar({ usuarioId, items }) {
    const normalizados = Pedido.normalizarItems(items);
    const ids = normalizados.map((i) => i.productoId);

    // Todo ocurre en una sola transacción: si algo falla, no se descuenta stock ni se crea el pedido.
    return this.unitOfWork.ejecutar(async ({ productoRepository, pedidoRepository }) => {
      const productos = await productoRepository.bloquearPorIds(ids);
      const mapa = new Map(productos.map((p) => [p.id, p]));

      const pedido = Pedido.crear({ usuarioId, items: normalizados, productos: mapa });

      for (const producto of productos) {
        await productoRepository.actualizarStock(producto.id, producto.stock);
      }

      return pedidoRepository.crear(pedido);
    });
  }
}

module.exports = CrearPedido;
