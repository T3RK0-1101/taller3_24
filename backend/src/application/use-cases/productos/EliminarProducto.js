const DomainError = require("../../../domain/errors/DomainError");

class EliminarProducto {
  constructor({ productoRepository }) {
    this.productoRepository = productoRepository;
  }

  async ejecutar(id) {
    const eliminado = await this.productoRepository.eliminar(id);
    if (!eliminado) throw DomainError.notFound("Producto no encontrado");
  }
}

module.exports = EliminarProducto;
