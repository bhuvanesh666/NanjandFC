import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">Nanjanad FC</div>
            <p className="footer-desc">Siva Memorial Recreation Club, Nanjanad.<br/>Building champions on and off the pitch.</p>
          </div>
          <div>
            <div className="footer-heading">Quick Links</div>
            <ul className="footer-links">
              {[["Home","/"],["Players","/players"],["Matches","/matches"],["Gallery","/gallery"],["News","/news"],["Contact","/contact"]].map(([l,h])=>(
                <li key={l}><Link to={h}>{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="footer-heading">Club</div>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/leaderboard">Leaderboard</Link></li>
              <li><Link to="/register">Join the Club</Link></li>
              <li><Link to="/login">Player Login</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} Nanjanad Football Club — Siva Memorial Recreation Club, Nanjanad. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
