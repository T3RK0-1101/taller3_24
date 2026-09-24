import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { formatoMoneda, mensajeDeError, pedidosApi } from "../../services/api";
import Alerta from "../../components/Alerta";

export default function CartPage() {
  const { usuario } = useAuth();
  const { items, cambiarCantidad, quitar, vaciar, total } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const confirmar = async () => {
    if (!usuario) return navigate("/login", { state: { desde: "/carrito" } });

    setError("");
    setEnviando(true);
    try {
      await pedidosApi.crear(items.map((i) => ({ productoId: i.producto.id, cantidad: i.cantidad })));
      vaciar();
      navigate("/pedidos", { state: { creado: true } });
    } catch (err) {
      setError(mensajeDeError(err));
    } finally {
      setEnviando(false);
    }
  };

  if (items.length === 0) {
    return (
      <section className="vacio">
        <h1>Tu carrito está vacío</h1>
        <Link to="/" className="btn">
          Ver catálogo
        </Link>
      </section>
    );
  }

  return (
    <section>
      <h1>Carrito</h1>
      <Alerta>{error}</Alerta>

      <div className="tarjeta tabla-contenedor">
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map(({ producto, cantidad }) => (
              <tr key={producto.id}>
                <td>{producto.nombre}</td>
                <td>{formatoMoneda(producto.precio)}</td>
                <td>
                  <input
                    type="number"
                    className="cantidad"
                    min="1"
                    max={producto.stock}
                    value={cantidad}
                    onChange={(e) => cambiarCantidad(producto.id, Number(e.target.value))}
                  />
                </td>
                <td>{formatoMoneda(producto.precio * cantidad)}</td>
                <td>
                  <button className="btn btn-ghost" onClick={() => quitar(producto.id)}>
                    Quitar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="resumen">
        <p>
          Total: <strong>{formatoMoneda(total)}</strong>
        </p>
        <div className="acciones">
          <button className="btn btn-ghost" onClick={vaciar}>
            Vaciar carrito
          </button>
          <button className="btn" onClick={confirmar} disabled={enviando}>
            {enviando ? "Procesando..." : usuario ? "Confirmar pedido" : "Inicia sesión para comprar"}
          </button>
        </div>
      </div>
    </section>
  );
}
