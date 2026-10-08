import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const ESTADOS = {
  pendiente: { etiqueta: "Pendiente", color: "#f59e0b" },
  pagado: { etiqueta: "Pagado", color: "#2563eb" },
  enviado: { etiqueta: "Enviado", color: "#059669" },
  cancelado: { etiqueta: "Cancelado", color: "#dc2626" },
};

export default function EstadosChart({ estados, total }) {
  const datos = estados.map((e) => ({ ...e, nombre: ESTADOS[e.estado].etiqueta }));

  return (
    <>
      <div className="dash-panel-cabecera">
        <h2>Estado de los pedidos</h2>
        <small>{total} pedidos</small>
      </div>

      {total === 0 ? (
        <p className="dash-vacio">Sin pedidos en el período seleccionado</p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={datos} dataKey="pedidos" nameKey="nombre" innerRadius={55} outerRadius={90} paddingAngle={2}>
                {datos.map((e) => (
                  <Cell key={e.estado} fill={ESTADOS[e.estado].color} />
                ))}
              </Pie>
              <Tooltip formatter={(valor, nombre) => [`${valor} pedidos`, nombre]} />
            </PieChart>
          </ResponsiveContainer>
          <ul className="dash-leyenda">
            {datos.map((e) => (
              <li key={e.estado}>
                <i style={{ background: ESTADOS[e.estado].color }} />
                {e.nombre}
                <b>
                  {e.pedidos} · {e.porcentaje}%
                </b>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
