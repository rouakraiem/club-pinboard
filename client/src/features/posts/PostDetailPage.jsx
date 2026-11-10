import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPost, updatePostById, deletePost } from "../../api/postService";
import { selectUser } from "../auth/authSlice";
import { setSelected, updatePost, removePost } from "./postsSlice";
import CommentSection from "../comments/CommentSection";
import { POST_TYPES } from "../../utils/postTypes";
import { formatDate } from "../../utils/formatDate";


export default function PostDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const selected = useSelector((state) => state.posts.selected);

  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", eventDate: "" });
  const [saveError, setSaveError] = useState("");

  // On ignore une publication restée en mémoire si ce n est pas celle de l URL
  const post = selected && selected._id === id ? selected : null;

  useEffect(() => {
    dispatch(setSelected(null));
    getPost(id)
      .then((data) => dispatch(setSelected(data)))
      .catch(() => setError("Cette publication n’existe plus."));
  }, [id, dispatch]);

  const handleRemove = async () => {
    if (!window.confirm("Retirer cette publication ?")) return;
    await deletePost(id);
    dispatch(removePost(id));
    navigate("/");
  };

  const startEdit = () => {
    setForm({
      title: post.title,
      content: post.content,
      eventDate: post.eventDate ? post.eventDate.slice(0, 10) : "",
    });
    setSaveError("");
    setEditing(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      dispatch(updatePost(await updatePostById(id, form))); // met à jour liste + détail
      setEditing(false);
    } catch (err) {
      setSaveError(err.response?.data?.message || "Modification impossible.");
    }
  };

  if (error) return <p className="onblue">{error} <Link to="/">Retour au tableau</Link></p>;
  if (!post) return <p className="onblue">Chargement…</p>;

  const type = POST_TYPES[post.type];
  const isAuthor = user && post.author?._id === user.id;

  return (
    <div className="detail">
      <Link to="/" className="back">Retour au tableau</Link>

      {editing ? (
        <form className="composer" onSubmit={handleSave}>
          <h2>Modifier la publication</h2>
          <input name="title" value={form.title} onChange={handleChange} maxLength={90} required />
          {post.type === "evenement" && (
            <input type="date" name="eventDate" value={form.eventDate} onChange={handleChange} required />
          )}
          <textarea name="content" rows="6" value={form.content} onChange={handleChange} maxLength={1000} required />
          {saveError && <p className="error">{saveError}</p>}
          <button className="btn">Enregistrer</button>
          <button type="button" className="link" onClick={() => setEditing(false)}>Annuler</button>
        </form>
      ) : (
        <article className="sheet big">
          <span className="tape" />
          <span className="tag" style={{ background: type.color }}>{type.label}</span>
          <h1>{post.title}</h1>
          {post.eventDate && <p className="when">Le {formatDate(post.eventDate)}</p>}
          <p className="body">{post.content}</p>
          <footer>
            <span>par {post.author?.name || "ancien membre"}, publié le {formatDate(post.createdAt)}</span>
            {isAuthor && (
              <span>
                <button className="link" onClick={startEdit}>Modifier</button>
                <button className="link-danger" onClick={handleRemove}>Retirer du tableau</button>
              </span>
            )}
          </footer>
        </article>
      )}

      <CommentSection postId={id} />
    </div>
  );
}
