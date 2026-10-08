const DomainError = require("../../../domain/errors/DomainError");

const UNIDADES = { dia: "day", semana: "week", mes: "month" };
const DIA_MS = 86_400_000;
const MAX_DIAS = 366;

const aMs = (fecha) => Date.parse(`${fecha}T00:00:00Z`);
const aFecha = (ms) => new Date(ms).toISOString().slice(0, 10);
const hoy = (zonaHoraria) => new Date().toLocaleDateString("en-CA", { timeZone: zonaHoraria });

const validarFecha = (valor, nombre) => {
  const texto = String(valor);
  const ms = aMs(texto);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(texto) || Number.isNaN(ms) || aFecha(ms) !== texto) {
    throw DomainError.validation(`La fecha "${nombre}" debe tener el formato AAAA-MM-DD`);
  }
  return texto;
};

// Convierte los parámetros de la consulta en filtros válidos. Por defecto: últimos 30 días.
function normalizarFiltros({ desde, hasta, agrupacion, limite } = {}, zonaHoraria) {
  const fin = hasta ? validarFecha(hasta, "hasta") : hoy(zonaHoraria);
  const inicio = desde ? validarFecha(desde, "desde") : aFecha(aMs(fin) - 29 * DIA_MS);
  if (inicio > fin) throw DomainError.validation("La fecha inicial no puede ser posterior a la final");

  const dias = (aMs(fin) - aMs(inicio)) / DIA_MS + 1;
  if (dias > MAX_DIAS) throw DomainError.validation(`El rango no puede exceder ${MAX_DIAS} días`);

  const clave = agrupacion ?? (dias <= 31 ? "dia" : dias <= 120 ? "semana" : "mes");
  if (!Object.hasOwn(UNIDADES, clave)) {
    throw DomainError.validation(`La agrupación debe ser una de: ${Object.keys(UNIDADES).join(", ")}`);
  }

  const tope = limite === undefined ? 5 : Number(limite);
  if (!Number.isInteger(tope) || tope < 1 || tope > 10) {
    throw DomainError.validation("El límite debe ser un entero entre 1 y 10");
  }

  return { desde: inicio, hasta: fin, agrupacion: clave, unidad: UNIDADES[clave], limite: tope, zonaHoraria };
}

module.exports = { normalizarFiltros };
