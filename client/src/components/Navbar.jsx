import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, logout } from "../features/auth/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const count = useSelector((state) => state.posts.items.length);
  const ticker = "Annonces • Événements • Idées • Témoignages • ";

  return (
    <header>
      <div className="ticker" aria-hidden="true"><span>{ticker.repeat(16)}</span></div>
      <nav className="nav wrap">
        <Link to="/" className="logo">le tableau<i>.</i></Link>
        <div className="nav-right">
          <span className="who">{count} épingles</span>
          {user ? (
            <>
              <span className="who">{user.name}</span>
              <button className="btn ghost" onClick={() => { dispatch(logout()); navigate("/"); }}>Se déconnecter</button>
            </>
          ) : (
            <Link to="/auth" className="btn">Rejoindre le club</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
