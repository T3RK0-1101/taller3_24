class UsuarioController {
  constructor({ listarUsuarios, obtenerUsuario, actualizarUsuario, eliminarUsuario }) {
    this.listarUsuarios = listarUsuarios;
    this.obtenerUsuario = obtenerUsuario;
    this.actualizarUsuario = actualizarUsuario;
    this.eliminarUsuario = eliminarUsuario;
  }

  listar = async (req, res) => {
    res.json(await this.listarUsuarios.ejecutar());
  };

  obtener = async (req, res) => {
    res.json(await this.obtenerUsuario.ejecutar(req.params.id));
  };

  actualizar = async (req, res) => {
    const { nombre, email, rol } = req.body;
    res.json(await this.actualizarUsuario.ejecutar(req.params.id, { nombre, email, rol }, req.usuario));
  };

  eliminar = async (req, res) => {
    await this.eliminarUsuario.ejecutar(req.params.id, req.usuario);
    res.status(204).end();
  };
}

module.exports = UsuarioController;
