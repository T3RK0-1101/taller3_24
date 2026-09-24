const DomainError = require("../../../domain/errors/DomainError");

class ObtenerProducto {
  constructor({ productoRepository }) {
    this.productoRepository = productoRepository;
  }

  async ejecutar(id) {
    const producto = await this.productoRepository.buscarPorId(id);
    if (!producto) throw DomainError.notFound("Producto no encontrado");
    return producto;
  }
}

module.exports = ObtenerProducto;
