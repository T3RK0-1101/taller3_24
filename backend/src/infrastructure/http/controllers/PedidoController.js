class PedidoController {
  constructor({ crearPedido, listarPedidos, obtenerPedido, actualizarEstadoPedido, eliminarPedido }) {
    this.crearPedido = crearPedido;
    this.listarPedidos = listarPedidos;
    this.obtenerPedido = obtenerPedido;
    this.actualizarEstadoPedido = actualizarEstadoPedido;
    this.eliminarPedido = eliminarPedido;
  }

  crear = async (req, res) => {
    const pedido = await this.crearPedido.ejecutar({ usuarioId: req.usuario.id, items: req.body.items });
    res.status(201).json(pedido);
  };

  listar = async (req, res) => {
    res.json(await this.listarPedidos.ejecutar(req.usuario));
  };

  obtener = async (req, res) => {
    res.json(await this.obtenerPedido.ejecutar(req.params.id, req.usuario));
  };

  cambiarEstado = async (req, res) => {
    res.json(await this.actualizarEstadoPedido.ejecutar(req.params.id, req.body.estado, req.usuario));
  };

  eliminar = async (req, res) => {
    await this.eliminarPedido.ejecutar(req.params.id);
    res.status(204).end();
  };
}

module.exports = PedidoController;
