-- ============================================================
-- Taller 3 - Script de base de datos (PostgreSQL)
-- Ejecutar en pgAdmin > Query Tool conectado a la base taller3_24
-- ============================================================

DROP TABLE IF EXISTS detalle_pedidos;
DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS usuarios;

-- ---------- usuarios ----------
CREATE TABLE usuarios (
  id              INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre          VARCHAR(100) NOT NULL,
  email           VARCHAR(150) NOT NULL,
  password        VARCHAR(255) NOT NULL,
  rol             VARCHAR(20)  NOT NULL DEFAULT 'cliente',
  estado          VARCHAR(20)  NOT NULL DEFAULT 'pendiente',
  fecha_creacion  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_usuarios_email UNIQUE (email),
  CONSTRAINT ck_usuarios_rol CHECK (rol IN ('cliente', 'admin')),
  CONSTRAINT ck_usuarios_estado CHECK (estado IN ('pendiente', 'activo', 'inactivo'))
);

-- ---------- productos ----------
CREATE TABLE productos (
  id              INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre          VARCHAR(150)  NOT NULL,
  descripcion     TEXT          NOT NULL DEFAULT '',
  precio          NUMERIC(10,2) NOT NULL,
  stock           INTEGER       NOT NULL DEFAULT 0,
  fecha_creacion  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  CONSTRAINT ck_productos_precio CHECK (precio >= 0),
  CONSTRAINT ck_productos_stock  CHECK (stock >= 0)
);

-- ---------- pedidos ----------
CREATE TABLE pedidos (
  id              INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  usuario_id      INTEGER       NOT NULL,
  total           NUMERIC(12,2) NOT NULL,
  estado          VARCHAR(20)   NOT NULL DEFAULT 'pendiente',
  fecha_creacion  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_pedidos_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios (id) ON DELETE RESTRICT,
  CONSTRAINT ck_pedidos_total  CHECK (total >= 0),
  CONSTRAINT ck_pedidos_estado CHECK (estado IN ('pendiente', 'completado', 'cancelado'))
);

-- ---------- detalle_pedidos ----------
CREATE TABLE detalle_pedidos (
  id               INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  pedido_id        INTEGER       NOT NULL,
  producto_id      INTEGER       NOT NULL,
  cantidad         INTEGER       NOT NULL,
  precio_unitario  NUMERIC(10,2) NOT NULL,
  CONSTRAINT fk_detalle_pedido FOREIGN KEY (pedido_id)
    REFERENCES pedidos (id) ON DELETE CASCADE,
  CONSTRAINT fk_detalle_producto FOREIGN KEY (producto_id)
    REFERENCES productos (id) ON DELETE RESTRICT,
  CONSTRAINT uq_detalle_pedido_producto UNIQUE (pedido_id, producto_id),
  CONSTRAINT ck_detalle_cantidad CHECK (cantidad > 0),
  CONSTRAINT ck_detalle_precio   CHECK (precio_unitario >= 0)
);

-- ---------- índices ----------
CREATE INDEX idx_usuarios_estado      ON usuarios (estado);
CREATE INDEX idx_productos_nombre      ON productos (LOWER(nombre));
CREATE INDEX idx_pedidos_usuario_id    ON pedidos (usuario_id);
CREATE INDEX idx_pedidos_estado        ON pedidos (estado);
CREATE INDEX idx_pedidos_fecha         ON pedidos (fecha_creacion DESC);
CREATE INDEX idx_detalle_pedido_id     ON detalle_pedidos (pedido_id);
CREATE INDEX idx_detalle_producto_id   ON detalle_pedidos (producto_id);

-- ---------- datos de ejemplo ----------
INSERT INTO productos (nombre, descripcion, precio, stock) VALUES
  ('Teclado mecánico',   'Teclado mecánico RGB con switches rojos',   1299.00, 15),
  ('Mouse inalámbrico',  'Mouse ergonómico de 2.4 GHz, 1600 DPI',       349.50, 30),
  ('Monitor 24"',        'Monitor IPS Full HD de 75 Hz',               2899.00,  8),
  ('Audífonos',          'Audífonos over-ear con cancelación de ruido', 899.90, 20),
  ('Memoria USB 64 GB',  'Memoria USB 3.1 de alta velocidad',            189.00, 50);
