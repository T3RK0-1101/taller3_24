const PgRepository = require("./PgRepository");
const PedidoRepository = require("../../application/ports/PedidoRepository");
const Pedido = require("../../domain/entities/Pedido");

const SELECT_PEDIDO = `
  SELECT p.*, u.nombre AS cliente_nombre, u.email AS cliente_email
  FROM pedidos p
  JOIN usuarios u ON u.id = p.usuario_id`;

const aDetalle = (fila) => ({
  productoId: fila.producto_id,
  nombreProducto: fila.nombre_producto,
  cantidad: fila.cantidad,
  precioUnitario: Number(fila.precio_unitario),
  subtotal: Number(fila.subtotal),
});

const aEntidad = (fila, detalles = []) =>
  new Pedido({
    id: fila.id,
    usuarioId: fila.usuario_id,
    total: Number(fila.total),
    estado: fila.estado,
    fechaCreacion: fila.fecha_creacion,
    cliente: { nombre: fila.cliente_nombre, email: fila.cliente_email },
    detalles,
  });

class PgPedidoRepository extends PedidoRepository {
  constructor(db) {
    super();
    this.pg = new PgRepository(db);
  }

  async crear(pedido) {
    const { rows } = await this.pg.query(
      "INSERT INTO pedidos (usuario_id, total, estado) VALUES ($1, $2, $3) RETURNING id",
      [pedido.usuarioId, pedido.total, pedido.estado]
    );
    const pedidoId = rows[0].id;

    for (const d of pedido.detalles) {
      await this.pg.query(
        `INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario)
         VALUES ($1, $2, $3, $4)`,
        [pedidoId, d.productoId, d.cantidad, d.precioUnitario]
      );
    }

    return this.buscarPorId(pedidoId);
  }

  async buscarPorId(id, { bloquear = false } = {}) {
    const { rows } = await this.pg.query(
      `${SELECT_PEDIDO} WHERE p.id = $1 ${bloquear ? "FOR UPDATE OF p" : ""}`,
      [id]
    );
    if (!rows[0]) return null;

    const detalles = await this.detallesDe([id]);
    return aEntidad(rows[0], detalles.get(id) ?? []);
  }

  async listar({ usuarioId } = {}) {
    const { rows } = usuarioId
      ? await this.pg.query(`${SELECT_PEDIDO} WHERE p.usuario_id = $1 ORDER BY p.fecha_creacion DESC`, [usuarioId])
      : await this.pg.query(`${SELECT_PEDIDO} ORDER BY p.fecha_creacion DESC`);

    const detalles = await this.detallesDe(rows.map((r) => r.id));
    return rows.map((fila) => aEntidad(fila, detalles.get(fila.id) ?? []));
  }

  async actualizarEstado(id, estado) {
    await this.pg.query("UPDATE pedidos SET estado = $1 WHERE id = $2", [estado, id]);
  }

  async eliminar(id) {
    const { rowCount } = await this.pg.query("DELETE FROM pedidos WHERE id = $1", [id]);
    return rowCount > 0;
  }

  // Obtiene el detalle de varios pedidos en una sola consulta.
  async detallesDe(pedidoIds) {
    const mapa = new Map();
    if (pedidoIds.length === 0) return mapa;

    const { rows } = await this.pg.query(
      `SELECT d.pedido_id, d.producto_id, d.cantidad, d.precio_unitario,
              d.cantidad * d.precio_unitario AS subtotal,
              pr.nombre AS nombre_producto
       FROM detalle_pedidos d
       JOIN productos pr ON pr.id = d.producto_id
       WHERE d.pedido_id = ANY($1::int[])
       ORDER BY d.id`,
      [pedidoIds]
    );

    for (const fila of rows) {
      if (!mapa.has(fila.pedido_id)) mapa.set(fila.pedido_id, []);
      mapa.get(fila.pedido_id).push(aDetalle(fila));
    }
    return mapa;
  }
}

module.exports = PgPedidoRepository;
