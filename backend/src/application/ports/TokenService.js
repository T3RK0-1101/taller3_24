// oxlint-disable no-unused-vars -- los parámetros documentan el contrato que implementa cada adaptador
// Puerto de salida: emisión y verificación de tokens de autenticación.
class TokenService {
  generar(payload) { throw new Error("No implementado: generar"); }
  verificar(token) { throw new Error("No implementado: verificar"); }
}

module.exports = TokenService;
