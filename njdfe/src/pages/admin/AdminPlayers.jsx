import { useEffect, useState } from "react";
import api from "../../api/axios";

const POS = { GK:"Goalkeeper", DEF:"Defender", MID:"Midfielder", FWD:"Forward" };

export default function AdminPlayers() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({});
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const load = () => {
    setLoading(true);
    api.get("/players/admin/manage/")
      .then(r => setPlayers(r.data.results ?? r.data))
      .catch(() => setErr("Failed to load players."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const startEdit = p => {
    setEditId(p.id);
    setForm({
      position: p.position,
      jersey_number: p.jersey_number,
      goals: p.goals,
      assists: p.assists,
      matches_played: p.matches_played,
      yellow_cards: p.yellow_cards,
      red_cards: p.red_cards,
    });
  };

  const save = async id => {
    try {
      await api.patch(`/players/admin/manage/${id}/`, form);
      setMsg("Player updated!"); setEditId(null); load();
    } catch { setErr("Save failed."); }
  };

  const del = async id => {
    if (!window.confirm("Delete this player profile?")) return;
    try { await api.delete(`/players/admin/manage/${id}/`); load(); }
    catch { setErr("Delete failed."); }
  };

  if (loading) return <p className="loading">Loading players…</p>;

  return (
    <div>
      <h2 className="dash-title">👥 Players</h2>
      <p className="dash-sub">Edit stats and manage player profiles</p>
      {err && <div className="err">{err}</div>}
      {msg && <div className="suc">{msg}</div>}

      {players.length === 0
        ? <p className="empty">No player profiles yet. Players must register and set up their profile first.</p>
        : <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Player</th><th>Position</th><th>Jersey</th>
                  <th>Goals</th><th>Assists</th><th>Matches</th>
                  <th>🟨</th><th>🟥</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {players.map(p => (
                  <tr key={p.id}>
                    <td><strong style={{ color: "var(--white)" }}>{p.user?.username}</strong></td>
                    {editId === p.id ? (
                      <>
                        <td>
                          <select value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} style={{ width: 60 }}>
                            {Object.entries(POS).map(([k]) => <option key={k} value={k}>{k}</option>)}
                          </select>
                        </td>
                        {["jersey_number","goals","assists","matches_played","yellow_cards","red_cards"].map(f => (
                          <td key={f}>
                            <input type="number" value={form[f] ?? 0} min="0"
                              onChange={e => setForm({ ...form, [f]: e.target.value })} />
                          </td>
                        ))}
                        <td style={{ display: "flex", gap: 6 }}>
                          <button className="btn btn-gold btn-sm" onClick={() => save(p.id)}>Save</button>
                          <button className="btn btn-dark btn-sm" onClick={() => setEditId(null)}>Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{POS[p.position] || p.position}</td>
                        <td>{p.jersey_number}</td>
                        <td style={{ color: "var(--gold)", fontWeight: 700 }}>{p.goals}</td>
                        <td>{p.assists}</td>
                        <td>{p.matches_played}</td>
                        <td>{p.yellow_cards}</td>
                        <td>{p.red_cards}</td>
                        <td style={{ display: "flex", gap: 6 }}>
                          <button className="btn btn-dark btn-sm" onClick={() => startEdit(p)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => del(p.id)}>Delete</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      }
    </div>
  );
}
