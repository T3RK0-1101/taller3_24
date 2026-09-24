class AuthController {
  constructor({ registrarUsuario, iniciarSesion, obtenerUsuario }) {
    this.registrarUsuario = registrarUsuario;
    this.iniciarSesion = iniciarSesion;
    this.obtenerUsuario = obtenerUsuario;
  }

  registrar = async (req, res) => {
    const { nombre, email, password } = req.body;
    res.status(201).json(await this.registrarUsuario.ejecutar({ nombre, email, password }));
  };

  login = async (req, res) => {
    const { email, password } = req.body;
    res.json(await this.iniciarSesion.ejecutar({ email, password }));
  };

  perfil = async (req, res) => {
    res.json(await this.obtenerUsuario.ejecutar(req.usuario.id));
  };
}

module.exports = AuthController;
