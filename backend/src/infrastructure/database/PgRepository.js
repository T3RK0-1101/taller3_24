const traducirErrorPg = require("./traducirErrorPg");

// Base común: "db" puede ser el Pool (consultas sueltas) o un Client (dentro de una transacción).
class PgRepository {
  constructor(db) {
    this.db = db;
  }

  async query(sql, params = []) {
    try {
      return await this.db.query(sql, params);
    } catch (error) {
      throw traducirErrorPg(error);
    }
  }
}

module.exports = PgRepository;
