const Pedido = require("../../../domain/entities/Pedido");
const { normalizarFiltros } = require("./FiltrosReporte");

const redondear = (n) => Math.round((Number(n) || 0) * 100) / 100;
const rango = (f) => ({ desde: f.desde, hasta: f.hasta });

// Servicio de entrada del subsistema analítico: orquesta las consultas y deriva
// porcentajes y promedios a partir de agregados ya calculados por la base de datos.
class AnalyticsService {
  constructor({ analyticsRepository, zonaHoraria }) {
    this.analyticsRepository = analyticsRepository;
    this.zonaHoraria = zonaHoraria;
  }

  async productosMasVendidos(consulta) {
    const f = normalizarFiltros(consulta, this.zonaHoraria);
    return { rango: rango(f), limite: f.limite, productos: await this.#productos(f) };
  }

  async ingresos(consulta) {
    const f = normalizarFiltros(consulta, this.zonaHoraria);
    return { rango: rango(f), agrupacion: f.agrupacion, ...(await this.#ingresos(f)) };
  }

  async estadosPedidos(consulta) {
    const f = normalizarFiltros(consulta, this.zonaHoraria);
    return { rango: rango(f), ...(await this.#estados(f)) };
  }

  async ticketPromedio(consulta) {
    const f = normalizarFiltros(consulta, this.zonaHoraria);
    return { rango: rango(f), ...(await this.#ticket(f)) };
  }

  // Todas las métricas en una sola respuesta (las consultas se ejecutan en paralelo).
  async resumen(consulta) {
    const f = normalizarFiltros(consulta, this.zonaHoraria);
    const [productos, ingresos, estados, ticket] = await Promise.all([
      this.#productos(f),
      this.#ingresos(f),
      this.#estados(f),
      this.#ticket(f),
    ]);
    return { rango: rango(f), agrupacion: f.agrupacion, limite: f.limite, productos, ingresos, estados, ticket };
  }

  async #productos(f) {
    const filas = await this.analyticsRepository.productosMasVendidos(f);
    return filas.map((p, i) => ({ posicion: i + 1, ...p, monto: redondear(p.monto) }));
  }

  async #ingresos(f) {
    const filas = await this.analyticsRepository.ingresosPorPeriodo(f);
    const serie = filas.map((s) => ({ ...s, ingresos: redondear(s.ingresos) }));
    return {
      total: redondear(serie.reduce((suma, s) => suma + s.ingresos, 0)),
      pedidos: serie.reduce((suma, s) => suma + s.pedidos, 0),
      serie,
    };
  }

  async #estados(f) {
    const filas = await this.analyticsRepository.conteoPorEstado(f);
    const total = filas.reduce((suma, r) => suma + r.pedidos, 0);
    const porEstado = new Map(filas.map((r) => [r.estado, r]));

    const estados = Pedido.ESTADOS.map((estado) => {
      const pedidos = porEstado.get(estado)?.pedidos ?? 0;
      return {
        estado,
        pedidos,
        porcentaje: total ? Math.round((pedidos / total) * 1000) / 10 : 0,
        monto: redondear(porEstado.get(estado)?.monto),
      };
    });
    return { total, estados };
  }

  async #ticket(f) {
    const { pedidos, clientes, ingresos } = await this.analyticsRepository.resumenVentas(f);
    return {
      pedidos,
      clientes,
      ingresos: redondear(ingresos),
      ticketPorPedido: redondear(pedidos ? ingresos / pedidos : 0),
      ticketPorUsuario: redondear(clientes ? ingresos / clientes : 0),
    };
  }
}

module.exports = AnalyticsService;
