import { useState } from "react";
import { PRESETS, aISO, diasEntre } from "./fechas";

const AGRUPACIONES = [
  { valor: "", etiqueta: "Automática" },
  { valor: "dia", etiqueta: "Diaria" },
  { valor: "semana", etiqueta: "Semanal" },
  { valor: "mes", etiqueta: "Mensual" },
];

export default function FiltrosFecha({ preset, rango, agrupacion, limite, onPreset, onRango, onAgrupacion, onLimite }) {
  const [desde, setDesde] = useState(rango.desde);
  const [hasta, setHasta] = useState(rango.hasta);

  const personalizar = () => {
    setDesde(rango.desde);
    setHasta(rango.hasta);
    onPreset("personalizado");
  };

  let problema = "";
  if (!desde || !hasta) problema = "Selecciona ambas fechas";
  else if (desde > hasta) problema = "La fecha inicial no puede ser posterior a la final";
  else if (diasEntre(desde, hasta) > 366) problema = "El rango no puede exceder 366 días";

  const clase = (activo) => `dash-chip ${activo ? "dash-chip-activo" : ""}`;

  return (
    <div className="tarjeta dash-filtros">
      <div className="dash-grupo">
        <span>Período</span>
        <div className="dash-chips">
          {PRESETS.map((p) => (
            <button key={p.id} type="button" className={clase(preset === p.id)} onClick={() => onPreset(p.id)}>
              {p.etiqueta}
            </button>
          ))}
          <button type="button" className={clase(preset === "personalizado")} onClick={personalizar}>
            Rango personalizado
          </button>
        </div>
      </div>

      {preset === "personalizado" && (
        <div className="dash-personalizado">
          <label className="dash-grupo">
            <span>Desde</span>
            <input type="date" value={desde} max={aISO(new Date())} onChange={(e) => setDesde(e.target.value)} />
          </label>
          <label className="dash-grupo">
            <span>Hasta</span>
            <input type="date" value={hasta} max={aISO(new Date())} onChange={(e) => setHasta(e.target.value)} />
          </label>
          <button type="button" className="btn" disabled={Boolean(problema)} onClick={() => onRango({ desde, hasta })}>
            Aplicar
          </button>
          {problema && <small className="dash-error-rango">{problema}</small>}
        </div>
      )}

      <label className="dash-grupo">
        <span>Agrupar ingresos</span>
        <select value={agrupacion} onChange={(e) => onAgrupacion(e.target.value)}>
          {AGRUPACIONES.map((a) => (
            <option key={a.valor} value={a.valor}>
              {a.etiqueta}
            </option>
          ))}
        </select>
      </label>

      <label className="dash-grupo">
        <span>Productos</span>
        <select value={limite} onChange={(e) => onLimite(Number(e.target.value))}>
          <option value={5}>Top 5</option>
          <option value={10}>Top 10</option>
        </select>
      </label>
    </div>
  );
}
