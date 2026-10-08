// Puerto de salida: consultas analíticas de solo lectura.
// Cada método recibe los filtros normalizados ({ desde, hasta, ... }) y devuelve datos ya agregados.
class AnalyticsRepositoryPort {
  async productosMasVendidos(_filtros) {
    throw new Error("AnalyticsRepositoryPort.productosMasVendidos no implementado");
  }

  async ingresosPorPeriodo(_filtros) {
    throw new Error("AnalyticsRepositoryPort.ingresosPorPeriodo no implementado");
  }

  async conteoPorEstado(_filtros) {
    throw new Error("AnalyticsRepositoryPort.conteoPorEstado no implementado");
  }

  async resumenVentas(_filtros) {
    throw new Error("AnalyticsRepositoryPort.resumenVentas no implementado");
  }
}

module.exports = AnalyticsRepositoryPort;
