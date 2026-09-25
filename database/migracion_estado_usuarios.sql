-- ============================================================
-- Migración: control de acceso de usuarios
-- Agrega la columna "estado" sin borrar datos existentes.
-- Ejecutar UNA sola vez en pgAdmin > Query Tool sobre taller3_24
-- ============================================================

-- Los usuarios que ya existen quedan como 'activo'
ALTER TABLE usuarios
  ADD COLUMN estado VARCHAR(20) NOT NULL DEFAULT 'activo';

-- A partir de ahora, cada registro nuevo inicia como 'pendiente'
ALTER TABLE usuarios
  ALTER COLUMN estado SET DEFAULT 'pendiente';

ALTER TABLE usuarios
  ADD CONSTRAINT ck_usuarios_estado CHECK (estado IN ('pendiente', 'activo', 'inactivo'));

CREATE INDEX idx_usuarios_estado ON usuarios (estado);
