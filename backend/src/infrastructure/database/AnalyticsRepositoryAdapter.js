const PgRepository = require("./PgRepository");
const AnalyticsRepositoryPort = require("../../application/ports/AnalyticsRepositoryPort");

// Un pedido cuenta como venta cuando ya fue pagado o enviado.
const VENDIDO = "p.estado IN ('pagado', 'enviado')";
// Parámetros comunes: $1 = desde, $2 = hasta (inclusive), $3 = zona horaria.
const RANGO = `p.fecha_creacion >= (($1::date)::timestamp AT TIME ZONE $3::text)
  AND p.fecha_creacion < ((($2::date + 1))::timestamp AT TIME ZONE $3::text)`;

const num = (valor) => Number(valor) || 0;

// Adaptador de salida: implementa AnalyticsRepositoryPort con consultas agregadas en PostgreSQL.
class AnalyticsRepositoryAdapter extends AnalyticsRepositoryPort {
  constructor(db) {
    super();
    this.pg = new PgRepository(db);
  }

  async productosMasVendidos({ desde, hasta, zonaHoraria, limite }) {
    const { rows } = await this.pg.query(
      `SELECT pr.id AS producto_id, pr.nombre,
              SUM(d.cantidad)::int AS unidades,
              SUM(d.cantidad * d.precio_unitario) AS monto
       FROM detalle_pedidos d
       JOIN pedidos p ON p.id = d.pedido_id
       JOIN productos pr ON pr.id = d.producto_id
       WHERE ${VENDIDO} AND ${RANGO}
       GROUP BY pr.id, pr.nombre
       ORDER BY unidades DESC, monto DESC
       LIMIT $4`,
      [desde, hasta, zonaHoraria, limite]
    );
    return rows.map((r) => ({
      productoId: r.producto_id,
      nombre: r.nombre,
      unidades: r.unidades,
      monto: num(r.monto),
    }));
  }

  async ingresosPorPeriodo({ desde, hasta, zonaHoraria, unidad }) {
    const { rows } = await this.pg.query(
      `WITH serie AS (
         SELECT generate_series(
                  DATE_TRUNC($4::text, $1::date::timestamp),
                  DATE_TRUNC($4::text, $2::date::timestamp),
                  ('1 ' || $4::text)::interval) AS periodo
       ), ventas AS (
         SELECT DATE_TRUNC($4::text, p.fecha_creacion AT TIME ZONE $3::text) AS periodo,
                SUM(p.total) AS ingresos, COUNT(*)::int AS pedidos
         FROM pedidos p
         WHERE ${VENDIDO} AND ${RANGO}
         GROUP BY 1
       )
       SELECT TO_CHAR(s.periodo, 'YYYY-MM-DD') AS periodo,
              COALESCE(v.ingresos, 0) AS ingresos,
              COALESCE(v.pedidos, 0) AS pedidos
       FROM serie s
       LEFT JOIN ventas v ON v.periodo = s.periodo
       ORDER BY s.periodo`,
      [desde, hasta, zonaHoraria, unidad]
    );
    return rows.map((r) => ({ periodo: r.periodo, ingresos: num(r.ingresos), pedidos: num(r.pedidos) }));
  }

  async conteoPorEstado({ desde, hasta, zonaHoraria }) {
    const { rows } = await this.pg.query(
      `SELECT p.estado, COUNT(*)::int AS pedidos, COALESCE(SUM(p.total), 0) AS monto
       FROM pedidos p
       WHERE ${RANGO}
       GROUP BY p.estado`,
      [desde, hasta, zonaHoraria]
    );
    return rows.map((r) => ({ estado: r.estado, pedidos: r.pedidos, monto: num(r.monto) }));
  }

  async resumenVentas({ desde, hasta, zonaHoraria }) {
    const { rows } = await this.pg.query(
      `SELECT COUNT(*)::int AS pedidos,
              COUNT(DISTINCT p.usuario_id)::int AS clientes,
              COALESCE(SUM(p.total), 0) AS ingresos
       FROM pedidos p
       WHERE ${VENDIDO} AND ${RANGO}`,
      [desde, hasta, zonaHoraria]
    );
    const r = rows[0];
    return { pedidos: r.pedidos, clientes: r.clientes, ingresos: num(r.ingresos) };
  }
}

module.exports = AnalyticsRepositoryAdapter;
