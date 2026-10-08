-- ============================================================
-- Migración: nuevo ciclo de vida del pedido
-- pendiente -> pagado -> enviado (y cancelado)
-- Ejecutar UNA sola vez en pgAdmin > Query Tool sobre taller3_24
-- ============================================================

BEGIN;

ALTER TABLE pedidos DROP CONSTRAINT ck_pedidos_estado;

-- Los pedidos que estaban "completado" pasan a "enviado"
UPDATE pedidos SET estado = 'enviado' WHERE estado = 'completado';

ALTER TABLE pedidos
  ADD CONSTRAINT ck_pedidos_estado CHECK (estado IN ('pendiente', 'pagado', 'enviado', 'cancelado'));

COMMIT;
