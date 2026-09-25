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
    estado: fila.estado,
    fechaCreacion: fila.fecha_creacion,
  });

class PgUsuarioRepository extends UsuarioRepository {
  constructor(db) {
    super();
    this.pg = new PgRepository(db);
  }

  async crear(usuario) {
    const { rows } = await this.pg.query(
      `INSERT INTO usuarios (nombre, email, password, rol, estado)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [usuario.nombre, usuario.email, usuario.password, usuario.rol, usuario.estado]
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

  // Los pendientes aparecen primero para que el administrador los atienda.
  async listar() {
    const { rows } = await this.pg.query(
      `SELECT * FROM usuarios
       ORDER BY CASE estado WHEN 'pendiente' THEN 0 WHEN 'activo' THEN 1 ELSE 2 END, id`
    );
    return rows.map(aEntidad);
  }

  async actualizar(usuario) {
    const { rows } = await this.pg.query(
      `UPDATE usuarios SET nombre = $1, email = $2, rol = $3, estado = $4
       WHERE id = $5 RETURNING *`,
      [usuario.nombre, usuario.email, usuario.rol, usuario.estado, usuario.id]
    );
    return aEntidad(rows[0]);
  }

  async eliminar(id) {
    const { rowCount } = await this.pg.query("DELETE FROM usuarios WHERE id = $1", [id]);
    return rowCount > 0;
  }
}

module.exports = PgUsuarioRepository;
