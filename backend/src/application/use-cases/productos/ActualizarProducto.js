const DomainError = require("../../../domain/errors/DomainError");

class ActualizarProducto {
  constructor({ productoRepository }) {
    this.productoRepository = productoRepository;
  }

  async ejecutar(id, datos) {
    const producto = await this.productoRepository.buscarPorId(id);
    if (!producto) throw DomainError.notFound("Producto no encontrado");

    producto.actualizar(datos);
    return this.productoRepository.actualizar(producto);
  }
}

module.exports = ActualizarProducto;
