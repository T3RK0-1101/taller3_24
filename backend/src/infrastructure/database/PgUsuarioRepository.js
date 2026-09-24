const PgRepository = require("./PgRepository");
const UsuarioRepository = require("../../application/ports/UsuarioRepository");
const Usuario = require("../../domain/entities/Usuario");

const aEntidad = (fila) =>
  fila &&
  new Usuario({
    id: fila.id,
    nombre: fila.nombre,
    email: fila.email,
    password: fila.password,
    rol: fila.rol,
    fechaCreacion: fila.fecha_creacion,
  });

class PgUsuarioRepository extends UsuarioRepository {
  constructor(db) {
    super();
    this.pg = new PgRepository(db);
  }

  async crear(usuario) {
    const { rows } = await this.pg.query(
      `INSERT INTO usuarios (nombre, email, password, rol)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [usuario.nombre, usuario.email, usuario.password, usuario.rol]
    );
    return aEntidad(rows[0]);
  }

  async buscarPorId(id) {
    const { rows } = await this.pg.query("SELECT * FROM usuarios WHERE id = $1", [id]);
    return aEntidad(rows[0]);
  }

  async buscarPorEmail(email) {
    const { rows } = await this.pg.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    return aEntidad(rows[0]);
  }

  async listar() {
    const { rows } = await this.pg.query("SELECT * FROM usuarios ORDER BY id");
    return rows.map(aEntidad);
  }

  async actualizar(usuario) {
    const { rows } = await this.pg.query(
      `UPDATE usuarios SET nombre = $1, email = $2, rol = $3
       WHERE id = $4 RETURNING *`,
      [usuario.nombre, usuario.email, usuario.rol, usuario.id]
    );
    return aEntidad(rows[0]);
  }

  async eliminar(id) {
    const { rowCount } = await this.pg.query("DELETE FROM usuarios WHERE id = $1", [id]);
    return rowCount > 0;
  }
}

module.exports = PgUsuarioRepository;
