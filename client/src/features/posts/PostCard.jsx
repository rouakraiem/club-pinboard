import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deletePost } from "../../api/postService";
import { selectUser } from "../auth/authSlice";
import { removePost } from "./postsSlice";
import { POST_TYPES } from "../../utils/postTypes";
import { formatDate } from "../../utils/formatDate";

export default function PostCard({ post, index }) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const type = POST_TYPES[post.type];
  const tilt = [-1.4, 0.8, -0.5, 1.3][index % 4];
  const isAuthor = user && post.author?._id === user.id;

  const handleDelete = async () => {
    if (!window.confirm("Retirer cette publication du tableau ?")) return;
    try {
      await deletePost(post._id);        // 1. suppression sur Express (JWT via intercepteur)
      dispatch(removePost(post._id));    // 2. retrait du store Redux
    } catch (err) {
      alert(err.response?.data?.message || "Action non autorisée.");
    }
  };

  return (
    <article className="sheet" style={{ "--tilt": `${tilt}deg` }}>
      <span className="tape" />
      <span className="tag" style={{ background: type.color }}>{type.label}</span>
      <h3><Link to={`/post/${post._id}`}>{post.title}</Link></h3>
      {post.eventDate && <p className="when">Le {formatDate(post.eventDate)}</p>}
      <p className="excerpt">{post.content.length > 140 ? post.content.slice(0, 140) + "…" : post.content}</p>
      <footer>
        <span>par {post.author?.name || "ancien membre"}</span>
        {isAuthor && <button className="link-danger" onClick={handleDelete}>Retirer du tableau</button>}
      </footer>
    </article>
  );
}
