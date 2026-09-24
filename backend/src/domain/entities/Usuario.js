const DomainError = require("../errors/DomainError");

const ROLES = ["cliente", "admin"];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class Usuario {
  constructor({ id = null, nombre, email, password = null, rol = "cliente", fechaCreacion = null }) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.password = password;
    this.rol = rol;
    this.fechaCreacion = fechaCreacion;
  }

  static validarNombre(nombre) {
    const valor = String(nombre ?? "").trim();
    if (valor.length < 2 || valor.length > 100) {
      throw DomainError.validation("El nombre debe tener entre 2 y 100 caracteres");
    }
    return valor;
  }

  static validarEmail(email) {
    const valor = String(email ?? "").trim().toLowerCase();
    if (!EMAIL_REGEX.test(valor) || valor.length > 150) {
      throw DomainError.validation("El email no tiene un formato válido");
    }
    return valor;
  }

  // Regla de negocio: mínimo 8 caracteres, al menos una letra y un número.
  static validarPassword(password) {
    const valida =
      typeof password === "string" &&
      password.length >= 8 &&
      password.length <= 72 &&
      /[A-Za-z]/.test(password) &&
      /\d/.test(password);

    if (!valida) {
      throw DomainError.validation(
        "La contraseña debe tener entre 8 y 72 caracteres e incluir letras y números"
      );
    }
  }

  static validarRol(rol) {
    if (!ROLES.includes(rol)) {
      throw DomainError.validation(`El rol debe ser uno de: ${ROLES.join(", ")}`);
    }
    return rol;
  }

  static crear({ nombre, email, passwordHash, rol = "cliente" }) {
    return new Usuario({
      nombre: Usuario.validarNombre(nombre),
      email: Usuario.validarEmail(email),
      password: passwordHash,
      rol: Usuario.validarRol(rol),
    });
  }

  actualizar({ nombre, email, rol }) {
    if (nombre !== undefined) this.nombre = Usuario.validarNombre(nombre);
    if (email !== undefined) this.email = Usuario.validarEmail(email);
    if (rol !== undefined) this.rol = Usuario.validarRol(rol);
  }

  esAdmin() {
    return this.rol === "admin";
  }

  // Representación segura: nunca expone la contraseña.
  toPublic() {
    return {
      id: this.id,
      nombre: this.nombre,
      email: this.email,
      rol: this.rol,
      fechaCreacion: this.fechaCreacion,
    };
  }
}

Usuario.ROLES = ROLES;

module.exports = Usuario;
