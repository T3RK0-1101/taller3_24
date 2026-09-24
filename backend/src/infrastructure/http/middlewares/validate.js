const DomainError = require("../../../domain/errors/DomainError");

const TIPOS = {
  string: (v) => typeof v === "string",
  number: (v) => typeof v === "number" && Number.isFinite(v),
  integer: (v) => Number.isInteger(v),
  array: (v) => Array.isArray(v),
};

// Validación de forma del payload (tipos y campos obligatorios).
// Las reglas de negocio se validan en el dominio.
const validate = (schema) => (req, res, next) => {
  const body = req.body ?? {};
  const errores = [];

  for (const [campo, regla] of Object.entries(schema)) {
    const valor = body[campo];

    if (valor === undefined || valor === null || valor === "") {
      if (regla.required) errores.push(`El campo "${campo}" es obligatorio`);
      continue;
    }
    if (!TIPOS[regla.type](valor)) {
      errores.push(`El campo "${campo}" debe ser de tipo ${regla.type}`);
      continue;
    }
    if (regla.enum && !regla.enum.includes(valor)) {
      errores.push(`El campo "${campo}" debe ser uno de: ${regla.enum.join(", ")}`);
    }
  }

  if (errores.length > 0) throw DomainError.validation("Datos inválidos", errores);
  next();
};

// Valida que :id sea un entero positivo y lo convierte a número.
const validateId = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) throw DomainError.validation("El id debe ser un entero positivo");
  req.params.id = id;
  next();
};

module.exports = { validate, validateId };
