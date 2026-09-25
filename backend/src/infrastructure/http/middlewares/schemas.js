// Esquemas de validación de entrada para cada endpoint.
module.exports = {
  registro: {
    nombre: { type: "string", required: true },
    email: { type: "string", required: true },
    password: { type: "string", required: true },
  },
  login: {
    email: { type: "string", required: true },
    password: { type: "string", required: true },
  },
  actualizarUsuario: {
    nombre: { type: "string" },
    email: { type: "string" },
    rol: { type: "string", enum: ["cliente", "admin", "gestor_pedidos"] },
  },
  accesoUsuario: {
    rol: { type: "string", enum: ["cliente", "admin", "gestor_pedidos"] },
    estado: { type: "string", enum: ["activo", "inactivo"] },
  },
  crearProducto: {
    nombre: { type: "string", required: true },
    descripcion: { type: "string" },
    precio: { type: "number", required: true },
    stock: { type: "integer", required: true },
  },
  actualizarProducto: {
    nombre: { type: "string" },
    descripcion: { type: "string" },
    precio: { type: "number" },
    stock: { type: "integer" },
  },
  crearPedido: {
    items: { type: "array", required: true },
  },
  estadoPedido: {
    estado: { type: "string", required: true, enum: ["pendiente", "completado", "cancelado"] },
  },
};
