export const aISO = (fecha) => fecha.toLocaleDateString("en-CA");

const hace = (dias) => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() - dias);
  return aISO(fecha);
};

export const PRESETS = [
  { id: "7d", etiqueta: "Últimos 7 días", rango: () => ({ desde: hace(6), hasta: aISO(new Date()) }) },
  { id: "30d", etiqueta: "Últimos 30 días", rango: () => ({ desde: hace(29), hasta: aISO(new Date()) }) },
  { id: "90d", etiqueta: "Últimos 90 días", rango: () => ({ desde: hace(89), hasta: aISO(new Date()) }) },
  {
    id: "mes",
    etiqueta: "Este mes",
    rango: () => {
      const hoy = new Date();
      return { desde: aISO(new Date(hoy.getFullYear(), hoy.getMonth(), 1)), hasta: aISO(hoy) };
    },
  },
];

const aFechaLocal = (iso) => {
  const [anio, mes, dia] = iso.split("-").map(Number);
  return new Date(anio, mes - 1, dia);
};

export const diasEntre = (desde, hasta) => Math.round((aFechaLocal(hasta) - aFechaLocal(desde)) / 86_400_000) + 1;

export const etiquetaPeriodo = (periodo, agrupacion) => {
  const fecha = aFechaLocal(periodo);
  if (agrupacion === "mes") return fecha.toLocaleDateString("es-MX", { month: "short", year: "2-digit" });
  const dia = fecha.toLocaleDateString("es-MX", { day: "2-digit", month: "short" });
  return agrupacion === "semana" ? `Sem ${dia}` : dia;
};

export const formatoRango = ({ desde, hasta }) => {
  const formato = (iso) => aFechaLocal(iso).toLocaleDateString("es-MX", { dateStyle: "medium" });
  return `${formato(desde)} al ${formato(hasta)}`;
};
