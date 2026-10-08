-- ============================================================
-- Datos de demostración para el Dashboard (Act. 2.6)
-- Crea 4 clientes demo y 60 pedidos en los últimos 75 días.
-- Ejecutar UNA sola vez en pgAdmin > Query Tool sobre taller3_24
-- ============================================================

BEGIN;

-- Clientes de demostración (sin acceso: el hash no es válido)
INSERT INTO usuarios (nombre, email, password, rol, estado, fecha_creacion) VALUES
  ('Ana Torres',    'ana.demo@pablostore.com',    '!sin-acceso', 'cliente', 'activo', NOW() - INTERVAL '80 days'),
  ('Luis Ramírez',  'luis.demo@pablostore.com',   '!sin-acceso', 'cliente', 'activo', NOW() - INTERVAL '75 days'),
  ('María López',   'maria.demo@pablostore.com',  '!sin-acceso', 'cliente', 'activo', NOW() - INTERVAL '70 days'),
  ('Carlos Díaz',   'carlos.demo@pablostore.com', '!sin-acceso', 'cliente', 'activo', NOW() - INTERVAL '65 days')
ON CONFLICT (email) DO NOTHING;

DO $$
DECLARE
  id_ini    INTEGER;
  clientes  INTEGER[];
  i         INTEGER;
  pid       INTEGER;
  uid       INTEGER;
  fecha     TIMESTAMPTZ;
  est       TEXT;
  r         DOUBLE PRECISION;
  prod      RECORD;
BEGIN
  SELECT COALESCE(MAX(id), 0) INTO id_ini FROM pedidos;
  SELECT ARRAY_AGG(id) INTO clientes FROM usuarios WHERE rol = 'cliente' AND estado = 'activo';

  FOR i IN 1..60 LOOP
    uid   := clientes[1 + FLOOR(random() * array_length(clientes, 1))::int];
    fecha := NOW() - (random() * INTERVAL '75 days');
    r     := random();
    est   := CASE WHEN r < 0.20 THEN 'cancelado'
                  WHEN r < 0.40 THEN 'pendiente'
                  WHEN r < 0.60 THEN 'pagado'
                  ELSE 'enviado' END;

    INSERT INTO pedidos (usuario_id, total, estado, fecha_creacion)
    VALUES (uid, 0, est, fecha) RETURNING id INTO pid;

    FOR prod IN
      SELECT id, precio FROM productos ORDER BY random() LIMIT (1 + FLOOR(random() * 3))::int
    LOOP
      INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario)
      VALUES (pid, prod.id, 1 + FLOOR(random() * 3)::int, prod.precio);
    END LOOP;

    UPDATE pedidos
       SET total = (SELECT SUM(cantidad * precio_unitario) FROM detalle_pedidos WHERE pedido_id = pid)
     WHERE id = pid;
  END LOOP;

  RAISE NOTICE 'Pedidos demo creados: todos los que tienen id mayor a %', id_ini;
END $$;

COMMIT;

-- Para borrar los datos demo después de las capturas:
--   DELETE FROM pedidos  WHERE id > <el número que mostró el aviso>;
--   DELETE FROM usuarios WHERE email LIKE '%.demo@pablostore.com';
