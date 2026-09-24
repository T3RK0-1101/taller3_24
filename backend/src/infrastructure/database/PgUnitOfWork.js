const UnitOfWork = require("../../application/ports/UnitOfWork");

// Adaptador de transacciones: BEGIN / COMMIT / ROLLBACK sobre un mismo cliente del pool.
class PgUnitOfWork extends UnitOfWork {
  constructor(pool, crearRepositorios) {
    super();
    this.pool = pool;
    this.crearRepositorios = crearRepositorios;
  }

  async ejecutar(trabajo) {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const resultado = await trabajo(this.crearRepositorios(client));
      await client.query("COMMIT");
      return resultado;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = PgUnitOfWork;
