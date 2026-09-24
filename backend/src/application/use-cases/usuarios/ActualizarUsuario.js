const DomainError = require("../../../domain/errors/DomainError");

class ActualizarUsuario {
  constructor({ usuarioRepository }) {
    this.usuarioRepository = usuarioRepository;
  }

  async ejecutar(id, datos, solicitante) {
    const usuario = await this.usuarioRepository.buscarPorId(id);
    if (!usuario) throw DomainError.notFound("Usuario no encontrado");

    if (usuario.id === solicitante.id && datos.rol !== undefined && datos.rol !== usuario.rol) {
      throw DomainError.conflict("No puedes cambiar tu propio rol");
    }

    const emailAnterior = usuario.email;
    usuario.actualizar(datos);

    if (usuario.email !== emailAnterior) {
      const existente = await this.usuarioRepository.buscarPorEmail(usuario.email);
      if (existente) throw DomainError.conflict("El email ya está registrado");
    }

    const actualizado = await this.usuarioRepository.actualizar(usuario);
    return actualizado.toPublic();
  }
}

module.exports = ActualizarUsuario;
