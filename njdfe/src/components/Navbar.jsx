import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, isAdmin, isPlayer, logout, user } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => { logout(); nav("/"); };

  return (
    <nav className="navbar">
      <div className="container inner">
        <Link to="/" className="brand">
          <span className="crest">NFC</span>
          Nanjanad FC
        </Link>
        <div className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/players">Players</NavLink>
          <NavLink to="/matches">Matches</NavLink>
          <NavLink to="/gallery">Gallery</NavLink>
          <NavLink to="/news">News</NavLink>
          <NavLink to="/contact">Contact</NavLink>

          {!isAuthenticated && <>
            <NavLink to="/login">Login</NavLink>
            <Link to="/register" className="btn btn-gold btn-sm">Register</Link>
          </>}

          {isAuthenticated && isPlayer &&
            <Link to="/dashboard" className="btn btn-gold btn-sm">My Dashboard</Link>}

          {isAuthenticated && isAdmin &&
            <Link to="/admin" className="btn btn-gold btn-sm">Admin Panel</Link>}

          {isAuthenticated &&
            <button
              onClick={handleLogout}
              className="btn btn-sm"
              style={{ background: "rgba(255,255,255,.15)", color: "#fff", border: "1px solid rgba(255,255,255,.3)" }}
            >
              Logout ({user?.username})
            </button>}
        </div>
      </div>
    </nav>
  );
}
