// oxlint-disable no-unused-vars -- los parámetros documentan el contrato que implementa cada adaptador
// Puerto de salida: ejecuta un trabajo dentro de una transacción.
// El trabajo recibe repositorios que comparten la misma transacción.
class UnitOfWork {
  async ejecutar(trabajo) { throw new Error("No implementado: ejecutar"); }
}

module.exports = UnitOfWork;
