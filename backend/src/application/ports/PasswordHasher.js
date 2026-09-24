// oxlint-disable no-unused-vars -- los parámetros documentan el contrato que implementa cada adaptador
// Puerto de salida: cifrado de contraseñas.
class PasswordHasher {
  async hash(password) { throw new Error("No implementado: hash"); }
  async comparar(password, hash) { throw new Error("No implementado: comparar"); }
}

module.exports = PasswordHasher;
