const DomainError = require("../errors/DomainError");

class Producto {
  constructor({ id = null, nombre, descripcion = "", precio, stock, fechaCreacion = null }) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.stock = stock;
    this.fechaCreacion = fechaCreacion;
  }

  static validarNombre(nombre) {
    const valor = String(nombre ?? "").trim();
    if (valor.length < 2 || valor.length > 150) {
      throw DomainError.validation("El nombre del producto debe tener entre 2 y 150 caracteres");
    }
    return valor;
  }

  static validarDescripcion(descripcion) {
    return String(descripcion ?? "").trim();
  }

  static validarPrecio(precio) {
    const valor = Number(precio);
    if (!Number.isFinite(valor) || valor < 0 || valor > 99999999.99) {
      throw DomainError.validation("El precio debe ser un número mayor o igual a 0");
    }
    return Math.round(valor * 100) / 100;
  }

  static validarStock(stock) {
    const valor = Number(stock);
    if (!Number.isInteger(valor) || valor < 0) {
      throw DomainError.validation("El stock debe ser un número entero mayor o igual a 0");
    }
    return valor;
  }

  static crear({ nombre, descripcion, precio, stock }) {
    return new Producto({
      nombre: Producto.validarNombre(nombre),
      descripcion: Producto.validarDescripcion(descripcion),
      precio: Producto.validarPrecio(precio),
      stock: Producto.validarStock(stock),
    });
  }

  actualizar({ nombre, descripcion, precio, stock }) {
    if (nombre !== undefined) this.nombre = Producto.validarNombre(nombre);
    if (descripcion !== undefined) this.descripcion = Producto.validarDescripcion(descripcion);
    if (precio !== undefined) this.precio = Producto.validarPrecio(precio);
    if (stock !== undefined) this.stock = Producto.validarStock(stock);
  }

  // Regla de negocio: comprobación de stock disponible.
  tieneStock(cantidad) {
    return this.stock >= cantidad;
  }

  descontarStock(cantidad) {
    if (!this.tieneStock(cantidad)) {
      throw DomainError.conflict(
        `Stock insuficiente para "${this.nombre}" (disponible: ${this.stock}, solicitado: ${cantidad})`
      );
    }
    this.stock -= cantidad;
  }

  reponerStock(cantidad) {
    this.stock += cantidad;
  }
}

module.exports = Producto;
