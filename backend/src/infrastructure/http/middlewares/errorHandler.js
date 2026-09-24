const DomainError = require("../../../domain/errors/DomainError");

const STATUS = {
  VALIDATION: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
};

const notFound = (req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ error: "El cuerpo de la petición no es un JSON válido" });
  }

  if (error instanceof DomainError) {
    return res.status(STATUS[error.type] ?? 400).json({
      error: error.message,
      ...(error.details && { detalles: error.details }),
    });
  }

  console.error(error);
  res.status(500).json({ error: "Error interno del servidor" });
};

module.exports = { notFound, errorHandler };
