import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";
import { mediaUrl } from "../api/media";

const PAGE_SIZE = 6;

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [tab, setTab] = useState("upcoming");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true); setPage(1);
    api.get(`/matches/?status=${tab}`)
      .then(r => setMatches(r.data.results ?? r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tab]);

  const filtered = matches.filter(m => m.opponent.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <h1>Matches</h1>
          <p>Fixtures, Results & Match Summaries</p>
        </div>
      </div>
      <div className="page">
        <div className="container">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input placeholder="Search by opponent…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <div className="filter-tabs">
            <button className={`filter-tab ${tab === "upcoming" ? "active" : ""}`} onClick={() => setTab("upcoming")}>Upcoming</button>
            <button className={`filter-tab ${tab === "played" ? "active" : ""}`} onClick={() => setTab("played")}>Results</button>
          </div>
          {loading && <p className="loading">Loading…</p>}
          {!loading && filtered.length === 0 && <p className="empty">No matches found.</p>}
          <div className="grid g2">
            {paginated.map((m, i) => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="card match-card">
                <div className="card-body">
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <span className={`tag tag-${m.status}`}>{m.status}</span>
                    {m.competition && <span style={{ fontSize: "0.75rem", color: "var(--gray)" }}>🏆 {m.competition}</span>}
                  </div>
                  <div className="match-vs" style={{ marginBottom: 4 }}>vs {m.opponent}</div>
                  {m.status === "played" && m.summary && (
                    <div className="match-score">{m.summary.home_score} — {m.summary.away_score}</div>
                  )}
                  <p className="meta" style={{ marginTop: 10 }}>
                    📅 {new Date(m.date).toLocaleString("en-IN")}<br />
                    📍 {m.venue}
                  </p>
                  {m.status === "played" && m.summary && (
                    <button className="btn btn-dark btn-sm" style={{ marginTop: 14 }}
                      onClick={() => setExpanded(expanded === m.id ? null : m.id)}>
                      {expanded === m.id ? "Hide Summary ▲" : "Match Summary ▼"}
                    </button>
                  )}
                  {expanded === m.id && m.summary && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="summary-box">
                      <div className="summary-row"><span className="summary-label">Possession</span><span className="summary-val">{m.summary.possession}%</span></div>
                      <div className="summary-row"><span className="summary-label">Shots on Target</span><span className="summary-val">{m.summary.shots_on_target}</span></div>
                      <div className="summary-row"><span className="summary-label">Fouls</span><span className="summary-val">{m.summary.fouls}</span></div>
                      {m.summary.man_of_the_match && <div className="summary-row"><span className="summary-label">⭐ MOTM</span><span className="summary-val text-gold">{m.summary.man_of_the_match}</span></div>}
                      {m.summary.scorers?.length > 0 && <div style={{ marginTop: 10 }}><div style={{ color: "var(--gold)", fontSize: "0.75rem", marginBottom: 6 }}>⚽ SCORERS</div>{m.summary.scorers.map((s, i) => <div key={i} style={{ fontSize: "0.85rem", color: "var(--text)" }}>{s.player} <span style={{ color: "var(--gray)" }}>{s.minute}'</span></div>)}</div>}
                      {m.summary.assists?.length > 0 && <div style={{ marginTop: 10 }}><div style={{ color: "var(--gold)", fontSize: "0.75rem", marginBottom: 6 }}>🎯 ASSISTS</div>{m.summary.assists.map((a, i) => <div key={i} style={{ fontSize: "0.85rem" }}>{a.player} <span style={{ color: "var(--gray)" }}>{a.minute}'</span></div>)}</div>}
                      {m.photos?.length > 0 && <div style={{ marginTop: 14 }}><div style={{ color: "var(--gold)", fontSize: "0.75rem", marginBottom: 8 }}>📸 PHOTOS</div><div className="grid g3">{m.photos.map(ph => <img key={ph.id} src={mediaUrl(ph.image)} alt="" style={{ borderRadius: 4, height: 80, objectFit: "cover", width: "100%" }} />)}</div></div>}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => <button key={n} className={page === n ? "active" : ""} onClick={() => setPage(n)}>{n}</button>)}
              <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>›</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
