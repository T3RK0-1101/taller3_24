class ProductoController {
  constructor({ listarProductos, obtenerProducto, crearProducto, actualizarProducto, eliminarProducto }) {
    this.listarProductos = listarProductos;
    this.obtenerProducto = obtenerProducto;
    this.crearProducto = crearProducto;
    this.actualizarProducto = actualizarProducto;
    this.eliminarProducto = eliminarProducto;
  }

  listar = async (req, res) => {
    res.json(await this.listarProductos.ejecutar({ busqueda: req.query.q ?? "" }));
  };

  obtener = async (req, res) => {
    res.json(await this.obtenerProducto.ejecutar(req.params.id));
  };

  crear = async (req, res) => {
    const { nombre, descripcion, precio, stock } = req.body;
    res.status(201).json(await this.crearProducto.ejecutar({ nombre, descripcion, precio, stock }));
  };

  actualizar = async (req, res) => {
    const { nombre, descripcion, precio, stock } = req.body;
    res.json(await this.actualizarProducto.ejecutar(req.params.id, { nombre, descripcion, precio, stock }));
  };

  eliminar = async (req, res) => {
    await this.eliminarProducto.ejecutar(req.params.id);
    res.status(204).end();
  };
}

module.exports = ProductoController;
