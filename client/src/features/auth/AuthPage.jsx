import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, register } from "../../api/authService";
import { loginSuccess } from "./authSlice";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const data = mode === "login" ? await login(form) : await register(form);
      dispatch(loginSuccess(data)); // user + token -> Redux + localStorage
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Serveur injoignable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="composer auth" onSubmit={handleSubmit}>
      <h2>{mode === "login" ? "Content de te revoir" : "Rejoindre le club"}</h2>
      {mode === "register" && (
        <input name="name" placeholder="Ton prénom ou pseudo" value={form.name} onChange={handleChange} required />
      )}
      <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input type="password" name="password" placeholder="Mot de passe (6 caractères min.)" value={form.password} onChange={handleChange} required />
      {error && <p className="error">{error}</p>}
      <button className="btn" disabled={loading}>
        {loading ? "Vérification…" : mode === "login" ? "Se connecter" : "Créer mon compte"}
      </button>
      <button type="button" className="link" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>
        {mode === "login" ? "Pas encore membre ? Crée ton compte" : "Déjà membre ? Connecte-toi"}
      </button>
    </form>
  );
}
