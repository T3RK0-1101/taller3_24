// Servicio de red aislado: toda comunicación con el backend pasa por aquí.
const BASE_URL = import.meta.env.VITE_API_URL || "/api";
const TOKEN_KEY = "taller3_token";

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  constructor(message, status, detalles = []) {
    super(message);
    this.status = status;
    this.detalles = detalles;
  }
}

async function request(path, { method = "GET", body } = {}) {
  const token = tokenStorage.get();
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const opciones = { method, headers };
  if (body) opciones.body = JSON.stringify(body);

  let respuesta;
  try {
    respuesta = await fetch(`${BASE_URL}${path}`, opciones);
  } catch {
    throw new ApiError("No se pudo conectar con el servidor. ¿Está encendido el backend?", 0);
  }

  if (respuesta.status === 204) return null;

  const datos = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    if (respuesta.status === 401 && token) window.dispatchEvent(new Event("auth:expired"));
    throw new ApiError(datos?.error ?? "Error inesperado del servidor", respuesta.status, datos?.detalles);
  }
  return datos;
}

export const authApi = {
  registro: (datos) => request("/auth/registro", { method: "POST", body: datos }),
  login: (credenciales) => request("/auth/login", { method: "POST", body: credenciales }),
  perfil: () => request("/auth/perfil"),
};

export const productosApi = {
  listar: (busqueda = "") => request(`/productos${busqueda ? `?q=${encodeURIComponent(busqueda)}` : ""}`),
  obtener: (id) => request(`/productos/${id}`),
  crear: (datos) => request("/productos", { method: "POST", body: datos }),
  actualizar: (id, datos) => request(`/productos/${id}`, { method: "PUT", body: datos }),
  eliminar: (id) => request(`/productos/${id}`, { method: "DELETE" }),
};

export const pedidosApi = {
  listar: () => request("/pedidos"),
  obtener: (id) => request(`/pedidos/${id}`),
  crear: (items) => request("/pedidos", { method: "POST", body: { items } }),
  cambiarEstado: (id, estado) => request(`/pedidos/${id}/estado`, { method: "PATCH", body: { estado } }),
  eliminar: (id) => request(`/pedidos/${id}`, { method: "DELETE" }),
};

// Convierte un ApiError en un texto legible para mostrar en pantalla.
export const mensajeDeError = (error) =>
  error?.detalles?.length ? `${error.message}: ${error.detalles.join(". ")}` : error?.message ?? "Error inesperado";

export const formatoMoneda = (valor) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(valor);
