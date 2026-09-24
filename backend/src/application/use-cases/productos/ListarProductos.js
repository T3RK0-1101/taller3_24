class ListarProductos {
  constructor({ productoRepository }) {
    this.productoRepository = productoRepository;
  }

  async ejecutar({ busqueda = "" } = {}) {
    return this.productoRepository.listar({ busqueda: String(busqueda).trim() });
  }
}

module.exports = ListarProductos;
