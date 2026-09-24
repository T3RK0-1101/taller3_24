const DomainError = require("../errors/DomainError");

const ESTADOS = ["pendiente", "completado", "cancelado"];
const TRANSICIONES = {
  pendiente: ["completado", "cancelado"],
  completado: [],
  cancelado: [],
};

class Pedido {
  constructor({
    id = null,
    usuarioId,
    total,
    estado = "pendiente",
    fechaCreacion = null,
    detalles = [],
    cliente = null,
  }) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.total = total;
    this.estado = estado;
    this.fechaCreacion = fechaCreacion;
    this.detalles = detalles;
    this.cliente = cliente;
  }

  // Valida los artículos y agrupa cantidades repetidas del mismo producto.
  static normalizarItems(items) {
    if (!Array.isArray(items) || items.length === 0) {
      throw DomainError.validation("El pedido debe contener al menos un producto");
    }

    const agrupados = new Map();
    for (const item of items) {
      const productoId = Number(item?.productoId);
      const cantidad = Number(item?.cantidad);

      if (!Number.isInteger(productoId) || productoId <= 0) {
        throw DomainError.validation("Cada artículo debe tener un productoId válido");
      }
      if (!Number.isInteger(cantidad) || cantidad <= 0) {
        throw DomainError.validation("Cada artículo debe tener una cantidad entera mayor a 0");
      }
      agrupados.set(productoId, (agrupados.get(productoId) ?? 0) + cantidad);
    }

    return [...agrupados].map(([productoId, cantidad]) => ({ productoId, cantidad }));
  }

  // Regla de negocio: cálculo del total en centavos para evitar errores de redondeo.
  static calcularTotal(detalles) {
    const centavos = detalles.reduce(
      (suma, d) => suma + Math.round(d.precioUnitario * 100) * d.cantidad,
      0
    );
    return centavos / 100;
  }

  // productos: Map<productoId, Producto> con los productos bloqueados en la transacción.
  static crear({ usuarioId, items, productos }) {
    const detalles = Pedido.normalizarItems(items).map(({ productoId, cantidad }) => {
      const producto = productos.get(productoId);
      if (!producto) throw DomainError.notFound(`El producto ${productoId} no existe`);

      producto.descontarStock(cantidad);

      return {
        productoId,
        nombreProducto: producto.nombre,
        cantidad,
        precioUnitario: producto.precio,
        subtotal: Pedido.calcularTotal([{ precioUnitario: producto.precio, cantidad }]),
      };
    });

    return new Pedido({ usuarioId, total: Pedido.calcularTotal(detalles), detalles });
  }

  static validarEstado(estado) {
    if (!ESTADOS.includes(estado)) {
      throw DomainError.validation(`El estado debe ser uno de: ${ESTADOS.join(", ")}`);
    }
    return estado;
  }

  cambiarEstado(nuevoEstado) {
    Pedido.validarEstado(nuevoEstado);
    if (!TRANSICIONES[this.estado].includes(nuevoEstado)) {
      throw DomainError.conflict(`No se puede cambiar un pedido ${this.estado} a ${nuevoEstado}`);
    }
    this.estado = nuevoEstado;
  }

  estaPendiente() {
    return this.estado === "pendiente";
  }

  perteneceA(usuarioId) {
    return this.usuarioId === usuarioId;
  }
}

Pedido.ESTADOS = ESTADOS;

module.exports = Pedido;
