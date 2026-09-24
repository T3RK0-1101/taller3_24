const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env"), quiet: true });

const requerida = (nombre) => {
  const valor = process.env[nombre];
  if (!valor) throw new Error(`Falta la variable de entorno ${nombre} en backend/.env`);
  return valor;
};

module.exports = {
  port: Number(process.env.PORT) || 3000,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  db: {
    host: requerida("DB_HOST"),
    port: Number(process.env.DB_PORT) || 5432,
    user: requerida("DB_USER"),
    password: process.env.DB_PASSWORD || "",
    database: requerida("DB_NAME"),
  },
  jwt: {
    secret: requerida("JWT_SECRET"),
    expiresIn: process.env.JWT_EXPIRES_IN || "2h",
  },
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS) || 10,
};
