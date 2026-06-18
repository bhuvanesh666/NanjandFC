import { useEffect, useState } from "react";
import api from "../api/axios";

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/news/")
      .then(r => setNews(r.data.results ?? r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Club News</h1>
        <p className="page-sub">Latest updates from Nanjanad FC</p>
        {loading && <p className="loading">Loading…</p>}
        {!loading && news.length === 0 && <p className="empty">No news articles yet.</p>}
        <div className="grid g2">
          {news.map(n => (
            <div className="card" key={n.id}>
              {n.image && <img className="card-img" src={n.image} alt={n.title}/>}
              <div className="card-body">
                <h3>{n.title}</h3>
                <p className="meta" style={{margin:"4px 0 10px"}}>{new Date(n.date).toLocaleDateString("en-IN",{year:"numeric",month:"long",day:"numeric"})}</p>
                <p style={{fontSize:".9rem"}}>{n.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
