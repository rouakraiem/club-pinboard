import { useState } from "react";
import { useDispatch } from "react-redux";
import { createPost } from "../../api/postService";
import { addPost } from "./postsSlice";
import { POST_TYPES } from "../../utils/postTypes";

const EMPTY = { type: "annonce", title: "", content: "", eventDate: "" };

export default function PostForm() {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const created = await createPost(form);
      dispatch(addPost(created));   // ranger dans le store Redux
      setForm(EMPTY);
    } catch (err) {
      setError(err.response?.data?.message || "Publication impossible, réessaie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="composer" onSubmit={handleSubmit}>
      <h2>Épingler quelque chose</h2>
      <div className="chips">
        {Object.entries(POST_TYPES).map(([key, t]) => (
          <label key={key} className={form.type === key ? "chip on" : "chip"} style={{ "--c": t.color }}>
            <input type="radio" name="type" value={key} checked={form.type === key} onChange={handleChange} />
            {t.label}
          </label>
        ))}
      </div>
      <input name="title" placeholder="Titre" value={form.title} onChange={handleChange} maxLength={90} required />
      {form.type === "evenement" && (
        <input type="date" name="eventDate" value={form.eventDate} onChange={handleChange} required />
      )}
      <textarea name="content" rows="4" placeholder="Dis-nous tout…" value={form.content} onChange={handleChange} maxLength={1000} required />
      {error && <p className="error">{error}</p>}
      <button className="btn" disabled={loading}>{loading ? "Envoi…" : "Publier"}</button>
    </form>
  );
}
