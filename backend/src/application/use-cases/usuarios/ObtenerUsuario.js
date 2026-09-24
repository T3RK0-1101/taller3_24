const DomainError = require("../../../domain/errors/DomainError");

class ObtenerUsuario {
  constructor({ usuarioRepository }) {
    this.usuarioRepository = usuarioRepository;
  }

  async ejecutar(id) {
    const usuario = await this.usuarioRepository.buscarPorId(id);
    if (!usuario) throw DomainError.notFound("Usuario no encontrado");
    return usuario.toPublic();
  }
}

module.exports = ObtenerUsuario;
