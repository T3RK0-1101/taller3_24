const DomainError = require("../../domain/errors/DomainError");

// Convierte errores técnicos de PostgreSQL en errores de negocio.
function traducirErrorPg(error) {
  switch (error.code) {
    case "23505":
      return DomainError.conflict(
        error.constraint === "uq_usuarios_email"
          ? "El email ya está registrado"
          : "Ya existe un registro con esos datos"
      );
    case "23503":
      return DomainError.conflict(
        "El registro está relacionado con otros datos (por ejemplo, pedidos) y no puede eliminarse"
      );
    case "23514":
      return DomainError.validation("Los datos no cumplen las restricciones de la base de datos");
    case "22P02":
    case "22003":
      return DomainError.validation("Formato de dato inválido");
    default:
      return error;
  }
}

module.exports = traducirErrorPg;
