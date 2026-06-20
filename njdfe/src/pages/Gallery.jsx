import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";
import { mediaUrl } from "../api/media";

export default function Gallery() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lb, setLb] = useState(null);

  useEffect(() => {
    api.get("/gallery/albums/").then(r => setAlbums(r.data.results ?? r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-hero"><div className="container"><h1>Gallery</h1><p>Club moments, trophies and memories</p></div></div>
      <div className="page"><div className="container">
        {loading && <p className="loading">Loading gallery…</p>}
        {!loading && albums.length === 0 && <p className="empty">No albums yet.</p>}
        {albums.map((album, ai) => (
          <motion.div key={album.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5, delay: ai * 0.1 }} style={{ marginBottom: 50 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <div>
                <h2 style={{ color: "var(--white)", fontSize: "1.8rem" }}>{album.title}</h2>
                <span style={{ color: "var(--gold)", fontSize: "0.8rem", letterSpacing: 2 }}>{album.year} · {album.images?.length || 0} Photos</span>
              </div>
            </div>
            {!album.images?.length ? <p className="empty" style={{ padding: "20px 0" }}>No images yet.</p> :
              <div className="grid g4">
                {album.images.map((img, ii) => (
                  <motion.div key={img.id} className="card" style={{ cursor: "zoom-in", overflow: "hidden" }}
                    initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: ii * 0.05 }}
                    onClick={() => setLb(img)}>
                    <img className="card-img" src={mediaUrl(img.image)} alt={img.caption} style={{ height: 160, transition: "transform 0.4s" }}
                      onMouseOver={e => e.target.style.transform = "scale(1.08)"}
                      onMouseOut={e => e.target.style.transform = "scale(1)"} />
                    {img.caption && <div className="card-body" style={{ padding: "8px 12px", fontSize: "0.8rem", color: "var(--gray)" }}>{img.caption}</div>}
                  </motion.div>
                ))}
              </div>
            }
          </motion.div>
        ))}
        {lb && (
          <div className="lightbox" onClick={() => setLb(null)}>
            <div><img src={mediaUrl(lb.image)} alt={lb.caption} />{lb.caption && <p>{lb.caption}</p>}</div>
          </div>
        )}
      </div></div>
    </div>
  );
}
