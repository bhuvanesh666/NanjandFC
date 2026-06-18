import { useEffect, useState } from "react";
import api from "../api/axios";

const POS = { GK:"Goalkeeper", DEF:"Defender", MID:"Midfielder", FWD:"Forward" };

export default function Players() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    api.get("/players/all/")
      .then(r => setPlayers(r.data.results ?? r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const list = filter === "ALL" ? players : players.filter(p => p.position === filter);

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Our Squad</h1>
        <p className="page-sub">Meet the players of Nanjanad Football Club</p>

        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:22}}>
          {["ALL","GK","DEF","MID","FWD"].map(p => (
            <button key={p}
              className={`btn btn-sm ${filter===p?"btn-primary":"btn-outline"}`}
              onClick={() => setFilter(p)}>
              {p === "ALL" ? "All Players" : POS[p]}
            </button>
          ))}
        </div>

        {loading && <p className="loading">Loading players…</p>}
        {!loading && list.length === 0 && <p className="empty">No players found.</p>}

        <div className="grid g4">
          {list.map(p => (
            <div className="card" key={p.id}>
              {p.photo
                ? <img className="card-img" src={p.photo} alt={p.user?.username}/>
                : <div className="card-img" style={{fontSize:"2rem",color:"var(--border)"}}>👤</div>
              }
              <div className="card-body">
                <span className="jersey">{p.jersey_number || "—"}</span>
                <h3 style={{margin:"4px 0 2px"}}>{p.user?.username}</h3>
                <p className="pos-tag">{POS[p.position] || p.position}</p>
                <div className="p-stats">
                  <span>⚽ {p.goals}</span>
                  <span>🎯 {p.assists}</span>
                  <span>📅 {p.matches_played}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
