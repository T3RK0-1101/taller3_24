import { useState } from "react";
import { mensajeDeError } from "../../services/api";
import Alerta from "../../components/Alerta";

const VACIO = { nombre: "", descripcion: "", precio: "", stock: "" };

// Formulario reutilizable para crear y editar productos.
export default function ProductForm({ producto, onGuardar, onCancelar }) {
  const [form, setForm] = useState(
    producto
      ? { nombre: producto.nombre, descripcion: producto.descripcion, precio: producto.precio, stock: producto.stock }
      : VACIO
  );
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const enviar = async (e) => {
    e.preventDefault();
    setError("");
    setEnviando(true);
    try {
      await onGuardar({
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: Number(form.precio),
        stock: Number(form.stock),
      });
    } catch (err) {
      setError(mensajeDeError(err));
      setEnviando(false);
    }
  };

  return (
    <div className="modal-fondo" onClick={onCancelar}>
      <form className="tarjeta formulario modal" onSubmit={enviar} onClick={(e) => e.stopPropagation()}>
        <h2>{producto ? "Editar producto" : "Nuevo producto"}</h2>
        <Alerta>{error}</Alerta>

        <label>
          Nombre
          <input name="nombre" value={form.nombre} onChange={cambiar} required minLength={2} />
        </label>
        <label>
          Descripción
          <textarea name="descripcion" value={form.descripcion} onChange={cambiar} rows={3} />
        </label>
        <div className="fila">
          <label>
            Precio (MXN)
            <input type="number" name="precio" value={form.precio} onChange={cambiar} min="0" step="0.01" required />
          </label>
          <label>
            Stock
            <input type="number" name="stock" value={form.stock} onChange={cambiar} min="0" step="1" required />
          </label>
        </div>

        <div className="acciones">
          <button className="btn" disabled={enviando}>
            {enviando ? "Guardando..." : "Guardar"}
          </button>
          <button type="button" className="btn btn-ghost" onClick={onCancelar}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
