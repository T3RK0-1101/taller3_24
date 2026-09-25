const { Router } = require("express");
const authorize = require("../middlewares/authorize");
const requireActivo = require("../middlewares/requireActivo");
const { validate, validateId } = require("../middlewares/validate");
const schemas = require("../middlewares/schemas");

function crearRutas({ authenticate, authController, usuarioController, productoController, pedidoController }) {
  const router = Router();
  const activo = [authenticate, requireActivo];
  const soloAdmin = [...activo, authorize("admin")];

  // Autenticación (el perfil también responde a cuentas pendientes o inactivas)
  router.post("/auth/registro", validate(schemas.registro), authController.registrar);
  router.post("/auth/login", validate(schemas.login), authController.login);
  router.get("/auth/perfil", authenticate, authController.perfil);

  // Usuarios (solo administradores)
  router.get("/usuarios", ...soloAdmin, usuarioController.listar);
  router.get("/usuarios/:id", ...soloAdmin, validateId, usuarioController.obtener);
  router.put("/usuarios/:id", ...soloAdmin, validateId, validate(schemas.actualizarUsuario), usuarioController.actualizar);
  router.patch("/usuarios/:id/acceso", ...soloAdmin, validateId, validate(schemas.accesoUsuario), usuarioController.cambiarAcceso);
  router.delete("/usuarios/:id", ...soloAdmin, validateId, usuarioController.eliminar);

  // Productos (lectura pública, escritura solo administradores)
  router.get("/productos", productoController.listar);
  router.get("/productos/:id", validateId, productoController.obtener);
  router.post("/productos", ...soloAdmin, validate(schemas.crearProducto), productoController.crear);
  router.put("/productos/:id", ...soloAdmin, validateId, validate(schemas.actualizarProducto), productoController.actualizar);
  router.delete("/productos/:id", ...soloAdmin, validateId, productoController.eliminar);

  // Pedidos (cuentas activas; eliminar solo administradores)
  router.post("/pedidos", ...activo, validate(schemas.crearPedido), pedidoController.crear);
  router.get("/pedidos", ...activo, pedidoController.listar);
  router.get("/pedidos/:id", ...activo, validateId, pedidoController.obtener);
  router.patch("/pedidos/:id/estado", ...activo, validateId, validate(schemas.estadoPedido), pedidoController.cambiarEstado);
  router.delete("/pedidos/:id", ...soloAdmin, validateId, pedidoController.eliminar);

  return router;
}

module.exports = crearRutas;
