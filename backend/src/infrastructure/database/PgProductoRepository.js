const PgRepository = require("./PgRepository");
const ProductoRepository = require("../../application/ports/ProductoRepository");
const Producto = require("../../domain/entities/Producto");

const aEntidad = (fila) =>
  fila &&
  new Producto({
    id: fila.id,
    nombre: fila.nombre,
    descripcion: fila.descripcion,
    precio: Number(fila.precio),
    stock: fila.stock,
    fechaCreacion: fila.fecha_creacion,
  });

class PgProductoRepository extends ProductoRepository {
  constructor(db) {
    super();
    this.pg = new PgRepository(db);
  }

  async crear(producto) {
    const { rows } = await this.pg.query(
      `INSERT INTO productos (nombre, descripcion, precio, stock)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [producto.nombre, producto.descripcion, producto.precio, producto.stock]
    );
    return aEntidad(rows[0]);
  }

  async buscarPorId(id) {
    const { rows } = await this.pg.query("SELECT * FROM productos WHERE id = $1", [id]);
    return aEntidad(rows[0]);
  }

  async listar({ busqueda = "" } = {}) {
    const { rows } = await this.pg.query(
      `SELECT * FROM productos
       WHERE $1 = '' OR LOWER(nombre) LIKE '%' || LOWER($1) || '%'
       ORDER BY id`,
      [busqueda]
    );
    return rows.map(aEntidad);
  }

  async actualizar(producto) {
    const { rows } = await this.pg.query(
      `UPDATE productos SET nombre = $1, descripcion = $2, precio = $3, stock = $4
       WHERE id = $5 RETURNING *`,
      [producto.nombre, producto.descripcion, producto.precio, producto.stock, producto.id]
    );
    return aEntidad(rows[0]);
  }

  async eliminar(id) {
    const { rowCount } = await this.pg.query("DELETE FROM productos WHERE id = $1", [id]);
    return rowCount > 0;
  }

  async bloquearPorIds(ids) {
    const { rows } = await this.pg.query(
      "SELECT * FROM productos WHERE id = ANY($1::int[]) ORDER BY id FOR UPDATE",
      [ids]
    );
    return rows.map(aEntidad);
  }

  async actualizarStock(id, stock) {
    await this.pg.query("UPDATE productos SET stock = $1 WHERE id = $2", [stock, id]);
  }
}

module.exports = PgProductoRepository;
