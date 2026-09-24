const { Router } = require("express");
const authorize = require("../middlewares/authorize");
const { validate, validateId } = require("../middlewares/validate");
const schemas = require("../middlewares/schemas");

function crearRutas({ authenticate, authController, usuarioController, productoController, pedidoController }) {
  const router = Router();
  const soloAdmin = [authenticate, authorize("admin")];

  // Autenticación
  router.post("/auth/registro", validate(schemas.registro), authController.registrar);
  router.post("/auth/login", validate(schemas.login), authController.login);
  router.get("/auth/perfil", authenticate, authController.perfil);

  // Usuarios (solo administradores)
  router.get("/usuarios", ...soloAdmin, usuarioController.listar);
  router.get("/usuarios/:id", ...soloAdmin, validateId, usuarioController.obtener);
  router.put("/usuarios/:id", ...soloAdmin, validateId, validate(schemas.actualizarUsuario), usuarioController.actualizar);
  router.delete("/usuarios/:id", ...soloAdmin, validateId, usuarioController.eliminar);

  // Productos (lectura pública, escritura solo administradores)
  router.get("/productos", productoController.listar);
  router.get("/productos/:id", validateId, productoController.obtener);
  router.post("/productos", ...soloAdmin, validate(schemas.crearProducto), productoController.crear);
  router.put("/productos/:id", ...soloAdmin, validateId, validate(schemas.actualizarProducto), productoController.actualizar);
  router.delete("/productos/:id", ...soloAdmin, validateId, productoController.eliminar);

  // Pedidos (usuarios autenticados; eliminar solo administradores)
  router.post("/pedidos", authenticate, validate(schemas.crearPedido), pedidoController.crear);
  router.get("/pedidos", authenticate, pedidoController.listar);
  router.get("/pedidos/:id", authenticate, validateId, pedidoController.obtener);
  router.patch("/pedidos/:id/estado", authenticate, validateId, validate(schemas.estadoPedido), pedidoController.cambiarEstado);
  router.delete("/pedidos/:id", ...soloAdmin, validateId, pedidoController.eliminar);

  return router;
}

module.exports = crearRutas;
