import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { formatoMoneda, mensajeDeError, pedidosApi } from "../../services/api";
import Alerta from "../../components/Alerta";

const formatoFecha = (fecha) =>
  new Date(fecha).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" });

export default function OrdersPage() {
  const { esAdmin, gestionaPedidos } = useAuth();
  const location = useLocation();
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    setError("");
    try {
      setPedidos(await pedidosApi.listar());
    } catch (err) {
      setError(mensajeDeError(err));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const ejecutar = async (accion) => {
    try {
      await accion();
      cargar();
    } catch (err) {
      setError(mensajeDeError(err));
    }
  };

  const cambiarEstado = (pedido, estado) => {
    if (estado === "cancelado" && !confirm(`¿Cancelar el pedido #${pedido.id}? El stock se devolverá.`)) return;
    ejecutar(() => pedidosApi.cambiarEstado(pedido.id, estado));
  };

  const eliminar = (pedido) => {
    if (!confirm(`¿Eliminar definitivamente el pedido #${pedido.id}?`)) return;
    ejecutar(() => pedidosApi.eliminar(pedido.id));
  };

  if (cargando) return <p className="estado">Cargando pedidos...</p>;

  return (
    <section>
      <h1>{gestionaPedidos ? "Todos los pedidos" : "Mis pedidos"}</h1>
      {location.state?.creado && <Alerta tipo="exito">¡Pedido creado correctamente!</Alerta>}
      <Alerta>{error}</Alerta>

      {pedidos.length === 0 ? (
        <p className="estado">Aún no hay pedidos.</p>
      ) : (
        <div className="lista-pedidos">
          {pedidos.map((pedido) => (
            <article key={pedido.id} className="tarjeta pedido">
              <div className="pedido-cabecera">
                <div>
                  <h3>Pedido #{pedido.id}</h3>
                  <small>
                    {formatoFecha(pedido.fechaCreacion)}
                    {gestionaPedidos && ` · ${pedido.cliente.nombre} (${pedido.cliente.email})`}
                  </small>
                </div>
                <span className={`estado-pedido estado-${pedido.estado}`}>{pedido.estado}</span>
              </div>

              <ul className="detalle">
                {pedido.detalles.map((d) => (
                  <li key={d.productoId}>
                    <span>
                      {d.cantidad} × {d.nombreProducto}
                    </span>
                    <span>{formatoMoneda(d.subtotal)}</span>
                  </li>
                ))}
              </ul>

              <div className="pedido-pie">
                <strong>Total: {formatoMoneda(pedido.total)}</strong>
                <div className="acciones">
                  {pedido.estado === "pendiente" && gestionaPedidos && (
                    <button className="btn" onClick={() => cambiarEstado(pedido, "completado")}>
                      Marcar completado
                    </button>
                  )}
                  {pedido.estado === "pendiente" && (
                    <button className="btn btn-ghost" onClick={() => cambiarEstado(pedido, "cancelado")}>
                      Cancelar
                    </button>
                  )}
                  {esAdmin && (
                    <button className="btn btn-peligro" onClick={() => eliminar(pedido)}>
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
