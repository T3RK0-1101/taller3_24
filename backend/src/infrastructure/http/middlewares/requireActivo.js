const DomainError = require("../../../domain/errors/DomainError");

const MENSAJES = {
  pendiente: "Tu cuenta está pendiente de aprobación por un administrador",
  inactivo: "Tu cuenta fue desactivada. Contacta a un administrador",
};

// Solo las cuentas activas pueden operar. Debe usarse después de authenticate.
const requireActivo = (req, res, next) => {
  if (req.usuario.estado !== "activo") throw DomainError.forbidden(MENSAJES[req.usuario.estado]);
  next();
};

module.exports = requireActivo;
