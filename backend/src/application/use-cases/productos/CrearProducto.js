const Producto = require("../../../domain/entities/Producto");

class CrearProducto {
  constructor({ productoRepository }) {
    this.productoRepository = productoRepository;
  }

  async ejecutar(datos) {
    return this.productoRepository.crear(Producto.crear(datos));
  }
}

module.exports = CrearProducto;
