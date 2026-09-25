const DomainError = require("../../../domain/errors/DomainError");

// Verifica el token JWT del encabezado Authorization: Bearer <token>
// y carga el usuario actualizado (rol y estado) desde la base de datos.
const crearAuthenticate = (verificarSesion) => async (req, res, next) => {
  const [tipo, token] = (req.headers.authorization ?? "").split(" ");
  if (tipo !== "Bearer" || !token) throw DomainError.unauthorized("Se requiere un token de acceso");

  req.usuario = await verificarSesion.ejecutar(token);
  next();
};

module.exports = crearAuthenticate;
