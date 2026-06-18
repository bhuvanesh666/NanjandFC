import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [tab, setTab] = useState("upcoming");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get(`/matches/?status=${tab}`)
      .then(r => setMatches(r.data.results ?? r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tab]);

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Matches</h1>
        <p className="page-sub">Fixtures, results and match summaries</p>

        <div style={{display:"flex",gap:10,marginBottom:22}}>
          {["upcoming","played"].map(t => (
            <button key={t} className={`btn btn-sm ${tab===t?"btn-primary":"btn-outline"}`}
              onClick={() => { setTab(t); setExpanded(null); }}>
              {t === "upcoming" ? "Upcoming" : "Results"}
            </button>
          ))}
        </div>

        {loading && <p className="loading">Loading…</p>}
        {!loading && matches.length === 0 && <p className="empty">No {tab} matches found.</p>}

        <div className="grid g2">
          {matches.map(m => (
            <div className="card" key={m.id}>
              <div className="card-body">
                <div className="match-head">
                  <h3>vs {m.opponent}</h3>
                  <span className={`tag tag-${m.status}`}>{m.status}</span>
                </div>
                <p className="meta">
                  📅 {new Date(m.date).toLocaleString()}<br/>
                  📍 {m.venue}{m.competition ? ` · 🏆 ${m.competition}` : ""}
                </p>
                {m.status === "played" && m.summary && (
                  <div className="score">{m.summary.home_score} – {m.summary.away_score}</div>
                )}
                {m.status === "played" && m.summary && (
                  <button className="btn btn-outline btn-sm" style={{marginTop:10}}
                    onClick={() => setExpanded(expanded === m.id ? null : m.id)}>
                    {expanded === m.id ? "Hide Summary ▲" : "View Summary ▼"}
                  </button>
                )}
                {expanded === m.id && m.summary && (
                  <div style={{marginTop:14,borderTop:"1px solid var(--border)",paddingTop:14,fontSize:".88rem"}}>
                    <p>🏃 Possession: {m.summary.possession}% | Shots: {m.summary.shots_on_target} | Fouls: {m.summary.fouls}</p>
                    {m.summary.man_of_the_match && <p>⭐ MOTM: {m.summary.man_of_the_match}</p>}
                    {m.summary.scorers?.length > 0 && <>
                      <p style={{marginTop:8,fontWeight:600}}>⚽ Scorers</p>
                      <ul style={{marginLeft:16}}>{m.summary.scorers.map((s,i)=><li key={i}>{s.player} {s.minute}'</li>)}</ul>
                    </>}
                    {m.summary.assists?.length > 0 && <>
                      <p style={{marginTop:8,fontWeight:600}}>🎯 Assists</p>
                      <ul style={{marginLeft:16}}>{m.summary.assists.map((a,i)=><li key={i}>{a.player} {a.minute}'</li>)}</ul>
                    </>}
                    {(m.summary.yellow_cards?.length > 0 || m.summary.red_cards?.length > 0) && <>
                      <p style={{marginTop:8,fontWeight:600}}>🟨🟥 Cards</p>
                      <ul style={{marginLeft:16}}>
                        {m.summary.yellow_cards?.map((c,i)=><li key={`y${i}`}>🟨 {c.player} {c.minute}'</li>)}
                        {m.summary.red_cards?.map((c,i)=><li key={`r${i}`}>🟥 {c.player} {c.minute}'</li>)}
                      </ul>
                    </>}
                    {m.photos?.length > 0 && (
                      <div className="grid g3" style={{marginTop:12}}>
                        {m.photos.map(ph=>(
                          <img key={ph.id} src={ph.image} alt="" style={{borderRadius:6,height:90,objectFit:"cover",width:"100%"}}/>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
