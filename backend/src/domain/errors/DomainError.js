// Error de negocio. El tipo se traduce a un código HTTP en la capa de infraestructura.
class DomainError extends Error {
  constructor(message, type, details) {
    super(message);
    this.name = "DomainError";
    this.type = type;
    this.details = details;
  }

  static validation(message, details) {
    return new DomainError(message, "VALIDATION", details);
  }

  static unauthorized(message = "No autenticado") {
    return new DomainError(message, "UNAUTHORIZED");
  }

  static forbidden(message = "No tienes permiso para realizar esta acción") {
    return new DomainError(message, "FORBIDDEN");
  }

  static notFound(message) {
    return new DomainError(message, "NOT_FOUND");
  }

  static conflict(message) {
    return new DomainError(message, "CONFLICT");
  }
}

module.exports = DomainError;
