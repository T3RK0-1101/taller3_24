const DomainError = require("../../../domain/errors/DomainError");

// Valida el token y obtiene el usuario actualizado desde la base de datos.
// Así, los cambios de rol o de estado aplican de inmediato, sin volver a iniciar sesión.
class VerificarSesion {
  constructor({ tokenService, usuarioRepository }) {
    this.tokenService = tokenService;
    this.usuarioRepository = usuarioRepository;
  }

  async ejecutar(token) {
    const payload = this.tokenService.verificar(token);
    const usuario = await this.usuarioRepository.buscarPorId(payload.id);
    if (!usuario) throw DomainError.unauthorized("La sesión ya no es válida");
    return usuario.toPublic();
  }
}

module.exports = VerificarSesion;
