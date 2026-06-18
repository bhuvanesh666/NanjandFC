import { useEffect, useState } from "react";
import api from "../../api/axios";

const POS = { GK:"Goalkeeper", DEF:"Defender", MID:"Midfielder", FWD:"Forward" };

export default function AdminPlayers() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({});
  const [err, setErr] = useState("");

  const load = () => api.get("/players/admin/manage/").then(r=>setPlayers(r.data.results??r.data)).catch(()=>setErr("Failed to load.")).finally(()=>setLoading(false));
  useEffect(()=>{ load(); },[]);

  const startEdit = p => {
    setEditId(p.id);
    setForm({ position:p.position, jersey_number:p.jersey_number, goals:p.goals, assists:p.assists, matches_played:p.matches_played, yellow_cards:p.yellow_cards, red_cards:p.red_cards });
  };

  const save = async id => {
    try { await api.patch(`/players/admin/manage/${id}/`, form); setEditId(null); load(); }
    catch { setErr("Save failed."); }
  };

  const del = async id => {
    if(!window.confirm("Delete this player profile?")) return;
    try { await api.delete(`/players/admin/manage/${id}/`); load(); }
    catch { setErr("Delete failed."); }
  };

  if(loading) return <p className="loading">Loading…</p>;

  return (
    <div>
      <h2 style={{marginBottom:16}}>👥 Manage Players</h2>
      <p style={{color:"var(--muted)",fontSize:".88rem",marginBottom:14}}>
        Players appear here once they register and create their profile at /dashboard.
      </p>
      {err && <div className="err">{err}</div>}
      {players.length === 0
        ? <p className="empty">No player profiles yet.</p>
        : <div style={{overflowX:"auto"}}>
          <table>
            <thead><tr>
              <th>Player</th><th>Position</th><th>Jersey</th>
              <th>Goals</th><th>Assists</th><th>Matches</th><th>🟨</th><th>🟥</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {players.map(p=>(
                <tr key={p.id}>
                  <td><strong>{p.user?.username}</strong></td>
                  {editId===p.id ? <>
                    <td><select value={form.position} onChange={e=>setForm({...form,position:e.target.value})} style={{width:90}}>
                      {Object.entries(POS).map(([k,v])=><option key={k} value={k}>{k}</option>)}</select></td>
                    {["jersey_number","goals","assists","matches_played","yellow_cards","red_cards"].map(f=>(
                      <td key={f}><input type="number" value={form[f]} min="0" onChange={e=>setForm({...form,[f]:e.target.value})}/></td>
                    ))}
                    <td>
                      <button className="btn btn-primary btn-sm" onClick={()=>save(p.id)} style={{marginRight:4}}>Save</button>
                      <button className="btn btn-outline btn-sm" onClick={()=>setEditId(null)}>Cancel</button>
                    </td>
                  </> : <>
                    <td>{POS[p.position]||p.position}</td>
                    <td>{p.jersey_number}</td>
                    <td>{p.goals}</td><td>{p.assists}</td><td>{p.matches_played}</td>
                    <td>{p.yellow_cards}</td><td>{p.red_cards}</td>
                    <td>
                      <button className="btn btn-outline btn-sm" onClick={()=>startEdit(p)} style={{marginRight:4}}>Edit Stats</button>
                      <button className="btn btn-danger btn-sm" onClick={()=>del(p.id)}>Delete</button>
                    </td>
                  </>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
    </div>
  );
}
