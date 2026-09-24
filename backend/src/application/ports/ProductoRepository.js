// oxlint-disable no-unused-vars -- los parámetros documentan el contrato que implementa cada adaptador
// Puerto de salida: persistencia de productos.
class ProductoRepository {
  async crear(producto) { throw new Error("No implementado: crear"); }
  async buscarPorId(id) { throw new Error("No implementado: buscarPorId"); }
  async listar(filtros) { throw new Error("No implementado: listar"); }
  async actualizar(producto) { throw new Error("No implementado: actualizar"); }
  async eliminar(id) { throw new Error("No implementado: eliminar"); }
  // Obtiene y bloquea filas dentro de una transacción (evita vender el mismo stock dos veces).
  async bloquearPorIds(ids) { throw new Error("No implementado: bloquearPorIds"); }
  async actualizarStock(id, stock) { throw new Error("No implementado: actualizarStock"); }
}

module.exports = ProductoRepository;
