const DomainError = require("../errors/DomainError");

const ROLES = ["cliente", "admin"];
const ESTADOS = ["pendiente", "activo", "inactivo"];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class Usuario {
  constructor({ id = null, nombre, email, password = null, rol = "cliente", estado = "pendiente", fechaCreacion = null }) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.password = password;
    this.rol = rol;
    this.estado = estado;
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

  static validarEstado(estado) {
    if (!ESTADOS.includes(estado)) {
      throw DomainError.validation(`El estado debe ser uno de: ${ESTADOS.join(", ")}`);
    }
    return estado;
  }

  // Regla de negocio: toda cuenta nueva queda pendiente hasta que un administrador la apruebe.
  static crear({ nombre, email, passwordHash }) {
    return new Usuario({
      nombre: Usuario.validarNombre(nombre),
      email: Usuario.validarEmail(email),
      password: passwordHash,
      rol: "cliente",
      estado: "pendiente",
    });
  }

  actualizar({ nombre, email, rol }) {
    if (nombre !== undefined) this.nombre = Usuario.validarNombre(nombre);
    if (email !== undefined) this.email = Usuario.validarEmail(email);
    if (rol !== undefined) this.rol = Usuario.validarRol(rol);
  }

  // Regla de negocio: una cuenta no puede regresar a "pendiente" una vez revisada.
  cambiarAcceso({ rol, estado }) {
    if (rol !== undefined) this.rol = Usuario.validarRol(rol);
    if (estado !== undefined) {
      Usuario.validarEstado(estado);
      if (estado === "pendiente" && this.estado !== "pendiente") {
        throw DomainError.conflict("Una cuenta ya revisada no puede volver a quedar pendiente");
      }
      this.estado = estado;
    }
  }

  esAdmin() {
    return this.rol === "admin";
  }

  estaActivo() {
    return this.estado === "activo";
  }

  // Representación segura: nunca expone la contraseña.
  toPublic() {
    return {
      id: this.id,
      nombre: this.nombre,
      email: this.email,
      rol: this.rol,
      estado: this.estado,
      fechaCreacion: this.fechaCreacion,
    };
  }
}

Usuario.ROLES = ROLES;
Usuario.ESTADOS = ESTADOS;

module.exports = Usuario;
