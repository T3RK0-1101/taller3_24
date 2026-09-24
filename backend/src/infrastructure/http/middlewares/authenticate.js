const DomainError = require("../../../domain/errors/DomainError");

// Verifica el token JWT del encabezado Authorization: Bearer <token>.
const crearAuthenticate = (tokenService) => (req, res, next) => {
  const [tipo, token] = (req.headers.authorization ?? "").split(" ");
  if (tipo !== "Bearer" || !token) throw DomainError.unauthorized("Se requiere un token de acceso");

  const payload = tokenService.verificar(token);
  req.usuario = { id: payload.id, email: payload.email, rol: payload.rol };
  next();
};

module.exports = crearAuthenticate;
