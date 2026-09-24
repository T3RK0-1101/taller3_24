// oxlint-disable no-unused-vars -- los parámetros documentan el contrato que implementa cada adaptador
// Puerto de salida: persistencia de usuarios.
class UsuarioRepository {
  async crear(usuario) { throw new Error("No implementado: crear"); }
  async buscarPorId(id) { throw new Error("No implementado: buscarPorId"); }
  async buscarPorEmail(email) { throw new Error("No implementado: buscarPorEmail"); }
  async listar() { throw new Error("No implementado: listar"); }
  async actualizar(usuario) { throw new Error("No implementado: actualizar"); }
  async eliminar(id) { throw new Error("No implementado: eliminar"); }
}

module.exports = UsuarioRepository;
