import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";
import { mediaUrl } from "../api/media";
 
const POS = { GK: "Goalkeeper", DEF: "Defender", MID: "Midfielder", FWD: "Forward" };
const PAGE_SIZE = 12;
 
export default function Players() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lightbox, setLightbox] = useState(null);
 
  useEffect(() => {
    api.get("/players/all/")
      .then(r => setPlayers(r.data.results ?? r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
 
  const filtered = players
    .filter(p => filter === "ALL" || p.position === filter)
    .filter(p => p.user?.username?.toLowerCase().includes(search.toLowerCase()));
 
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
 
  return (
    <div>
      {/* ── LIGHTBOX ── */}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <div>
            <img src={lightbox.image} alt={lightbox.name} />
            <p>{lightbox.name}</p>
          </div>
        </div>
      )}
 
      <div className="page-hero">
        <div className="container">
          <h1>Our Squad</h1>
          <p>The players of Nanjanad Football Club</p>
        </div>
      </div>
 
      <div className="page">
        <div className="container">
          {/* Search */}
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              placeholder="Search player by name…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
 
          {/* Position filter */}
          <div className="filter-tabs">
            {["ALL", "GK", "DEF", "MID", "FWD"].map(p => (
              <button key={p} className={`filter-tab ${filter === p ? "active" : ""}`}
                onClick={() => { setFilter(p); setPage(1); }}>
                {p === "ALL" ? "All" : POS[p]}
              </button>
            ))}
          </div>
 
          {loading && <p className="loading">Loading squad…</p>}
          {!loading && filtered.length === 0 && <p className="empty">No players found.</p>}
 
          <div className="grid g4">
            {paginated.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className="player-card-wrap"
              >
                <div className="card player-card-inner" style={{ position: "relative" }}>
                  {p.photo
                    ? <img
                        className="card-img"
                        src={mediaUrl(p.photo)}
                        alt={p.user?.username}
                        style={{ height: 220, cursor: "zoom-in", position: "relative", zIndex: 2 }}
                        onClick={() => setLightbox({ image: mediaUrl(p.photo), name: p.user?.username })}
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
 
          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button key={n} className={page === n ? "active" : ""} onClick={() => setPage(n)}>{n}</button>
              ))}
              <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>›</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}