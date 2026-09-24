import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { mensajeDeError, productosApi } from "../../services/api";
import Alerta from "../../components/Alerta";
import ProductCard from "./ProductCard";
import ProductForm from "./ProductForm";

export default function CatalogPage() {
  const { esAdmin } = useAuth();
  const { agregar } = useCart();
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [editando, setEditando] = useState(undefined); // undefined: cerrado · null: nuevo · objeto: edición

  const cargar = useCallback(async (texto = "") => {
    setCargando(true);
    setError("");
    try {
      setProductos(await productosApi.listar(texto));
    } catch (err) {
      setError(mensajeDeError(err));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const buscar = (e) => {
    e.preventDefault();
    cargar(busqueda);
  };

  const agregarAlCarrito = (producto) => {
    agregar(producto);
    setAviso(`"${producto.nombre}" se agregó al carrito`);
    setTimeout(() => setAviso(""), 2500);
  };

  const guardar = async (datos) => {
    if (editando) await productosApi.actualizar(editando.id, datos);
    else await productosApi.crear(datos);
    setEditando(undefined);
    cargar(busqueda);
  };

  const eliminar = async (producto) => {
    if (!confirm(`¿Eliminar "${producto.nombre}"?`)) return;
    try {
      await productosApi.eliminar(producto.id);
      cargar(busqueda);
    } catch (err) {
      setError(mensajeDeError(err));
    }
  };

  return (
    <section>
      <div className="encabezado">
        <h1>Catálogo</h1>
        <form className="buscador" onSubmit={buscar}>
          <input placeholder="Buscar producto..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          <button className="btn btn-ghost">Buscar</button>
        </form>
        {esAdmin && (
          <button className="btn" onClick={() => setEditando(null)}>
            + Nuevo producto
          </button>
        )}
      </div>

      <Alerta>{error}</Alerta>
      <Alerta tipo="exito">{aviso}</Alerta>

      {cargando ? (
        <p className="estado">Cargando productos...</p>
      ) : productos.length === 0 ? (
        <p className="estado">No hay productos que mostrar.</p>
      ) : (
        <div className="rejilla">
          {productos.map((p) => (
            <ProductCard
              key={p.id}
              producto={p}
              esAdmin={esAdmin}
              onAgregar={agregarAlCarrito}
              onEditar={setEditando}
              onEliminar={eliminar}
            />
          ))}
        </div>
      )}

      {editando !== undefined && (
        <ProductForm producto={editando} onGuardar={guardar} onCancelar={() => setEditando(undefined)} />
      )}
    </section>
  );
}
