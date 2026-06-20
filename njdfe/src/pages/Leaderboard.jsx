import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";
import { mediaUrl } from "../api/media";

const POS = { GK: "GK", DEF: "DEF", MID: "MID", FWD: "FWD" };
const PAGE_SIZE = 10;

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("goals");
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.get("/players/all/")
      .then(r => setPlayers(r.data.results ?? r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const TABS = [
    { key: "goals",         label: "⚽ Top Scorers" },
    { key: "assists",       label: "🎯 Top Assists" },
    { key: "matches_played",label: "📅 Most Apps" },
  ];

  const filtered = players
    .filter(p => p.user?.username?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (b[tab] || 0) - (a[tab] || 0));

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <h1>Leaderboard</h1>
          <p>Top performers of Nanjanad FC</p>
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

          {/* Tabs */}
          <div className="filter-tabs" style={{ marginBottom: 28 }}>
            {TABS.map(t => (
              <button
                key={t.key}
                className={`filter-tab ${tab === t.key ? "active" : ""}`}
                onClick={() => { setTab(t.key); setPage(1); }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {loading && <p className="loading">Loading leaderboard…</p>}
          {!loading && filtered.length === 0 && <p className="empty">No players found.</p>}

          {!loading && paginated.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <table className="lb-table">
                <thead>
                  <tr>
                    <th style={{ width: 50 }}>#</th>
                    <th>Player</th>
                    <th>Position</th>
                    <th>⚽ Goals</th>
                    <th>🎯 Assists</th>
                    <th>📅 Apps</th>
                    <th>🟨 Yellow</th>
                    <th>🟥 Red</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((p, i) => {
                    const rank = (page - 1) * PAGE_SIZE + i + 1;
                    return (
                      <motion.tr
                        key={p.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <td>
                          <span className={`lb-rank ${rank <= 3 ? "top" : ""}`}>
                            {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            {p.photo
                              ? <img src={mediaUrl(p.photo)} alt="" style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover" }} />
                              : <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--black3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>👤</div>
                            }
                            <div>
                              <div className="lb-name">{p.user?.username}</div>
                              <div style={{ fontSize: "0.72rem", color: "var(--gray)" }}>#{p.jersey_number}</div>
                            </div>
                          </div>
                        </td>
                        <td><span className="pos-tag" style={{ fontSize: "0.7rem" }}>{POS[p.position] || p.position}</span></td>
                        <td style={{ color: tab === "goals" ? "var(--gold)" : "var(--text)", fontWeight: tab === "goals" ? 700 : 400 }}>{p.goals}</td>
                        <td style={{ color: tab === "assists" ? "var(--gold)" : "var(--text)", fontWeight: tab === "assists" ? 700 : 400 }}>{p.assists}</td>
                        <td style={{ color: tab === "matches_played" ? "var(--gold)" : "var(--text)", fontWeight: tab === "matches_played" ? 700 : 400 }}>{p.matches_played}</td>
                        <td>{p.yellow_cards}</td>
                        <td>{p.red_cards}</td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                    <button key={n} className={page === n ? "active" : ""} onClick={() => setPage(n)}>{n}</button>
                  ))}
                  <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>›</button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
