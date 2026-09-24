const DomainError = require("../../../domain/errors/DomainError");

class EliminarUsuario {
  constructor({ usuarioRepository }) {
    this.usuarioRepository = usuarioRepository;
  }

  async ejecutar(id, solicitante) {
    if (id === solicitante.id) throw DomainError.conflict("No puedes eliminar tu propia cuenta");

    const eliminado = await this.usuarioRepository.eliminar(id);
    if (!eliminado) throw DomainError.notFound("Usuario no encontrado");
  }
}

module.exports = EliminarUsuario;
