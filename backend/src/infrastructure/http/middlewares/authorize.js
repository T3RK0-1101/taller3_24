const DomainError = require("../../../domain/errors/DomainError");

// Restringe una ruta a ciertos roles. Debe usarse después de authenticate.
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.usuario?.rol)) throw DomainError.forbidden();
  next();
};

module.exports = authorize;
