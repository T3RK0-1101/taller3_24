// Raíz de composición: crea los adaptadores, los inyecta en los casos de uso y levanta el servidor.
const config = require("./config/env");

// Infraestructura
const pool = require("./infrastructure/database/pool");
const PgUsuarioRepository = require("./infrastructure/database/PgUsuarioRepository");
const PgProductoRepository = require("./infrastructure/database/PgProductoRepository");
const PgPedidoRepository = require("./infrastructure/database/PgPedidoRepository");
const PgUnitOfWork = require("./infrastructure/database/PgUnitOfWork");
const BcryptPasswordHasher = require("./infrastructure/security/BcryptPasswordHasher");
const JwtTokenService = require("./infrastructure/security/JwtTokenService");
const crearAuthenticate = require("./infrastructure/http/middlewares/authenticate");
const crearApp = require("./infrastructure/http/app");

// Controladores
const AuthController = require("./infrastructure/http/controllers/AuthController");
const UsuarioController = require("./infrastructure/http/controllers/UsuarioController");
const ProductoController = require("./infrastructure/http/controllers/ProductoController");
const PedidoController = require("./infrastructure/http/controllers/PedidoController");

// Casos de uso
const RegistrarUsuario = require("./application/use-cases/usuarios/RegistrarUsuario");
const IniciarSesion = require("./application/use-cases/usuarios/IniciarSesion");
const ObtenerUsuario = require("./application/use-cases/usuarios/ObtenerUsuario");
const ListarUsuarios = require("./application/use-cases/usuarios/ListarUsuarios");
const ActualizarUsuario = require("./application/use-cases/usuarios/ActualizarUsuario");
const EliminarUsuario = require("./application/use-cases/usuarios/EliminarUsuario");
const VerificarSesion = require("./application/use-cases/usuarios/VerificarSesion");
const ActualizarAccesoUsuario = require("./application/use-cases/usuarios/ActualizarAccesoUsuario");
const CrearProducto = require("./application/use-cases/productos/CrearProducto");
const ListarProductos = require("./application/use-cases/productos/ListarProductos");
const ObtenerProducto = require("./application/use-cases/productos/ObtenerProducto");
const ActualizarProducto = require("./application/use-cases/productos/ActualizarProducto");
const EliminarProducto = require("./application/use-cases/productos/EliminarProducto");
const CrearPedido = require("./application/use-cases/pedidos/CrearPedido");
const ListarPedidos = require("./application/use-cases/pedidos/ListarPedidos");
const ObtenerPedido = require("./application/use-cases/pedidos/ObtenerPedido");
const ActualizarEstadoPedido = require("./application/use-cases/pedidos/ActualizarEstadoPedido");
const EliminarPedido = require("./application/use-cases/pedidos/EliminarPedido");

// Adaptadores
const crearRepositorios = (db) => ({
  usuarioRepository: new PgUsuarioRepository(db),
  productoRepository: new PgProductoRepository(db),
  pedidoRepository: new PgPedidoRepository(db),
});
const { usuarioRepository, productoRepository, pedidoRepository } = crearRepositorios(pool);
const unitOfWork = new PgUnitOfWork(pool, crearRepositorios);
const passwordHasher = new BcryptPasswordHasher(config.bcryptRounds);
const tokenService = new JwtTokenService(config.jwt);

// Casos de uso
const obtenerUsuario = new ObtenerUsuario({ usuarioRepository });

const app = crearApp({
  corsOrigin: config.corsOrigin,
  authenticate: crearAuthenticate(new VerificarSesion({ tokenService, usuarioRepository })),
  authController: new AuthController({
    registrarUsuario: new RegistrarUsuario({ usuarioRepository, passwordHasher }),
    iniciarSesion: new IniciarSesion({ usuarioRepository, passwordHasher, tokenService }),
    obtenerUsuario,
  }),
  usuarioController: new UsuarioController({
    listarUsuarios: new ListarUsuarios({ usuarioRepository }),
    obtenerUsuario,
    actualizarUsuario: new ActualizarUsuario({ usuarioRepository }),
    actualizarAccesoUsuario: new ActualizarAccesoUsuario({ usuarioRepository }),
    eliminarUsuario: new EliminarUsuario({ usuarioRepository }),
  }),
  productoController: new ProductoController({
    listarProductos: new ListarProductos({ productoRepository }),
    obtenerProducto: new ObtenerProducto({ productoRepository }),
    crearProducto: new CrearProducto({ productoRepository }),
    actualizarProducto: new ActualizarProducto({ productoRepository }),
    eliminarProducto: new EliminarProducto({ productoRepository }),
  }),
  pedidoController: new PedidoController({
    crearPedido: new CrearPedido({ unitOfWork }),
    listarPedidos: new ListarPedidos({ pedidoRepository }),
    obtenerPedido: new ObtenerPedido({ pedidoRepository }),
    actualizarEstadoPedido: new ActualizarEstadoPedido({ unitOfWork }),
    eliminarPedido: new EliminarPedido({ unitOfWork }),
  }),
});

async function iniciar() {
  try {
    await pool.query("SELECT 1");
    console.log(`Conectado a PostgreSQL (${config.db.host}:${config.db.port}/${config.db.database})`);
  } catch (error) {
    console.error("No se pudo conectar a PostgreSQL:", error.message);
    console.error("Revisa los valores DB_* de backend/.env y que el servidor de PostgreSQL esté encendido.");
    process.exit(1);
  }

  app.listen(config.port, () => {
    console.log(`API escuchando en http://localhost:${config.port}/api`);
  });
}

iniciar();
