const express = require("express");
const cors = require("cors");
const crearRutas = require("./routes");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

// Express 5 envía automáticamente al errorHandler los errores de funciones async.
function crearApp({ corsOrigin, ...dependencias }) {
  const app = express();

  app.use(cors({ origin: corsOrigin }));
  app.use(express.json());

  app.get("/api/health", (req, res) => res.json({ estado: "ok" }));
  app.use("/api", crearRutas(dependencias));

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = crearApp;
