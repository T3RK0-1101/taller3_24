import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { mensajeDeError, usuariosApi } from "../../services/api";
import Alerta from "../../components/Alerta";

const FILTROS = [
  { valor: "pendiente", texto: "Pendientes" },
  { valor: "activo", texto: "Activos" },
  { valor: "inactivo", texto: "Inactivos" },
  { valor: "todos", texto: "Todos" },
];

const formatoFecha = (fecha) => new Date(fecha).toLocaleDateString("es-MX", { dateStyle: "medium" });

function FilaUsuario({ u, esPropio, onAcceso, onEliminar }) {
  const [rol, setRol] = useState(u.rol);

  const cambiarRol = (nuevo) => {
    setRol(nuevo);
    if (u.estado !== "pendiente") onAcceso(u, { rol: nuevo }, `Se cambió el rol de ${u.nombre} a ${nuevo}`);
  };

  return (
    <tr>
      <td>
        <strong>{u.nombre}</strong>
        <br />
        <small>{u.email}</small>
      </td>
      <td>{formatoFecha(u.fechaCreacion)}</td>
      <td>
        <span className={`chip estado-${u.estado}`}>{u.estado}</span>
      </td>
      <td>
        {esPropio ? (
          <span className="chip estado-admin">{u.rol}</span>
        ) : (
          <select value={rol} onChange={(e) => cambiarRol(e.target.value)}>
            <option value="cliente">cliente</option>
            <option value="admin">admin</option>
          </select>
        )}
      </td>
      <td>
        {esPropio ? (
          <small>Tu cuenta</small>
        ) : (
          <div className="acciones">
            {u.estado === "pendiente" && (
              <>
                <button className="btn" onClick={() => onAcceso(u, { estado: "activo", rol }, `Se aprobó la cuenta de ${u.nombre} como ${rol}`)}>
                  Aprobar
                </button>
                <button className="btn btn-peligro" onClick={() => onEliminar(u, "Rechazar")}>
                  Rechazar
                </button>
              </>
            )}
            {u.estado === "activo" && (
              <button className="btn btn-secundario" onClick={() => onAcceso(u, { estado: "inactivo" }, `Se desactivó la cuenta de ${u.nombre}`)}>
                Desactivar
              </button>
            )}
            {u.estado === "inactivo" && (
              <>
                <button className="btn" onClick={() => onAcceso(u, { estado: "activo" }, `Se reactivó la cuenta de ${u.nombre}`)}>
                  Reactivar
                </button>
                <button className="btn btn-peligro" onClick={() => onEliminar(u, "Eliminar")}>
                  Eliminar
                </button>
              </>
            )}
          </div>
        )}
      </td>
    </tr>
  );
}

export default function UsersPage() {
  const { usuario: yo } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState("pendiente");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");

  const cargar = useCallback(async () => {
    try {
      setUsuarios(await usuariosApi.listar());
    } catch (err) {
      setError(mensajeDeError(err));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const ejecutar = async (accion, mensaje) => {
    setError("");
    setAviso("");
    try {
      await accion();
      setAviso(mensaje);
      cargar();
    } catch (err) {
      setError(mensajeDeError(err));
      cargar();
    }
  };

  const cambiarAcceso = (u, datos, mensaje) => ejecutar(() => usuariosApi.cambiarAcceso(u.id, datos), mensaje);

  const eliminar = (u, verbo) => {
    if (!confirm(`¿${verbo} a ${u.nombre}? Esta acción no se puede deshacer.`)) return;
    ejecutar(() => usuariosApi.eliminar(u.id), `Se eliminó la cuenta de ${u.nombre}`);
  };

  const contar = (estado) => (estado === "todos" ? usuarios.length : usuarios.filter((u) => u.estado === estado).length);
  const visibles = filtro === "todos" ? usuarios : usuarios.filter((u) => u.estado === filtro);

  if (cargando) return <p className="estado">Cargando usuarios...</p>;

  return (
    <section>
      <h1>Usuarios</h1>
      <p className="subtitulo">Aprueba las cuentas nuevas, asigna permisos y administra el acceso de cada usuario.</p>

      <div className="pestanas">
        {FILTROS.map((f) => (
          <button key={f.valor} className={filtro === f.valor ? "activa" : ""} onClick={() => setFiltro(f.valor)}>
            {f.texto} <span className="contador">{contar(f.valor)}</span>
          </button>
        ))}
      </div>

      <Alerta>{error}</Alerta>
      <Alerta tipo="exito">{aviso}</Alerta>

      {visibles.length === 0 ? (
        <p className="estado">No hay usuarios en esta categoría.</p>
      ) : (
        <div className="tarjeta tabla-contenedor">
          <table>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Registro</th>
                <th>Estado</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((u) => (
                <FilaUsuario
                  key={`${u.id}-${u.rol}-${u.estado}`}
                  u={u}
                  esPropio={u.id === yo.id}
                  onAcceso={cambiarAcceso}
                  onEliminar={eliminar}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
