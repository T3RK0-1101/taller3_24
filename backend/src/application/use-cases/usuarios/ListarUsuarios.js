class ListarUsuarios {
  constructor({ usuarioRepository }) {
    this.usuarioRepository = usuarioRepository;
  }

  async ejecutar() {
    const usuarios = await this.usuarioRepository.listar();
    return usuarios.map((u) => u.toPublic());
  }
}

module.exports = ListarUsuarios;
