-- ============================================================
-- Migración: nuevo rol "gestor_pedidos"
-- Ejecutar UNA sola vez en pgAdmin > Query Tool sobre taller3_24
-- ============================================================

ALTER TABLE usuarios DROP CONSTRAINT ck_usuarios_rol;

ALTER TABLE usuarios
  ADD CONSTRAINT ck_usuarios_rol CHECK (rol IN ('cliente', 'admin', 'gestor_pedidos'));
