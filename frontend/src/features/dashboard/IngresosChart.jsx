import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatoMoneda } from "../../services/api";
import { etiquetaPeriodo } from "./fechas";

const compacto = new Intl.NumberFormat("es-MX", { notation: "compact", maximumFractionDigits: 1 });
const COLOR = "#6d28d9";
const margen = { top: 8, right: 12, bottom: 0, left: 0 };
const formatoTooltip = (valor) => [formatoMoneda(valor), "Ingresos"];

export default function IngresosChart({ serie, agrupacion }) {
  const [tipo, setTipo] = useState("barras");
  const datos = serie.map((s) => ({ ...s, etiqueta: etiquetaPeriodo(s.periodo, agrupacion) }));
  const clase = (activo) => `dash-chip ${activo ? "dash-chip-activo" : ""}`;

  return (
    <>
      <div className="dash-panel-cabecera">
        <h2>Tendencia de ingresos</h2>
        <div className="dash-chips">
          <button type="button" className={clase(tipo === "barras")} onClick={() => setTipo("barras")}>
            Barras
          </button>
          <button type="button" className={clase(tipo === "lineas")} onClick={() => setTipo("lineas")}>
            Líneas
          </button>
        </div>
      </div>

      {!datos.some((d) => d.ingresos > 0) ? (
        <p className="dash-vacio">Sin ventas en el período seleccionado</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          {tipo === "barras" ? (
            <BarChart data={datos} margin={margen}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="etiqueta" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 12 }} width={56} tickFormatter={(v) => compacto.format(v)} />
              <Tooltip formatter={formatoTooltip} />
              <Bar dataKey="ingresos" fill={COLOR} radius={[6, 6, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={datos} margin={margen}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="etiqueta" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 12 }} width={56} tickFormatter={(v) => compacto.format(v)} />
              <Tooltip formatter={formatoTooltip} />
              <Line type="monotone" dataKey="ingresos" stroke={COLOR} strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      )}
    </>
  );
}
