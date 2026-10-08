class ReporteController {
  constructor({ analyticsService }) {
    this.analyticsService = analyticsService;
  }

  resumen = async (req, res) => {
    res.json(await this.analyticsService.resumen(req.query));
  };

  productos = async (req, res) => {
    res.json(await this.analyticsService.productosMasVendidos(req.query));
  };

  ingresos = async (req, res) => {
    res.json(await this.analyticsService.ingresos(req.query));
  };

  estados = async (req, res) => {
    res.json(await this.analyticsService.estadosPedidos(req.query));
  };

  ticket = async (req, res) => {
    res.json(await this.analyticsService.ticketPromedio(req.query));
  };
}

module.exports = ReporteController;
