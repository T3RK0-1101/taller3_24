const DomainError = require("../../../domain/errors/DomainError");

class IniciarSesion {
  constructor({ usuarioRepository, passwordHasher, tokenService }) {
    this.usuarioRepository = usuarioRepository;
    this.passwordHasher = passwordHasher;
    this.tokenService = tokenService;
  }

  async ejecutar({ email, password }) {
    const usuario = await this.usuarioRepository.buscarPorEmail(String(email).trim().toLowerCase());
    const valido = usuario && (await this.passwordHasher.comparar(password, usuario.password));

    if (!valido) throw DomainError.unauthorized("Credenciales incorrectas");

    const token = this.tokenService.generar({
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    });

    return { token, usuario: usuario.toPublic() };
  }
}

module.exports = IniciarSesion;
