import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { usuario, esAdmin, logout } = useAuth();
  const { cantidadTotal } = useCart();
  const navigate = useNavigate();

  const salir = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <NavLink to="/" className="marca">
        Taller<span>3</span> Store
      </NavLink>

      <nav>
        <NavLink to="/">Catálogo</NavLink>
        <NavLink to="/carrito">
          Carrito {cantidadTotal > 0 && <span className="insignia">{cantidadTotal}</span>}
        </NavLink>
        {usuario && <NavLink to="/pedidos">{esAdmin ? "Pedidos" : "Mis pedidos"}</NavLink>}
      </nav>

      <div className="sesion">
        {usuario ? (
          <>
            <span className="usuario">
              {usuario.nombre} {esAdmin && <span className="rol">admin</span>}
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
            <NavLink to="/registro" className="btn">
              Registrarse
            </NavLink>
          </>
        )}
      </div>
    </header>
  );
}
