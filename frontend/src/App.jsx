import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import EsperaPage from "./features/auth/EsperaPage";
import CatalogPage from "./features/catalog/CatalogPage";
import CartPage from "./features/orders/CartPage";
import OrdersPage from "./features/orders/OrdersPage";
import UsersPage from "./features/users/UsersPage";

export default function App() {
  const { usuario, activo, cargando } = useAuth();

  if (cargando) return <p className="estado">Cargando...</p>;

  // Una cuenta pendiente o desactivada solo ve la pantalla de espera.
  const bloqueado = usuario && !activo;

  return (
    <>
      <Navbar />
      <main className="contenedor">
        {bloqueado ? (
          <EsperaPage />
        ) : (
          <Routes>
            <Route path="/" element={<CatalogPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
            <Route path="/carrito" element={<CartPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/pedidos" element={<OrdersPage />} />
            </Route>
            <Route element={<ProtectedRoute roles={["admin"]} />}>
              <Route path="/usuarios" element={<UsersPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </main>
    </>
  );
}
