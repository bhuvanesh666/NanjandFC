import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import { mediaUrl } from "../api/media";
import HeroCanvas from "../three/HeroCanvas";

function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

function StatCounter({ num, label, suffix = "" }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const count = useCounter(num, 1800, visible);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="stat-item" ref={ref}>
      <div className="stat-num">{count}{suffix}</div>
      <div className="stat-lbl">{label}</div>
    </div>
  );
}

export default function Home() {
  const [nextMatch, setNextMatch] = useState(null);
  const [news, setNews] = useState([]);
  const [players, setPlayers] = useState([]);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    api.get("/matches/?status=upcoming").then(r => {
      const list = r.data.results ?? r.data;
      if (list.length) setNextMatch(list[0]);
    }).catch(() => {});
    api.get("/news/").then(r => setNews((r.data.results ?? r.data).slice(0, 3))).catch(() => {});
    api.get("/players/all/").then(r => setPlayers((r.data.results ?? r.data).slice(0, 4))).catch(() => {});
  }, []);

  const POS = { GK: "Goalkeeper", DEF: "Defender", MID: "Midfielder", FWD: "Forward" };

  return (
    <div>
      {/* ── LIGHTBOX ── */}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <div>
            <img src={lightbox.image} alt={lightbox.title} />
            <p>{lightbox.title}</p>
          </div>
        </div>
      )}

      {/* ── HERO ── */}
      <section className="hero">
        <HeroCanvas />
        <div className="hero-overlay" />
        <div className="hero-content">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="hero-badge">Est. Nanjanad, Tamilnadu</div>
            <h1>NANJANAD <span>FC</span></h1>
            <p className="hero-sub">Siva Memorial Recreation Club · Passion · Pride · Football</p>
            <div className="hero-btns">
              <Link to="/players" className="btn btn-gold">Meet the Squad</Link>
              <Link to="/matches" className="btn btn-outline">View Fixtures</Link>
            </div>
          </motion.div>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-line" />
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            <StatCounter num={120} suffix="+" label="Matches Played" />
            <StatCounter num={15} label="Trophies Won" />
            <StatCounter num={35} suffix="+" label="Active Players" />
            <StatCounter num={10} suffix="+" label="Years of Legacy" />
          </div>
        </div>
      </section>

      {/* ── NEXT MATCH ── */}
      {nextMatch && (
        <section className="section section-alt">
          <div className="container text-center">
            <div className="section-header">
              <div className="section-tag">⚡ Upcoming</div>
              <h2 className="section-title">Next Match</h2>
              <div className="section-line" />
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{ maxWidth: 480, margin: "0 auto" }}
            >
              <div className="card match-card">
                <div className="card-body" style={{ textAlign: "center", padding: 32 }}>
                  <span className="tag tag-upcoming" style={{ marginBottom: 16, display: "inline-block" }}>Upcoming</span>
                  <div className="match-vs" style={{ fontSize: "1.2rem", color: "var(--gray)", marginBottom: 4 }}>Nanjanad FC vs</div>
                  <div className="match-vs" style={{ fontSize: "2rem" }}>{nextMatch.opponent}</div>
                  <div style={{ margin: "20px 0", padding: "16px 0", borderTop: "1px solid var(--border2)", borderBottom: "1px solid var(--border2)" }}>
                    <p className="meta">📅 {new Date(nextMatch.date).toLocaleString("en-IN")}</p>
                    <p className="meta">📍 {nextMatch.venue}{nextMatch.competition ? ` · 🏆 ${nextMatch.competition}` : ""}</p>
                  </div>
                  <Link to="/matches" className="btn btn-gold">All Fixtures</Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── FEATURED PLAYERS ── */}
      {players.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <div className="section-tag">⭐ The Squad</div>
              <h2 className="section-title">Featured Players</h2>
              <div className="section-line" />
            </div>
            <div className="grid g4">
              {players.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="player-card-wrap"
                >
                  <div className="card player-card-inner" style={{ position: "relative" }}>
                    {p.photo
  ? <img
      className="card-img"
      src={mediaUrl(p.photo)}
      alt={p.user?.username}
      style={{ height: 220, cursor: "zoom-in", position: "relative", zIndex: 2 }}
      onClick={() => setLightbox({ image: mediaUrl(p.photo), title: p.user?.username })}
    />
  : <div className="card-img" style={{ height: 220, fontSize: "4rem", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--black3)" }}>👤</div>
}
                    <div className="jersey-badge">{p.jersey_number || "—"}</div>
                    <div className="card-body">
                      <div className="pos-tag">{POS[p.position] || p.position}</div>
                      <div className="p-name">{p.user?.username}</div>
                      <div className="p-stats">
                        <div className="p-stat"><div className="p-stat-num">{p.goals}</div><div className="p-stat-lbl">Goals</div></div>
                        <div className="p-stat"><div className="p-stat-num">{p.assists}</div><div className="p-stat-lbl">Assists</div></div>
                        <div className="p-stat"><div className="p-stat-num">{p.matches_played}</div><div className="p-stat-lbl">Apps</div></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-center" style={{ marginTop: 32 }}>
              <Link to="/players" className="btn btn-outline">View Full Squad</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── NEWS ── */}
      {news.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <div className="section-header">
              <div className="section-tag">📰 Latest</div>
              <h2 className="section-title">Club News</h2>
              <div className="section-line" />
            </div>
            <div className="grid g3">
              {news.map((n, i) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="card"
                >
                  {n.image && (
                    <img
                      className="card-img"
                      src={mediaUrl(n.image)}
                      alt={n.title}
                      style={{ cursor: "zoom-in", position: "relative", zIndex: 2 }}
                      onClick={() => setLightbox({ image: mediaUrl(n.image), title: n.title })}
                    />
                  )}
                  <div className="card-body">
                    <div style={{ fontSize: "0.72rem", color: "var(--gold)", letterSpacing: 2, marginBottom: 8 }}>
                      {new Date(n.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                    <h3 style={{ fontSize: "1.1rem", color: "var(--white)", marginBottom: 8 }}>{n.title}</h3>
                    <p style={{ fontSize: "0.85rem", color: "var(--gray)", lineHeight: 1.6 }}>{n.content.slice(0, 100)}…</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-center" style={{ marginTop: 32 }}>
              <Link to="/news" className="btn btn-outline">All News</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="section" style={{ background: "linear-gradient(135deg, var(--black2), var(--black3))", textAlign: "center", borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="section-tag">🏆 Join Us</div>
            <h2 className="section-title" style={{ marginBottom: 16 }}>Be Part of the Legacy</h2>
            <p style={{ color: "var(--gray)", maxWidth: 520, margin: "0 auto 28px", lineHeight: 1.7 }}>
              Nanjanad FC is more than a club — it's a family. Register today and become part of our journey.
            </p>
            <Link to="/register" className="btn btn-gold">Join Nanjanad FC</Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
