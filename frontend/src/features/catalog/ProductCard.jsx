import { formatoMoneda } from "../../services/api";

export default function ProductCard({ producto, esAdmin, onAgregar, onEditar, onEliminar }) {
  const agotado = producto.stock === 0;

  return (
    <article className="tarjeta producto">
      <div className="producto-cabecera">
        <h3>{producto.nombre}</h3>
        <span className={`stock ${agotado ? "stock-agotado" : ""}`}>
          {agotado ? "Agotado" : `${producto.stock} disp.`}
        </span>
      </div>
      <p className="descripcion">{producto.descripcion || "Sin descripción"}</p>
      <p className="precio">{formatoMoneda(producto.precio)}</p>

      <div className="acciones">
        <button className="btn" disabled={agotado} onClick={() => onAgregar(producto)}>
          Agregar al carrito
        </button>
        {esAdmin && (
          <>
            <button className="btn btn-ghost" onClick={() => onEditar(producto)}>
              Editar
            </button>
            <button className="btn btn-peligro" onClick={() => onEliminar(producto)}>
              Eliminar
            </button>
          </>
        )}
      </div>
    </article>
  );
}
