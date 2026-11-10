import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getComments, createComment, deleteComment } from "../../api/commentService";
import { selectUser } from "../auth/authSlice";
import { setComments, addComment, removeComment, clearComments } from "./commentsSlice";

export default function CommentSection({ postId }) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const comments = useSelector((state) => state.comments.items);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getComments(postId)
      .then((data) => dispatch(setComments(data)))
      .catch(() => setError("Commentaires indisponibles."));
    return () => dispatch(clearComments()); // nettoyage en quittant la page
  }, [postId, dispatch]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      dispatch(addComment(await createComment({ text, post: postId })));
      setText("");
    } catch (err) {
      setError(err.response?.data?.message || "Envoi impossible.");
    }
  };

  const handleRemove = async (id) => {
    try {
      await deleteComment(id);
      dispatch(removeComment(id));
    } catch (err) {
      setError(err.response?.data?.message || "Suppression impossible.");
    }
  };

  return (
    <section className="comments">
      <h2>{comments.length} {comments.length > 1 ? "réponses" : "réponse"}</h2>
      {comments.length === 0 && <p className="muted">Personne n’a encore répondu. Lance la discussion.</p>}
      {comments.map((c) => (
        <div className="note" key={c._id}>
          <p>{c.text}</p>
          <small>
            {c.author?.name || "ancien membre"}
            {user && c.author?._id === user.id && (
              <button className="link-danger" onClick={() => handleRemove(c._id)}>Supprimer</button>
            )}
          </small>
        </div>
      ))}
      {error && <p className="error">{error}</p>}
      {user ? (
        <form className="reply" onSubmit={handleAdd}>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ta réponse" maxLength={300} required />
          <button className="btn">Répondre</button>
        </form>
      ) : (
        <p className="muted"><Link to="/auth">Connecte-toi</Link> pour répondre.</p>
      )}
    </section>
  );
}
