import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function Home() {
  const [nextMatch, setNextMatch] = useState(null);
  const [news, setNews] = useState([]);

  useEffect(() => {
    api.get("/matches/?status=upcoming").then(r => {
      const list = r.data.results ?? r.data;
      if (list.length) setNextMatch(list[0]);
    }).catch(() => {});
    api.get("/news/").then(r => {
      setNews((r.data.results ?? r.data).slice(0, 3));
    }).catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <h1>⚽ Nanjanad Football Club</h1>
          <p>Siva Memorial Recreation Club, Nanjanad — Passion. Pride. Football.</p>
          <div className="hero-btns">
            <Link to="/players" className="btn btn-gold">Meet the Squad</Link>
            <Link to="/matches" className="btn btn-outline">View Fixtures</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="stats-bar">
        {[["120+","Matches Played"],["15","Trophies Won"],["35+","Active Players"],["10+","Years of Legacy"]].map(([n,l])=>(
          <div className="stat-item" key={l}>
            <div className="stat-num">{n}</div>
            <div className="stat-lbl">{l}</div>
          </div>
        ))}
      </div>

      {/* Next match */}
      {nextMatch && (
        <section className="section" style={{background:"var(--white)"}}>
          <div className="container text-center">
            <h2 className="section-title">Next Match</h2>
            <div className="card" style={{maxWidth:420,margin:"0 auto"}}>
              <div className="card-body">
                <span className="tag tag-upcoming">Upcoming</span>
                <h3 style={{margin:"10px 0"}}>vs {nextMatch.opponent}</h3>
                <p className="meta">
                  📅 {new Date(nextMatch.date).toLocaleString()}<br/>
                  📍 {nextMatch.venue}{nextMatch.competition ? ` · 🏆 ${nextMatch.competition}` : ""}
                </p>
                <Link to="/matches" className="btn btn-primary" style={{marginTop:14}}>All Fixtures</Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* News */}
      {news.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">Latest News</h2>
            <div className="grid g3">
              {news.map(n => (
                <div className="card" key={n.id}>
                  {n.image && <img className="card-img" src={n.image} alt={n.title}/>}
                  <div className="card-body">
                    <h3>{n.title}</h3>
                    <p className="meta" style={{margin:"4px 0 8px"}}>{new Date(n.date).toLocaleDateString()}</p>
                    <p style={{fontSize:".88rem",color:"var(--muted)"}}>{n.content.slice(0,100)}…</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About strip */}
      <section className="section text-center" style={{background:"var(--white)"}}>
        <div className="container">
          <h2 className="section-title">About the Club</h2>
          <p style={{maxWidth:680,margin:"0 auto",color:"var(--muted)"}}>
            Nanjanad FC has been nurturing local football talent and building community spirit
            through the beautiful game since its founding under Siva Memorial Recreation Club.
          </p>
          <Link to="/about" className="btn btn-outline" style={{marginTop:18}}>Learn More</Link>
        </div>
      </section>
    </div>
  );
}
