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

  // Al abrir la app, si hay un token guardado se recupera la sesión.
  useEffect(() => {
    if (!tokenStorage.get()) {
      setCargando(false);
      return;
    }
    authApi
      .perfil()
      .then(setUsuario)
      .catch(logout)
      .finally(() => setCargando(false));
  }, [logout]);

  // Si el backend responde 401 (token expirado), se cierra la sesión.
  useEffect(() => {
    window.addEventListener("auth:expired", logout);
    return () => window.removeEventListener("auth:expired", logout);
  }, [logout]);

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

  const valor = { usuario, cargando, esAdmin: usuario?.rol === "admin", login, registro, logout };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
