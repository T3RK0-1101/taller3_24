const jwt = require("jsonwebtoken");
const TokenService = require("../../application/ports/TokenService");
const DomainError = require("../../domain/errors/DomainError");

class JwtTokenService extends TokenService {
  constructor({ secret, expiresIn }) {
    super();
    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  generar(payload) {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  verificar(token) {
    try {
      return jwt.verify(token, this.secret);
    } catch {
      throw DomainError.unauthorized("Token inválido o expirado");
    }
  }
}

module.exports = JwtTokenService;
