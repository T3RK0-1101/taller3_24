import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

// Pantalla para cuentas pendientes de aprobación o desactivadas.
// Consulta el estado cada 10 segundos: al ser aprobada, la tienda se habilita sola.
export default function EsperaPage() {
  const { usuario, refrescar, logout } = useAuth();
  const [comprobando, setComprobando] = useState(false);
  const inactivo = usuario.estado === "inactivo";

  useEffect(() => {
    const intervalo = setInterval(refrescar, 10000);
    return () => clearInterval(intervalo);
  }, [refrescar]);

  const comprobar = async () => {
    setComprobando(true);
    await refrescar();
    setComprobando(false);
  };

  return (
    <section className="espera">
      <div className="tarjeta espera-tarjeta">
        <div className={`espera-icono ${inactivo ? "espera-icono-inactivo" : ""}`}>{inactivo ? "✕" : "⏳"}</div>

        <h1>{inactivo ? "Tu cuenta está desactivada" : "Espera a que un administrador acepte tu solicitud"}</h1>

        <p>
          {inactivo
            ? "Un administrador desactivó tu acceso a la tienda. Si crees que es un error, comunícate con él."
            : `Hola, ${usuario.nombre}. Tu cuenta (${usuario.email}) se creó correctamente y está en revisión. En cuanto un administrador la apruebe y te asigne permisos, podrás comprar en la tienda.`}
        </p>

        {!inactivo && <p className="nota">Esta página se actualiza sola cada 10 segundos.</p>}

        <div className="acciones centradas">
          <button className="btn" onClick={comprobar} disabled={comprobando}>
            {comprobando ? "Comprobando..." : "Comprobar ahora"}
          </button>
          <button className="btn btn-secundario" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </section>
  );
}
