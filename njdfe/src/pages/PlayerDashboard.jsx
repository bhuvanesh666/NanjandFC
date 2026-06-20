import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const POS = { GK:"Goalkeeper", DEF:"Defender", MID:"Midfielder", FWD:"Forward" };

export default function PlayerDashboard() {
  const [tab, setTab] = useState("Profile");
  const { user } = useAuth();
  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <h1>My Dashboard</h1>
          <p>Welcome, {user?.username}</p>
        </div>
      </div>
      <div className="page">
        <div className="container">
          <div className="dash">
            <div className="dash-side">
              <h4>Menu</h4>
              {["Profile","Documents","Upcoming Matches"].map(t => (
                <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>{t}</button>
              ))}
            </div>
            <div className="dash-main">
              {tab === "Profile"          && <ProfileTab />}
              {tab === "Documents"        && <DocsTab />}
              {tab === "Upcoming Matches" && <UpcomingTab />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileTab() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ position:"MID", jersey_number:"", dob:"", bio:"" });
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(""); const [err, setErr] = useState("");

  useEffect(() => {
    api.get("/players/me/").then(r => {
      setProfile(r.data);
      setForm({ position: r.data.position || "MID", jersey_number: r.data.jersey_number || "", dob: r.data.dob || "", bio: r.data.bio || "" });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const save = async e => {
    e.preventDefault(); setSaving(true); setMsg(""); setErr("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      if (photo) fd.append("photo", photo);
      const r = await api.patch("/players/me/", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setProfile({ ...profile, ...r.data }); setMsg("Profile saved!");
    } catch { setErr("Failed to save."); }
    finally { setSaving(false); }
  };

  if (loading) return <p className="loading">Loading…</p>;

  return (
    <div>
      <h2 className="dash-title">My Profile</h2>
      <p className="dash-sub">Update your info and photo</p>
      {msg && <div className="suc">{msg}</div>}
      {err && <div className="err">{err}</div>}

      <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 24 }}>
        {profile?.photo
          ? <img src={profile.photo} alt="" style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--gold)" }} />
          : <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--black3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", border: "2px solid var(--border)" }}>👤</div>
        }
        <div>
          <div style={{ color: "var(--white)", fontWeight: 700, fontSize: "1.1rem" }}>{profile?.user?.username}</div>
          <div style={{ color: "var(--gray)", fontSize: "0.85rem" }}>{profile?.user?.email}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
        {[["⚽",profile?.goals ?? 0,"Goals"],["🎯",profile?.assists ?? 0,"Assists"],["📅",profile?.matches_played ?? 0,"Matches"]].map(([ic, v, l]) => (
          <div key={l} className="card">
            <div className="card-body" style={{ textAlign: "center", padding: 16 }}>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--gold)" }}>{ic} {v}</div>
              <div style={{ color: "var(--gray)", fontSize: "0.78rem", letterSpacing: 1, marginTop: 4 }}>{l}</div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={save}>
        <div className="fg"><label>Profile Photo</label><input type="file" accept="image/*" onChange={e => setPhoto(e.target.files[0])} style={{ color: "var(--gray)" }} /></div>
        <div className="fg"><label>Position</label>
          <select value={form.position} onChange={e => setForm({ ...form, position: e.target.value })}>
            {Object.entries(POS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div className="fg"><label>Jersey Number</label><input type="number" value={form.jersey_number} onChange={e => setForm({ ...form, jersey_number: e.target.value })} min="0" max="99" /></div>
        <div className="fg"><label>Date of Birth</label><input type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} /></div>
        <div className="fg"><label>Bio</label><textarea rows="3" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} /></div>
        <button className="btn btn-gold" disabled={saving}>{saving ? "Saving…" : "Save Profile"}</button>
      </form>
    </div>
  );
}

function DocsTab() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dtype, setDtype] = useState("aadhar");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState(""); const [err, setErr] = useState("");
  const LABELS = { aadhar:"Aadhar Card", pan:"PAN Card", license:"Driving License" };

  const load = () => api.get("/players/me/documents/").then(r => setDocs(r.data.results ?? r.data)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const upload = async e => {
    e.preventDefault(); if (!file) { setErr("Select a file."); return; }
    setUploading(true); setErr(""); setMsg("");
    try {
      const fd = new FormData(); fd.append("doc_type", dtype); fd.append("file", file);
      await api.post("/players/me/documents/", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setMsg("Uploaded! Awaiting admin verification."); setFile(null); load();
    } catch { setErr("Upload failed."); }
    finally { setUploading(false); }
  };

  return (
    <div>
      <h2 className="dash-title">My Documents</h2>
      <p className="dash-sub">Upload identity documents for verification</p>
      {msg && <div className="suc">{msg}</div>}
      {err && <div className="err">{err}</div>}

      <form onSubmit={upload} style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div className="fg" style={{ marginBottom: 0 }}>
          <label>Document Type</label>
          <select value={dtype} onChange={e => setDtype(e.target.value)}>
            {Object.entries(LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div className="fg" style={{ marginBottom: 0 }}>
          <label>File (PDF or Image)</label>
          <input type="file" accept=".pdf,image/*" onChange={e => setFile(e.target.files[0])} style={{ color: "var(--gray)" }} />
        </div>
        <button className="btn btn-gold btn-sm" disabled={uploading}>{uploading ? "Uploading…" : "Upload"}</button>
      </form>

      {loading ? <p className="loading">Loading…</p> : docs.length === 0 ? <p className="empty">No documents uploaded yet.</p> :
        <table>
          <thead><tr><th>Type</th><th>Status</th><th>Uploaded</th><th>File</th></tr></thead>
          <tbody>
            {docs.map(d => (
              <tr key={d.id}>
                <td>{LABELS[d.doc_type] || d.doc_type}</td>
                <td><span className={`badge badge-${d.status}`}>{d.status}</span></td>
                <td style={{ color: "var(--gray)" }}>{new Date(d.uploaded_at).toLocaleDateString()}</td>
                <td><a href={d.file} target="_blank" rel="noreferrer" className="btn btn-dark btn-sm">View</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    </div>
  );
}

function UpcomingTab() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get("/matches/?status=upcoming").then(r => setMatches(r.data.results ?? r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);
  if (loading) return <p className="loading">Loading…</p>;
  return (
    <div>
      <h2 className="dash-title">Upcoming Matches</h2>
      <p className="dash-sub">Your next scheduled fixtures</p>
      {matches.length === 0 ? <p className="empty">No upcoming matches.</p> :
        <div style={{ display: "grid", gap: 16 }}>
          {matches.map(m => (
            <div key={m.id} className="card">
              <div className="card-body">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <div className="match-vs" style={{ fontSize: "1.3rem" }}>vs {m.opponent}</div>
                  <span className="tag tag-upcoming">Upcoming</span>
                </div>
                <p className="meta">📅 {new Date(m.date).toLocaleString("en-IN")}</p>
                <p className="meta">📍 {m.venue}{m.competition ? ` · 🏆 ${m.competition}` : ""}</p>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}
