// Devuelve al inventario las cantidades de un pedido (usado al cancelar o eliminar).
async function reponerStock(pedido, productoRepository) {
  const productos = await productoRepository.bloquearPorIds(pedido.detalles.map((d) => d.productoId));
  const mapa = new Map(productos.map((p) => [p.id, p]));

  for (const detalle of pedido.detalles) {
    const producto = mapa.get(detalle.productoId);
    producto.reponerStock(detalle.cantidad);
    await productoRepository.actualizarStock(producto.id, producto.stock);
  }
}

module.exports = reponerStock;
