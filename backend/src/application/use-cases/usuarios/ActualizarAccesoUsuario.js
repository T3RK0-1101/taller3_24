const DomainError = require("../../../domain/errors/DomainError");

// El administrador aprueba, desactiva o reactiva cuentas y decide su rol.
class ActualizarAccesoUsuario {
  constructor({ usuarioRepository }) {
    this.usuarioRepository = usuarioRepository;
  }

  async ejecutar(id, { rol, estado }, solicitante) {
    if (id === solicitante.id) {
      throw DomainError.conflict("No puedes modificar el acceso de tu propia cuenta");
    }

    const usuario = await this.usuarioRepository.buscarPorId(id);
    if (!usuario) throw DomainError.notFound("Usuario no encontrado");

    usuario.cambiarAcceso({ rol, estado });
    const actualizado = await this.usuarioRepository.actualizar(usuario);
    return actualizado.toPublic();
  }
}

module.exports = ActualizarAccesoUsuario;
