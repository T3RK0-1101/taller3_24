import { useEffect, useState } from "react";
import { formatoMoneda, mensajeDeError, reportesApi } from "../../services/api";
import Alerta from "../../components/Alerta";
import FiltrosFecha from "./FiltrosFecha";
import IngresosChart from "./IngresosChart";
import EstadosChart from "./EstadosChart";
import TopProductos from "./TopProductos";
import { PRESETS, formatoRango } from "./fechas";

const inicial = PRESETS.find((p) => p.id === "30d");

function Kpi({ titulo, valor, nota }) {
  return (
    <div className="tarjeta dash-kpi">
      <span>{titulo}</span>
      <strong>{valor}</strong>
      <small>{nota}</small>
    </div>
  );
}

export default function DashboardPage() {
  const [preset, setPreset] = useState(inicial.id);
  const [rango, setRango] = useState(inicial.rango());
  const [agrupacion, setAgrupacion] = useState("");
  const [limite, setLimite] = useState(5);
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let vigente = true;
    (async () => {
      setCargando(true);
      setError("");
      try {
        const respuesta = await reportesApi.resumen({ ...rango, agrupacion, limite });
        if (vigente) setDatos(respuesta);
      } catch (err) {
        if (vigente) setError(mensajeDeError(err));
      } finally {
        if (vigente) setCargando(false);
      }
    })();
    return () => {
      vigente = false;
    };
  }, [rango, agrupacion, limite]);

  const elegirPreset = (id) => {
    setPreset(id);
    const definicion = PRESETS.find((p) => p.id === id);
    if (definicion) setRango(definicion.rango());
  };

  return (
    <section>
      <div className="dash-encabezado">
        <h1>Dashboard de métricas</h1>
        <p className="dash-rango">{formatoRango(datos?.rango ?? rango)}</p>
      </div>

      <FiltrosFecha
        preset={preset}
        rango={rango}
        agrupacion={agrupacion}
        limite={limite}
        onPreset={elegirPreset}
        onRango={setRango}
        onAgrupacion={setAgrupacion}
        onLimite={setLimite}
      />

      <Alerta>{error}</Alerta>
      {!datos && cargando && <p className="estado">Cargando métricas...</p>}

      {datos && (
        <div className={cargando ? "dash-cargando" : ""}>
          <div className="dash-kpis">
            <Kpi titulo="Ingresos totales" valor={formatoMoneda(datos.ingresos.total)} nota="Pedidos pagados y enviados" />
            <Kpi titulo="Pedidos vendidos" valor={datos.ticket.pedidos} nota={`${datos.ticket.clientes} ${datos.ticket.clientes === 1 ? "cliente distinto" : "clientes distintos"}`} />
            <Kpi titulo="Ticket por pedido" valor={formatoMoneda(datos.ticket.ticketPorPedido)} nota="Gasto medio por pedido" />
            <Kpi titulo="Ticket por usuario" valor={formatoMoneda(datos.ticket.ticketPorUsuario)} nota="Gasto medio por cliente" />
          </div>

          <div className="dash-graficos">
            <div className="tarjeta dash-panel">
              <IngresosChart serie={datos.ingresos.serie} agrupacion={datos.agrupacion} />
            </div>
            <div className="tarjeta dash-panel">
              <EstadosChart estados={datos.estados.estados} total={datos.estados.total} />
            </div>
          </div>

          <div className="tarjeta dash-panel">
            <div className="dash-panel-cabecera">
              <h2>Productos con mayor rotación</h2>
              <small>Top {datos.limite} por unidades vendidas</small>
            </div>
            <TopProductos productos={datos.productos} />
          </div>
        </div>
      )}
    </section>
  );
}
