import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { usuario, esAdmin, esGestor, gestionaPedidos, activo, logout } = useAuth();
  const { cantidadTotal } = useCart();
  const navigate = useNavigate();
  const bloqueado = usuario && !activo;

  const salir = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <NavLink to="/" className="marca">
        Pablo <span>Store</span>
      </NavLink>

      <nav>
        {!bloqueado && (
          <>
            <NavLink to="/">Productos</NavLink>
            {!esGestor && (
              <NavLink to="/carrito">
                Carrito {cantidadTotal > 0 && <span className="insignia">{cantidadTotal}</span>}
              </NavLink>
            )}
            {usuario && <NavLink to="/pedidos">{gestionaPedidos ? "Pedidos" : "Mis pedidos"}</NavLink>}
            {esAdmin && <NavLink to="/usuarios">Usuarios</NavLink>}
          </>
        )}
      </nav>

      <div className="sesion">
        {usuario ? (
          <>
            <span className="usuario">
              {usuario.nombre} {activo && esAdmin && <span className="rol">admin</span>}
              {activo && esGestor && <span className="rol">gestor</span>}
            </span>
            <button className="btn btn-ghost" onClick={salir}>
              Salir
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="btn btn-ghost">
              Entrar
            </NavLink>
            <NavLink to="/registro" className="btn btn-claro">
              Registrarse
            </NavLink>
          </>
        )}
      </div>
    </header>
  );
}
