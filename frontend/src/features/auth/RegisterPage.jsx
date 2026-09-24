import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { mensajeDeError } from "../../services/api";
import Alerta from "../../components/Alerta";

export default function RegisterPage() {
  const { registro } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: "", email: "", password: "", confirmar: "" });
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const enviar = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmar) return setError("Las contraseñas no coinciden");

    setEnviando(true);
    try {
      await registro(form);
      navigate("/", { replace: true });
    } catch (err) {
      setError(mensajeDeError(err));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="auth">
      <form className="tarjeta formulario" onSubmit={enviar}>
        <h1>Crear cuenta</h1>
        <Alerta>{error}</Alerta>

        <label>
          Nombre
          <input name="nombre" value={form.nombre} onChange={cambiar} required minLength={2} autoComplete="name" />
        </label>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={cambiar} required autoComplete="email" />
        </label>
        <label>
          Contraseña
          <input type="password" name="password" value={form.password} onChange={cambiar} required minLength={8} autoComplete="new-password" />
          <small>Mínimo 8 caracteres, con letras y números.</small>
        </label>
        <label>
          Confirmar contraseña
          <input type="password" name="confirmar" value={form.confirmar} onChange={cambiar} required autoComplete="new-password" />
        </label>

        <button className="btn btn-bloque" disabled={enviando}>
          {enviando ? "Creando cuenta..." : "Registrarme"}
        </button>
        <p className="nota">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </section>
  );
}
