import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";
import { mediaUrl } from "../api/media";

const PAGE_SIZE = 6;

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lightbox, setLightbox] = useState(null); // ADD THIS

  useEffect(() => {
    api.get("/news/").then(r => setNews(r.data.results ?? r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = news.filter(n => n.title.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      
      {/* LIGHTBOX */}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <div>
            <img src={lightbox.image} alt={lightbox.title} />
            <p>{lightbox.title}</p>
          </div>
        </div>
      )}

      <div className="page-hero"><div className="container"><h1>Club News</h1><p>Latest updates from Nanjanad FC</p></div></div>
      <div className="page"><div className="container">
        <div className="search-wrap"><span className="search-icon">🔍</span>
          <input placeholder="Search news…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        {loading && <p className="loading">Loading…</p>}
        {!loading && filtered.length === 0 && <p className="empty">No articles found.</p>}
        <div className="grid g2">
          {paginated.map((n, i) => (
            <motion.div key={n.id} className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              {n.image && (
                <img
                  className="card-img"
                  src={mediaUrl(n.image)}
                  alt={n.title}
                  style={{ cursor: "zoom-in", position: "relative", zIndex: 2 }}
                  onClick={() => setLightbox({ image: mediaUrl(n.image), title: n.title })} // ADD THIS
                />
              )}
              <div className="card-body">
                <div style={{ fontSize: "0.72rem", color: "var(--gold)", letterSpacing: 2, marginBottom: 8 }}>
                  {new Date(n.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </div>
                <h3 style={{ fontSize: "1.15rem", color: "var(--white)", marginBottom: 10 }}>{n.title}</h3>
                <p style={{ fontSize: "0.88rem", color: "var(--gray)", lineHeight: 1.7 }}>{n.content}</p>
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
      </div></div>
    </div>
  );
}