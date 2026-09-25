import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { authApi, tokenStorage } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setUsuario(null);
  }, []);

  // Vuelve a consultar el perfil para conocer el rol y el estado actuales de la cuenta.
  const refrescar = useCallback(async () => {
    if (!tokenStorage.get()) return;
    try {
      setUsuario(await authApi.perfil());
    } catch {
      logout();
    }
  }, [logout]);

  // Al abrir la app, si hay un token guardado se recupera la sesión.
  useEffect(() => {
    refrescar().finally(() => setCargando(false));
  }, [refrescar]);

  // 401: sesión expirada o eliminada. 403: la cuenta pudo cambiar de estado o de rol.
  useEffect(() => {
    window.addEventListener("auth:expired", logout);
    window.addEventListener("auth:refrescar", refrescar);
    return () => {
      window.removeEventListener("auth:expired", logout);
      window.removeEventListener("auth:refrescar", refrescar);
    };
  }, [logout, refrescar]);

  const login = async (email, password) => {
    const { token, usuario: datos } = await authApi.login({ email, password });
    tokenStorage.set(token);
    setUsuario(datos);
    return datos;
  };

  const registro = async ({ nombre, email, password }) => {
    await authApi.registro({ nombre, email, password });
    return login(email, password);
  };

  const valor = {
    usuario,
    cargando,
    esAdmin: usuario?.rol === "admin",
    activo: usuario?.estado === "activo",
    login,
    registro,
    logout,
    refrescar,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
