import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { mensajeDeError } from "../../services/api";
import Alerta from "../../components/Alerta";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const enviar = async (e) => {
    e.preventDefault();
    setError("");
    setEnviando(true);
    try {
      await login(form.email, form.password);
      navigate(location.state?.desde ?? "/", { replace: true });
    } catch (err) {
      setError(mensajeDeError(err));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="auth">
      <form className="tarjeta formulario" onSubmit={enviar}>
        <h1>Iniciar sesión</h1>
        <Alerta>{error}</Alerta>

        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={cambiar} required autoComplete="email" />
        </label>
        <label>
          Contraseña
          <input type="password" name="password" value={form.password} onChange={cambiar} required autoComplete="current-password" />
        </label>

        <button className="btn btn-bloque" disabled={enviando}>
          {enviando ? "Entrando..." : "Entrar"}
        </button>
        <p className="nota">
          ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </form>
    </section>
  );
}
