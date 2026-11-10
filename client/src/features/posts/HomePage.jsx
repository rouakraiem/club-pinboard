import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../../api/postService";
import { selectUser } from "../auth/authSlice";
import { setPosts, setLoading, setError } from "./postsSlice";
import PostCard from "./PostCard";
import PostForm from "./PostForm";
import { POST_TYPES } from "../../utils/postTypes";

export default function HomePage() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { items, loading, error } = useSelector((state) => state.posts); // état global
  const [filter, setFilter] = useState(""); // état local : filtre actif

  const loadPosts = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setPosts(await getPosts()));
    } catch {
      dispatch(setError("Le serveur ne répond pas. Réessaie dans quelques secondes."));
    }
  };

  useEffect(() => { loadPosts(); }, []);

  const visible = filter ? items.filter((p) => p.type === filter) : items;

  return (
    <>
      <section className="hero">
        <h1>Tout ce qui se passe au club, <span>épinglé ici.</span></h1>
        <p>Annonces, soirées, idées en vrac et mots des membres. Lis librement, publie quand tu es connecté.</p>
      </section>

      <div className="layout">
        <div>
          <div className="chips filters">
            <button className={!filter ? "chip on" : "chip"} onClick={() => setFilter("")}>Tout</button>
            {Object.entries(POST_TYPES).map(([key, t]) => (
              <button key={key} className={filter === key ? "chip on" : "chip"} style={{ "--c": t.color }} onClick={() => setFilter(key)}>
                {t.label}
              </button>
            ))}
          </div>

          {loading && <p className="onblue">Chargement du tableau…</p>}
          {error && (
            <p className="error onblue">{error} <button className="link" style={{ color: "#fff" }} onClick={loadPosts}>Réessayer</button></p>
          )}
          {!loading && !error && visible.length === 0 && <p className="onblue">Rien d’épinglé ici pour l’instant.</p>}

          <div className="board">
            {visible.map((p, i) => <PostCard key={p._id} post={p} index={i} />)}
          </div>
        </div>

        <aside>
          {user ? (
            <PostForm />
          ) : (
            <div className="composer visitor">
              <h2>Tu regardes en visiteur</h2>
              <p>Crée un compte pour publier, répondre et retirer tes propres épingles.</p>
              <Link to="/auth" className="btn">Rejoindre le club</Link>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
