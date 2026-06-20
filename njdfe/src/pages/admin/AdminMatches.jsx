import { useEffect, useState } from "react";
import api from "../../api/axios";
import { mediaUrl } from "../../api/media";

const EMPTY = { opponent:"", date:"", venue:"", competition:"", status:"upcoming" };

export default function AdminMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [summaryFor, setSummaryFor] = useState(null);
  const [err, setErr] = useState("");

  const load = () => {
    setLoading(true);
    api.get("/matches/")
      .then(r => setMatches(r.data.results ?? r.data))
      .catch(() => setErr("Failed to load matches."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };
  const openEdit = m => {
    setForm({ opponent: m.opponent, date: m.date.slice(0, 16), venue: m.venue, competition: m.competition || "", status: m.status });
    setEditId(m.id); setShowForm(true);
  };

  const submit = async e => {
    e.preventDefault(); setErr("");
    try {
      if (editId) await api.put(`/matches/${editId}/`, form);
      else await api.post("/matches/", form);
      setShowForm(false); load();
    } catch { setErr("Save failed. Check all fields."); }
  };

  const del = async id => {
    if (!window.confirm("Delete this match?")) return;
    try { await api.delete(`/matches/${id}/`); load(); }
    catch { setErr("Delete failed."); }
  };

  if (loading) return <p className="loading">Loading matches…</p>;
  if (summaryFor) return <SummaryEditor matchId={summaryFor} onBack={() => { setSummaryFor(null); load(); }} />;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 className="dash-title">📅 Matches</h2>
          <p className="dash-sub">Add, edit and manage match records</p>
        </div>
        <button className="btn btn-gold btn-sm" onClick={openCreate}>+ Add Match</button>
      </div>

      {err && <div className="err">{err}</div>}

      {showForm && (
        <div className="card" style={{ padding: 24, marginBottom: 24, background: "var(--black3)" }}>
          <h3 style={{ color: "var(--gold)", marginBottom: 16 }}>{editId ? "Edit Match" : "New Match"}</h3>
          <form onSubmit={submit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="fg"><label>Opponent *</label><input value={form.opponent} onChange={e => setForm({ ...form, opponent: e.target.value })} required /></div>
              <div className="fg"><label>Date & Time *</label><input type="datetime-local" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required /></div>
              <div className="fg"><label>Venue *</label><input value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} required /></div>
              <div className="fg"><label>Competition</label><input value={form.competition} onChange={e => setForm({ ...form, competition: e.target.value })} placeholder="e.g. District League" /></div>
              <div className="fg"><label>Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option value="upcoming">Upcoming</option>
                  <option value="played">Played</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button type="submit" className="btn btn-gold">{editId ? "Update" : "Create Match"}</button>
              <button type="button" className="btn btn-dark" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {matches.length === 0
        ? <p className="empty">No matches yet. Click "+ Add Match" to create one.</p>
        : <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr><th>Opponent</th><th>Date</th><th>Venue</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {matches.map(m => (
                  <tr key={m.id}>
                    <td><strong style={{ color: "var(--white)" }}>{m.opponent}</strong></td>
                    <td style={{ color: "var(--gray)" }}>{new Date(m.date).toLocaleString()}</td>
                    <td style={{ color: "var(--gray)" }}>{m.venue}</td>
                    <td><span className={`tag tag-${m.status}`}>{m.status}</span></td>
                    <td style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <button className="btn btn-dark btn-sm" onClick={() => openEdit(m)}>Edit</button>
                      {m.status === "played" && <button className="btn btn-gold btn-sm" onClick={() => setSummaryFor(m.id)}>📊 Summary</button>}
                      <button className="btn btn-danger btn-sm" onClick={() => del(m.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      }
    </div>
  );
}

function ListEditor({ title, items, onAdd, onChg, onDel }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ color: "var(--gold)", fontSize: "0.78rem", letterSpacing: 2, marginBottom: 10 }}>{title}</div>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input placeholder="Player name" value={item.player || ""} onChange={e => onChg(i, "player", e.target.value)} style={{ flex: 1 }} />
          <input type="number" placeholder="Min" value={item.minute || ""} style={{ width: 70 }} onChange={e => onChg(i, "minute", e.target.value)} />
          <button type="button" className="btn btn-danger btn-sm" onClick={() => onDel(i)}>✕</button>
        </div>
      ))}
      <button type="button" className="btn btn-dark btn-sm" onClick={onAdd}>+ Add</button>
    </div>
  );
}

function SummaryEditor({ matchId, onBack }) {
  const [s, setS] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(""); const [err, setErr] = useState("");

  useEffect(() => {
    api.get(`/matches/${matchId}/summary/`).then(r => setS(r.data)).catch(() => setErr("Failed to load summary."));
    api.get(`/matches/photos/?match=${matchId}`).then(r => setPhotos(r.data.results ?? r.data)).catch(() => {});
  }, [matchId]);

  const chg = e => setS({ ...s, [e.target.name]: e.target.value });
  const lstChg = (f, i, k, v) => { const l = [...(s[f] || [])]; l[i] = { ...l[i], [k]: v }; setS({ ...s, [f]: l }); };
  const lstAdd = (f, tpl) => setS({ ...s, [f]: [...(s[f] || []), tpl] });
  const lstDel = (f, i) => { const l = [...(s[f] || [])]; l.splice(i, 1); setS({ ...s, [f]: l }); };

  const save = async e => {
    e.preventDefault(); setSaving(true); setMsg(""); setErr("");
    try { await api.put(`/matches/${matchId}/summary/`, s); setMsg("Summary saved successfully!"); }
    catch { setErr("Save failed."); }
    finally { setSaving(false); }
  };

  const uploadPhoto = async e => {
    e.preventDefault(); if (!photoFile) return;
    const fd = new FormData(); fd.append("match", matchId); fd.append("image", photoFile);
    try {
      await api.post("/matches/photos/", fd);
      const r = await api.get(`/matches/photos/?match=${matchId}`);
      setPhotos(r.data.results ?? r.data); setPhotoFile(null);
    } catch { setErr("Photo upload failed."); }
  };

  const delPhoto = async id => {
    await api.delete(`/matches/photos/${id}/`);
    setPhotos(photos.filter(p => p.id !== id));
  };

  if (!s) return <p className="loading">Loading summary…</p>;

  return (
    <div>
      <button className="btn btn-dark btn-sm" onClick={onBack} style={{ marginBottom: 20 }}>← Back to Matches</button>
      <h2 className="dash-title">📊 Match Summary</h2>
      <p className="dash-sub">Enter match details, scorers, cards and photos</p>
      {msg && <div className="suc">{msg}</div>}
      {err && <div className="err">{err}</div>}

      <form onSubmit={save}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
          {[["home_score","Home Score"],["away_score","Away Score"],["possession","Possession %"],["shots_on_target","Shots on Target"],["fouls","Fouls"]].map(([n, l]) => (
            <div className="fg" key={n}><label>{l}</label>
              <input type="number" name={n} value={s[n] || 0} onChange={chg} min="0" max={n === "possession" ? 100 : undefined} />
            </div>
          ))}
          <div className="fg"><label>Man of the Match</label>
            <input name="man_of_the_match" value={s.man_of_the_match || ""} onChange={chg} placeholder="Player name" />
          </div>
        </div>

        <ListEditor title="⚽ GOAL SCORERS" items={s.scorers || []} onAdd={() => lstAdd("scorers", { player: "", minute: "" })} onChg={(i, k, v) => lstChg("scorers", i, k, v)} onDel={i => lstDel("scorers", i)} />
        <ListEditor title="🎯 ASSISTS" items={s.assists || []} onAdd={() => lstAdd("assists", { player: "", minute: "" })} onChg={(i, k, v) => lstChg("assists", i, k, v)} onDel={i => lstDel("assists", i)} />
        <ListEditor title="🟨 YELLOW CARDS" items={s.yellow_cards || []} onAdd={() => lstAdd("yellow_cards", { player: "", minute: "" })} onChg={(i, k, v) => lstChg("yellow_cards", i, k, v)} onDel={i => lstDel("yellow_cards", i)} />
        <ListEditor title="🟥 RED CARDS" items={s.red_cards || []} onAdd={() => lstAdd("red_cards", { player: "", minute: "" })} onChg={(i, k, v) => lstChg("red_cards", i, k, v)} onDel={i => lstDel("red_cards", i)} />

        <div style={{ marginBottom: 20 }}>
          <div style={{ color: "var(--gold)", fontSize: "0.78rem", letterSpacing: 2, marginBottom: 10 }}>🔄 SUBSTITUTIONS</div>
          {(s.substitutions || []).map((sub, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input placeholder="Player Out" value={sub.out || ""} onChange={e => lstChg("substitutions", i, "out", e.target.value)} />
              <input placeholder="Player In" value={sub.in || ""} onChange={e => lstChg("substitutions", i, "in", e.target.value)} />
              <input type="number" placeholder="Min" value={sub.minute || ""} style={{ width: 70 }} onChange={e => lstChg("substitutions", i, "minute", e.target.value)} />
              <button type="button" className="btn btn-danger btn-sm" onClick={() => lstDel("substitutions", i)}>✕</button>
            </div>
          ))}
          <button type="button" className="btn btn-dark btn-sm" onClick={() => lstAdd("substitutions", { out: "", in: "", minute: "" })}>+ Add Sub</button>
        </div>

        <button type="submit" className="btn btn-gold" disabled={saving}>{saving ? "Saving…" : "💾 Save Summary"}</button>
      </form>

      <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "28px 0" }} />
      <h3 style={{ color: "var(--white)", marginBottom: 14 }}>📸 Match Photos</h3>
      <form onSubmit={uploadPhoto} style={{ display: "flex", gap: 10, marginBottom: 20, alignItems: "flex-end" }}>
        <input type="file" accept="image/*" onChange={e => setPhotoFile(e.target.files[0])} style={{ color: "var(--gray)" }} />
        <button type="submit" className="btn btn-gold btn-sm">Upload</button>
      </form>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 12 }}>
        {photos.map(ph => (
          <div key={ph.id} className="card">
            <img src={mediaUrl(ph.image)} alt="" style={{ width: "100%", height: 120, objectFit: "cover" }} />
            <div style={{ padding: 8 }}>
              <button className="btn btn-danger btn-sm" onClick={() => delPhoto(ph.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
