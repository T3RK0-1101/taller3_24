const Usuario = require("../../../domain/entities/Usuario");
const DomainError = require("../../../domain/errors/DomainError");

class RegistrarUsuario {
  constructor({ usuarioRepository, passwordHasher }) {
    this.usuarioRepository = usuarioRepository;
    this.passwordHasher = passwordHasher;
  }

  async ejecutar({ nombre, email, password }) {
    Usuario.validarPassword(password);
    const emailNormalizado = Usuario.validarEmail(email);

    if (await this.usuarioRepository.buscarPorEmail(emailNormalizado)) {
      throw DomainError.conflict("El email ya está registrado");
    }

    const passwordHash = await this.passwordHasher.hash(password);
    const usuario = Usuario.crear({ nombre, email: emailNormalizado, passwordHash });
    const creado = await this.usuarioRepository.crear(usuario);

    return creado.toPublic();
  }
}

module.exports = RegistrarUsuario;
